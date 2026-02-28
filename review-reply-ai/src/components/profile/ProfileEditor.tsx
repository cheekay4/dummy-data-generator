'use client'

import { useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { AXIS_CONFIG, mapToDISC, DISC_LABELS } from '@/lib/constants'
import PersonalityRadar from './PersonalityRadar'
import type { ReplyProfile, AxisKey } from '@/lib/types'

interface Props {
  profile?: Partial<ReplyProfile>
  onSaved: () => void
  onCancel: () => void
}

const BUSINESS_TYPES = [
  '飲食店（カフェ・レストラン・居酒屋）',
  '美容院・ネイルサロン',
  'クリニック・歯科',
  'ホテル・旅館',
  '小売店・雑貨店',
  '整体・マッサージ',
  '不動産',
  'その他（自由記述）',
]

export default function ProfileEditor({ profile, onSaved, onCancel }: Props) {
  const [name, setName] = useState(profile?.profile_name ?? 'デフォルト')
  const [shopName, setShopName] = useState(profile?.shop_name ?? '')
  const [shopDesc, setShopDesc] = useState(profile?.shop_description ?? '')
  const [businessType, setBusinessType] = useState(
    profile?.business_type ?? '飲食店（カフェ・レストラン・居酒屋）'
  )
  const [speakingStyle, setSpeakingStyle] = useState(profile?.speaking_style ?? '')
  const [axes, setAxes] = useState<Record<AxisKey, number>>({
    agreeableness: profile?.agreeableness ?? 2.5,
    extraversion: profile?.extraversion ?? 2.5,
    conscientiousness: profile?.conscientiousness ?? 2.5,
    openness: profile?.openness ?? 2.5,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const disc = mapToDISC(axes)
  const discLabel = DISC_LABELS[disc]

  async function handleSave() {
    setSaving(true)
    setError('')
    if (!isSupabaseConfigured()) {
      setError('Supabase が設定されていません')
      setSaving(false)
      return
    }
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setSaving(false)
      return
    }

    const disc_type = mapToDISC(axes)
    const payload = {
      user_id: user.id,
      profile_name: name,
      shop_name: shopName || null,
      shop_description: shopDesc || null,
      business_type: businessType,
      speaking_style: speakingStyle || null,
      disc_type,
      agreeableness: axes.agreeableness,
      extraversion: axes.extraversion,
      conscientiousness: axes.conscientiousness,
      openness: axes.openness,
      updated_at: new Date().toISOString(),
    }

    let err
    if (profile?.id) {
      const res = await supabase.from('reply_profiles').update(payload).eq('id', profile.id)
      err = res.error
    } else {
      const res = await supabase.from('reply_profiles').insert(payload)
      err = res.error
    }

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      onSaved()
    }
  }

  function handleAxisChange(key: AxisKey, value: number) {
    // 0.5刻みに丸める
    const snapped = Math.round(value * 2) / 2
    setAxes((prev) => ({ ...prev, [key]: snapped }))
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* プロファイル名 */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">プロファイル名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 私のお店、田中、うちの店長"
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* 4軸スライダー */}
      <div className="bg-stone-50 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-700">返信スタイル（4軸）</p>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
            参考: {discLabel.name.split('（')[0]}
          </span>
        </div>

        {AXIS_CONFIG.map((ax) => (
          <div key={ax.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-stone-400">{ax.left.split('・')[0]}</span>
              <span className="text-sm font-medium text-stone-700">
                {ax.label}{' '}
                <span className="text-xs text-stone-400">{axes[ax.key].toFixed(1)}</span>
              </span>
              <span className="text-xs text-stone-400">{ax.right.split('・')[0]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={axes[ax.key]}
              onChange={(e) => handleAxisChange(ax.key, Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        ))}

        <div className="flex justify-center pt-2">
          <PersonalityRadar
            agreeableness={axes.agreeableness}
            extraversion={axes.extraversion}
            conscientiousness={axes.conscientiousness}
            openness={axes.openness}
            size={160}
          />
        </div>
      </div>

      {/* 話し方のクセ */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          話し方のクセ（任意）
        </label>
        <textarea
          value={speakingStyle}
          onChange={(e) => setSpeakingStyle(e.target.value)}
          placeholder="例）「〜ですね！」をよく使う、関西弁っぽく、絵文字は少なめ"
          rows={2}
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      {/* お店情報 */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-stone-700">お店の情報（任意）</p>
        <div>
          <label className="block text-xs text-stone-500 mb-1">業種</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">店名</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="例: カフェ山田"
            className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">お店のこだわり・特徴</label>
          <textarea
            value={shopDesc}
            onChange={(e) => setShopDesc(e.target.value)}
            placeholder="例: 地元食材にこだわった手打ちパスタが自慢の家族経営の小さなレストラン"
            rows={2}
            className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 border border-stone-300 hover:border-stone-400 text-stone-600 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}
