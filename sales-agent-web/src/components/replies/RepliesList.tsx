'use client'
import { useState } from 'react'
import type { SalesReply } from '@/lib/types'

const INTENT_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  interested:      { label: '興味あり',   color: 'bg-green-100 text-green-700',   emoji: '🟢' },
  question:        { label: '質問',       color: 'bg-blue-100 text-blue-700',     emoji: '🔵' },
  not_interested:  { label: '不要',       color: 'bg-stone-100 text-stone-600',   emoji: '⚪' },
  out_of_office:   { label: '不在',       color: 'bg-amber-100 text-amber-700',   emoji: '🟡' },
  unsubscribe:     { label: '配信停止',   color: 'bg-red-100 text-red-600',       emoji: '🔴' },
  soft_decline:    { label: '婉曲辞退',   color: 'bg-orange-100 text-orange-700', emoji: '🟠' },
  internal_review: { label: '社内検討',   color: 'bg-purple-100 text-purple-700', emoji: '🟣' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'たった今'
  if (mins < 60) return `${mins}分前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  return `${days}日前`
}

function ReplyCard({ reply: initial }: { reply: SalesReply }) {
  const [reply, setReply] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const intentInfo = reply.intent
    ? (INTENT_LABELS[reply.intent] ?? { label: reply.intent, color: 'bg-stone-100 text-stone-600', emoji: '⚪' })
    : null

  async function handleApprove() {
    setLoading(true)
    const res = await fetch(`/api/replies/${reply.id}/approve`, { method: 'POST' })
    setLoading(false)
    if (res.ok) {
      setReply((prev) => ({ ...prev, human_approved: true }))
    } else {
      const data = await res.json().catch(() => ({})) as { error?: string }
      alert(data.error ?? '承認に失敗しました。Gmail環境変数を確認してください。')
    }
  }

  async function handleRegenerate() {
    setRegenerating(true)
    const res = await fetch(`/api/replies/${reply.id}/regenerate`, { method: 'POST' })
    setRegenerating(false)
    if (res.ok) {
      // ページをリロードして最新のドラフトを表示
      window.location.reload()
    } else {
      alert('再生成に失敗しました。')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-stone-900">{reply.lead?.company_name ?? '不明'}</p>
          <p className="text-xs text-stone-500">{reply.lead?.email ?? '—'}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {intentInfo && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${intentInfo.color}`}>
                {intentInfo.emoji} {intentInfo.label}
                {reply.intent_confidence != null && (
                  <span className="opacity-60">({Math.round(reply.intent_confidence * 100)}%)</span>
                )}
              </span>
            )}
            {reply.needs_research && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                要調査
              </span>
            )}
            {reply.ack_sent_at && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-teal-50 text-teal-700">
                ACK送信済み（{timeAgo(reply.ack_sent_at)}）
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-stone-400 shrink-0">
          {timeAgo(reply.created_at)}
        </p>
      </div>

      {reply.reply_body && (
        <div className="bg-stone-50 rounded-xl p-3 mb-3 text-sm text-stone-700 whitespace-pre-wrap line-clamp-4">
          {reply.reply_body}
        </div>
      )}

      {reply.ai_draft_response && !reply.human_approved && (
        <div className={`border rounded-xl p-3 mb-3 ${reply.needs_research ? 'border-amber-200 bg-amber-50' : 'border-indigo-100 bg-indigo-50'}`}>
          {reply.needs_research && (
            <div className="bg-amber-100 rounded-lg p-2 mb-2">
              <p className="text-xs font-semibold text-amber-800">
                ナレッジに該当情報がありません
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {reply.escalation_reason ?? 'ナレッジを追加してから再生成すると、より正確な返信が作れます'}
              </p>
            </div>
          )}
          <p className="text-xs font-semibold text-indigo-600 mb-1">
            AI ドラフト返信{reply.reply_stage === 'regenerated' ? '（再生成済み）' : ''}
          </p>
          {reply.ai_draft_subject && (
            <p className="text-xs text-indigo-500 mb-1">件名: {reply.ai_draft_subject}</p>
          )}
          <p className="text-sm text-stone-700 whitespace-pre-wrap">{reply.ai_draft_response}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleApprove}
              disabled={loading || regenerating}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '送信中...' : '承認してこのドラフトで返信する'}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={loading || regenerating}
              className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 disabled:opacity-50 transition-colors"
            >
              {regenerating ? '生成中...' : '再生成'}
            </button>
          </div>
        </div>
      )}

      {reply.human_approved && (
        <p className="text-xs text-green-600 font-medium">承認済み・返信済み</p>
      )}

      {!reply.ai_draft_response && !reply.human_approved && (
        <p className="text-xs text-stone-400 italic">AI ドラフト生成中...（5分以内に表示されます）</p>
      )}
    </div>
  )
}

export default function RepliesList({ replies }: { replies: SalesReply[] }) {
  if (!replies.length) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-4xl mb-4">💬</p>
        <p className="text-stone-600 font-medium">まだ返信がありません</p>
        <p className="text-stone-400 text-sm mt-2">メールを送信すると、返信がここに表示されます</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
    </div>
  )
}
