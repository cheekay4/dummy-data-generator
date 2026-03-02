'use client'

import { useState } from 'react'
import type { VocEntry } from '@/lib/types'

const CATEGORY_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  pain_point:          { label: '課題',       emoji: '😰', color: 'bg-red-50 text-red-700' },
  need:                { label: 'ニーズ',     emoji: '💡', color: 'bg-blue-50 text-blue-700' },
  objection:           { label: '懸念',       emoji: '🤔', color: 'bg-amber-50 text-amber-700' },
  praise:              { label: '好評',       emoji: '😊', color: 'bg-green-50 text-green-700' },
  competitor_mention:  { label: '競合言及',   emoji: '⚔️', color: 'bg-purple-50 text-purple-700' },
  pricing_feedback:    { label: '料金FB',     emoji: '💰', color: 'bg-orange-50 text-orange-700' },
}

const SENTIMENT_EMOJI: Record<string, string> = {
  positive: '👍',
  negative: '👎',
  neutral: '➖',
}

type VocWithLead = VocEntry & { lead?: { company_name: string } }

export default function VocList({
  entries,
  categoryCounts,
}: {
  entries: VocWithLead[]
  categoryCounts: Record<string, number>
}) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.category === filter)

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-4">📊</p>
        <p className="text-stone-600 font-medium">VoC データがまだありません</p>
        <p className="text-stone-400 text-sm mt-2">返信メールが処理されると、自動的にVoCが抽出されます</p>
      </div>
    )
  }

  return (
    <div>
      {/* カテゴリタブ */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          全て ({entries.length})
        </button>
        {Object.entries(categoryCounts).map(([cat, count]) => {
          const info = CATEGORY_INFO[cat] ?? { label: cat, emoji: '📝', color: '' }
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {info.emoji} {info.label} ({count})
            </button>
          )
        })}
      </div>

      {/* エントリ一覧 */}
      <div className="space-y-3">
        {filtered.map((entry) => {
          const info = CATEGORY_INFO[entry.category] ?? { label: entry.category, emoji: '📝', color: 'bg-stone-50 text-stone-600' }
          return (
            <div key={entry.id} className="bg-white rounded-2xl border border-stone-200 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>
                    {info.emoji} {info.label}
                  </span>
                  <span className="text-xs text-stone-400">
                    {SENTIMENT_EMOJI[entry.sentiment ?? ''] ?? ''} {entry.lead?.company_name ?? ''}
                  </span>
                </div>
                <span className="text-xs text-stone-400 shrink-0">
                  {new Date(entry.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-sm text-stone-800 font-medium">{entry.content}</p>
              {entry.raw_quote && (
                <p className="text-xs text-stone-500 mt-1 italic border-l-2 border-stone-200 pl-2">
                  &quot;{entry.raw_quote}&quot;
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
