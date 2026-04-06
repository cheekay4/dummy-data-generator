'use client'
import { useState } from 'react'
import type { Lead, LeadStatus } from '@/lib/types'

const PHASE_LABELS: Record<string, { label: string; emoji: string }> = {
  initial:      { label: '初期',     emoji: '⚪' },
  discovery:    { label: '発見',     emoji: '🔵' },
  qualified:    { label: '見込み',   emoji: '🟢' },
  evaluation:   { label: '検討中',   emoji: '🟣' },
  negotiation:  { label: '交渉中',   emoji: '🟡' },
  closed_lost:  { label: '失注',     emoji: '🔴' },
  paused:       { label: '一時停止', emoji: '⏸️' },
}

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  new:          { label: '新規',       color: 'bg-stone-100 text-stone-600' },
  analyzed:     { label: '分析済',     color: 'bg-blue-100 text-blue-700' },
  draft_ready:  { label: '下書き完了', color: 'bg-amber-100 text-amber-700' },
  approved:     { label: '承認済',     color: 'bg-indigo-100 text-indigo-700' },
  sent:         { label: '送信済',     color: 'bg-green-100 text-green-700' },
  replied:      { label: '返信あり',   color: 'bg-emerald-100 text-emerald-700' },
  declined:     { label: '辞退',       color: 'bg-red-100 text-red-600' },
  unsubscribed: { label: '配信停止',   color: 'bg-stone-100 text-stone-500' },
  bounced:      { label: 'バウンス',   color: 'bg-red-50 text-red-500' },
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [leadsState, setLeadsState] = useState<Lead[]>(leads)

  async function handleGenerateDraft(leadId: string) {
    setGeneratingId(leadId)
    try {
      const res = await fetch(`/api/leads/${leadId}/generate-draft`, { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setLeadsState((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: 'draft_ready' as LeadStatus } : l))
        )
      } else {
        alert(data.error ?? 'ドラフト生成に失敗しました')
      }
    } catch {
      alert('ドラフト生成に失敗しました')
    } finally {
      setGeneratingId(null)
    }
  }

  if (leadsState.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-4">👥</p>
        <p className="text-stone-600 font-medium">リードがまだありません</p>
        <p className="text-stone-400 text-sm mt-2">キャンペーンページからリードを追加してください</p>
        <a href="/campaigns"
          className="mt-4 inline-block px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          リードを追加する
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50">
            {['企業名', 'メール', '商品', '業種', 'ICP', 'ステータス', 'フェーズ', 'アクション', '追加日'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {leadsState.map((lead) => {
            const statusInfo = STATUS_LABELS[lead.status] ?? { label: lead.status, color: 'bg-stone-100 text-stone-600' }
            const isGenerating = generatingId === lead.id
            return (
              <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-900">
                  {lead.website_url ? (
                    <a href={lead.website_url} target="_blank" rel="noopener noreferrer"
                      className="hover:text-indigo-600 hover:underline">
                      {lead.company_name}
                    </a>
                  ) : lead.company_name}
                </td>
                <td className="px-4 py-3 text-stone-600 font-mono text-xs">{lead.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    lead.product === 'msgscore'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {lead.product === 'msgscore' ? 'MsgScore' : 'AI口コミ返信'}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-500">{lead.industry ?? '—'}</td>
                <td className="px-4 py-3">
                  {lead.icp_score != null ? (
                    <span className={`font-bold ${lead.icp_score >= 70 ? 'text-green-600' : lead.icp_score >= 40 ? 'text-amber-500' : 'text-stone-400'}`}>
                      {lead.icp_score}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {lead.conversation_phase && lead.conversation_phase !== 'initial' ? (() => {
                    const phase = PHASE_LABELS[lead.conversation_phase] ?? { label: lead.conversation_phase, emoji: '⚪' }
                    return <span>{phase.emoji} {phase.label}</span>
                  })() : <span className="text-stone-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  {(lead.status === 'new' || lead.status === 'analyzed') ? (
                    <button
                      onClick={() => handleGenerateDraft(lead.id)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isGenerating ? '生成中...' : 'ドラフト生成'}
                    </button>
                  ) : lead.status === 'draft_ready' ? (
                    <span className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleGenerateDraft(lead.id)}
                        disabled={isGenerating}
                        className="px-2 py-1 rounded-lg text-xs font-medium transition-colors bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isGenerating ? '生成中...' : '再生成'}
                      </button>
                      <a
                        href="/drafts"
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
                      >
                        確認 →
                      </a>
                    </span>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {new Date(lead.created_at).toLocaleDateString('ja-JP')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
