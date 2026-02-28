'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import { mapToDISC, DISC_LABELS, PERSONA_MODIFIERS } from '@/lib/constants'
import type { ReplyProfile } from '@/lib/types'
import Link from 'next/link'

interface Props {
  selectedProfileId: string | null
  selectedModifierId: string | null
  isPro: boolean
  onProfileChange: (id: string | null) => void
  onModifierChange: (id: string | null) => void
}

export default function ProfileSelector({
  selectedProfileId,
  selectedModifierId,
  isPro,
  onProfileChange,
  onModifierChange,
}: Props) {
  const [profiles, setProfiles] = useState<ReplyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [configured] = useState(() => isSupabaseConfigured())

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setIsLoggedIn(true)
      const { data } = await supabase
        .from('reply_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      setProfiles(data ?? [])
      if (data && data.length > 0 && !selectedProfileId) {
        const def = data.find((p) => p.is_default) ?? data[0]
        onProfileChange(def.id)
      }
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured])

  if (!configured || !isLoggedIn || loading) return null

  if (profiles.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        <p className="text-stone-700 mb-2">返信プロファイルがまだ設定されていません。</p>
        <Link href="/profile/create" className="text-amber-600 hover:text-amber-700 font-medium underline">
          返信DNAを作りましょう →
        </Link>
      </div>
    )
  }

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId)
  const selectedMod = PERSONA_MODIFIERS.find((m) => m.id === selectedModifierId)

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
      {/* プロファイル選択 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">👤 返信プロファイル</p>
          <Link href="/profile" className="text-xs text-amber-600 hover:text-amber-700">
            編集
          </Link>
        </div>
        <select
          value={selectedProfileId ?? ''}
          onChange={(e) => onProfileChange(e.target.value || null)}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">プロファイルなし（トーン選択を使用）</option>
          {profiles.map((p) => {
            const disc = p.disc_type ?? mapToDISC({
              agreeableness: p.agreeableness,
              extraversion: p.extraversion,
              conscientiousness: p.conscientiousness,
              openness: p.openness,
            })
            return (
              <option key={p.id} value={p.id}>
                {p.profile_name} — {DISC_LABELS[disc].name.split('（')[0]}
              </option>
            )
          })}
        </select>

        {selectedProfile && (
          <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-stone-400">
            <span>温かみ: {selectedProfile.agreeableness}</span>
            <span>社交性: {selectedProfile.extraversion}</span>
            <span>丁寧さ: {selectedProfile.conscientiousness}</span>
            <span>独自性: {selectedProfile.openness}</span>
          </div>
        )}
      </div>

      {/* 補助スタイル選択 */}
      {selectedProfileId && (
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">🔧 補助スタイル（任意）</p>
            {!isPro && (
              <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium">
                🔒 Pro
              </span>
            )}
          </div>
          <select
            value={selectedModifierId ?? ''}
            onChange={(e) => {
              if (!isPro && e.target.value) {
                alert('補助スタイルはProプラン限定です。アップグレードするとご利用いただけます。')
                return
              }
              onModifierChange(e.target.value || null)
            }}
            disabled={!isPro}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">なし（あなたの性格そのまま）</option>
            {PERSONA_MODIFIERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.icon} {m.name} — {m.when}
              </option>
            ))}
          </select>
          {selectedMod && isPro && (
            <p className="text-xs text-stone-400 mt-1">{selectedMod.description}</p>
          )}
        </div>
      )}
    </div>
  )
}
