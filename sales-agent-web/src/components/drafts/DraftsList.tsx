'use client'
import { useState, useCallback } from 'react'
import type { SalesEmail } from '@/lib/types'

function MsgScoreBadge({ score }: { score?: number }) {
  if (score == null) return null
  const color =
    score >= 80 ? 'bg-green-100 text-green-700'
    : score >= 70 ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-600'
  const emoji = score >= 80 ? '🟢' : score >= 70 ? '🟡' : '🔴'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {emoji} MsgScore: {score}
    </span>
  )
}

function DraftCard({
  draft,
  onApprove,
  onReject,
}: {
  draft: SalesEmail
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState<'approve' | 'reject' | 'test' | null>(null)
  const [testSent, setTestSent] = useState(!!draft.test_sent_at)

  const lead = draft.lead
  const icpColor =
    (lead?.icp_score ?? 0) >= 70 ? 'text-green-600'
    : (lead?.icp_score ?? 0) >= 40 ? 'text-amber-500'
    : 'text-stone-400'

  async function handleApprove() {
    setLoading('approve')
    const res = await fetch(`/api/emails/${draft.id}/approve`, { method: 'POST' })
    if (res.ok) onApprove(draft.id)
    else setLoading(null)
  }

  async function handleReject() {
    setLoading('reject')
    const res = await fetch(`/api/emails/${draft.id}/reject`, { method: 'POST' })
    if (res.ok) onReject(draft.id)
    else setLoading(null)
  }

  async function handleTestSend() {
    setLoading('test')
    const res = await fetch(`/api/emails/${draft.id}/test-send`, { method: 'POST' })
    setLoading(null)
    if (res.ok) setTestSent(true)
    else alert('テスト送信に失敗しました。GMAIL環境変数を確認してください。')
  }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${draft.low_score ? 'border-red-200' : 'border-stone-200'}`}>
      {draft.low_score && (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2 text-sm font-medium text-red-600">
          ⚠️ 低スコア注意 — 改善提案を確認してから承認を検討してください
        </div>
      )}

      <div className="p-5">
        {/* 宛先・メタ */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="font-semibold text-stone-900">
              {lead?.company_name ?? '不明'} &lt;{lead?.email ?? '—'}&gt;
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {lead?.industry && <span className="text-xs text-stone-500">{lead.industry}</span>}
              {lead?.icp_score != null && (
                <span className={`text-xs font-semibold ${icpColor}`}>ICP: {lead.icp_score}</span>
              )}
              {draft.variant && (
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  パターン {draft.variant}
                </span>
              )}
              <MsgScoreBadge score={draft.msgscore} />
            </div>
          </div>
          <p className="text-xs text-stone-400 shrink-0">
            {new Date(draft.created_at).toLocaleDateString('ja-JP')}
          </p>
        </div>

        {/* 件名 */}
        <p className="text-sm font-semibold text-stone-800 bg-stone-50 rounded-lg px-3 py-2 mb-3">
          件名: {draft.subject}
        </p>

        {/* 本文 */}
        <div className="text-sm text-stone-700 leading-relaxed">
          {expanded ? (
            <pre className="whitespace-pre-wrap font-sans text-sm">{draft.body_text}</pre>
          ) : (
            <p className="line-clamp-3">{draft.body_text}</p>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-indigo-500 hover:text-indigo-700 text-xs mt-1 font-medium"
          >
            {expanded ? '▲ 折りたたむ' : '▼ 全文を表示'}
          </button>
        </div>

        {/* MsgScore 改善提案 */}
        {draft.low_score && draft.msgscore_detail && (
          <div className="mt-3 bg-red-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-red-700 mb-1">💡 改善提案</p>
            {((draft.msgscore_detail as { suggestions?: string[] }).suggestions ?? []).map((s, i) => (
              <p key={i} className="text-xs text-red-600">・{s}</p>
            ))}
          </div>
        )}

        {/* アクション */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button
            onClick={handleApprove}
            disabled={loading != null}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading === 'approve' ? '処理中...' : draft.low_score ? '⚠️ それでも承認する' : '✅ 承認して送信キューへ'}
          </button>
          <button
            onClick={handleTestSend}
            disabled={loading != null}
            title="自分のメールアドレスにテスト送信します"
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${testSent ? 'border-green-200 bg-green-50 text-green-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            {loading === 'test' ? '送信中...' : testSent ? '✅ テスト済み' : '📧 テスト送信'}
          </button>
          <button
            onClick={handleReject}
            disabled={loading != null}
            className="px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            {loading === 'reject' ? '...' : '❌ 却下'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DraftsList({ initialDrafts }: { initialDrafts: SalesEmail[] }) {
  const [drafts, setDrafts] = useState(initialDrafts)

  const handleApprove = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const handleReject = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }, [])

  async function handleBulkApprove() {
    const ids = drafts.map((d) => d.id)
    const res = await fetch('/api/emails/bulk-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_ids: ids }),
    })
    if (res.ok) setDrafts([])
  }

  if (drafts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-stone-600 font-medium">承認待ちドラフトはありません</p>
        <p className="text-stone-400 text-sm mt-2">全て処理済みです。お疲れ様でした！</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {drafts.length > 1 && (
        <div className="flex justify-end">
          <button
            onClick={handleBulkApprove}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            ✅ 全 {drafts.length} 件を一括承認
          </button>
        </div>
      )}
      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onApprove={handleApprove} onReject={handleReject} />
      ))}
    </div>
  )
}
