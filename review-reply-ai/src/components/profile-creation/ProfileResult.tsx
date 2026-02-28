'use client'

import { useState, useEffect } from 'react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import { mapToDISC, DISC_LABELS } from '@/lib/constants'
import PersonalityRadar from '@/components/profile/PersonalityRadar'
import AuthModal from '@/components/auth/AuthModal'
import type { AxisKey, DISCType, CreationMethod } from '@/lib/types'
import type { AnalyzeWritingResult } from '@/lib/types'
import { getSampleReview, getSampleReply } from './sampleReplies'

const PENDING_DIAGNOSIS_KEY = 'rr_pending_diagnosis'

interface Props {
  scores: Record<AxisKey, number>
  analysisData?: AnalyzeWritingResult | null
  businessType?: string
  creationMethod: CreationMethod
  onSaved: () => void
  isAnonymous?: boolean
}

export default function ProfileResult({
  scores,
  analysisData,
  businessType = '飲食店（カフェ・レストラン・居酒屋）',
  creationMethod,
  onSaved,
  isAnonymous = false,
}: Props) {
  const [profileName, setProfileName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)

  const disc = mapToDISC(scores) as DISCType
  const discLabel = DISC_LABELS[disc]

  const analysis = analysisData?.analysis ?? null
  const speakingPatterns = analysisData?.speaking_patterns ?? []

  const sampleReview = getSampleReview(businessType)
  const sampleReply = getSampleReply(businessType, disc)

  // 匿名モードでは診断結果を sessionStorage に保存（ログイン後のインポート用）
  useEffect(() => {
    if (!isAnonymous) return
    const payload = JSON.stringify({
      scores,
      disc,
      businessType,
      creationMethod,
    })
    sessionStorage.setItem(PENDING_DIAGNOSIS_KEY, payload)
  }, [isAnonymous, scores, disc, businessType, creationMethod])

  async function handleSave() {
    if (!profileName.trim()) {
      setError('プロファイル名を入力してください')
      return
    }
    setSaving(true)
    setError('')

    if (!isSupabaseConfigured()) {
      setError('Supabase が設定されていません')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setSaving(false)
      return
    }

    const payload = {
      user_id: user.id,
      profile_name: profileName.trim(),
      agreeableness: scores.agreeableness,
      extraversion: scores.extraversion,
      conscientiousness: scores.conscientiousness,
      openness: scores.openness,
      disc_type: disc,
      analysis_text: analysis,
      speaking_style: analysisData?.speaking_patterns?.join('、') ?? null,
      creation_method: creationMethod,
      business_type: businessType,
      is_default: false,
      updated_at: new Date().toISOString(),
    }

    const { error: dbError } = await supabase.from('reply_profiles').insert(payload)
    setSaving(false)
    if (dbError) {
      setError(dbError.message)
    } else {
      sessionStorage.removeItem(PENDING_DIAGNOSIS_KEY)
      onSaved()
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <p className="text-2xl mb-2">📊</p>
        <h2 className="text-xl font-bold text-stone-800">あなたの返信DNAができました</h2>
        {isAnonymous && (
          <p className="text-sm text-amber-600 mt-1 font-medium">
            診断完了！保存して実際の口コミ返信に使ってみましょう
          </p>
        )}
      </div>

      {/* レーダーチャート + スコア */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-shrink-0">
            <PersonalityRadar
              agreeableness={scores.agreeableness}
              extraversion={scores.extraversion}
              conscientiousness={scores.conscientiousness}
              openness={scores.openness}
              size={180}
            />
          </div>
          <div className="flex-1 space-y-2">
            {[
              { label: '温かみ', value: scores.agreeableness, color: 'bg-amber-400' },
              { label: '社交性', value: scores.extraversion, color: 'bg-violet-400' },
              { label: '丁寧さ', value: scores.conscientiousness, color: 'bg-blue-400' },
              { label: '独自性', value: scores.openness, color: 'bg-emerald-400' },
            ].map((ax) => (
              <div key={ax.label} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 w-12">{ax.label}</span>
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div
                    className={`${ax.color} h-2 rounded-full`}
                    style={{ width: `${(ax.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-stone-500 w-6">{ax.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 分析テキスト（テキスト学習のみ） */}
      {analysis && (
        <div className="border border-stone-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
            ── あなたの返信の特徴
          </p>
          <p className="text-sm text-stone-700 leading-relaxed">{analysis}</p>

          {speakingPatterns.length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <p className="text-xs font-medium text-stone-500 mb-2">💡 AIが見つけたあなたの「クセ」</p>
              <ul className="space-y-1">
                {speakingPatterns.map((p, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-1.5">
                    <span className="text-amber-400 flex-shrink-0">・</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 返信例 */}
      <div className="border border-stone-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
          ── あなたの返信DNAで生成するとこうなります
        </p>
        <div className="bg-stone-50 rounded-xl p-3 mb-2">
          <p className="text-xs text-stone-400 mb-1">サンプル口コミ</p>
          <p className="text-sm text-stone-600">「{sampleReview}」</p>
        </div>
        <div className="text-center my-2 text-stone-300 text-xs">↓ あなたの返信DNA</div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-sm text-stone-700">{sampleReply}</p>
        </div>
      </div>

      {/* DISC参考タイプ */}
      <p className="text-xs text-stone-400 text-center">
        参考タイプ: {discLabel.name}寄り — {discLabel.description}
      </p>

      {/* 保存セクション：匿名 vs ログイン済みで分岐 */}
      {isAnonymous ? (
        <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center">
          <p className="font-bold text-stone-800 mb-1">この診断結果を保存して使う</p>
          <p className="text-sm text-stone-600 mb-4">
            無料アカウントを作ると、この返信DNAで毎日5回まで口コミ返信を自動生成できます。
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm transition-colors shadow-md"
          >
            無料で保存して口コミ返信に使う →
          </button>
          <p className="text-xs text-stone-400 mt-2">登録無料 · クレジットカード不要 · 1分で完了</p>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              このプロファイルに名前をつけてください
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="例）うちの店長、わたし、田中"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-stone-400 mt-1">あとからスライダーで微調整もできます</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !profileName.trim()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-md"
          >
            {saving ? '保存中...' : 'このプロファイルで始める →'}
          </button>
        </>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          nextPath="/profile/create?import=diagnosis"
        />
      )}
    </div>
  )
}
