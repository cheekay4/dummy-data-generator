'use client'
import { useState } from 'react'
import type { SalesReply } from '@/lib/types'

const INTENT_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  interested:     { label: '興味あり', color: 'bg-green-100 text-green-700',   emoji: '🟢' },
  question:       { label: '質問',     color: 'bg-blue-100 text-blue-700',    emoji: '🔵' },
  not_interested: { label: '不要',     color: 'bg-stone-100 text-stone-600',  emoji: '⚪' },
  out_of_office:  { label: '不在',     color: 'bg-amber-100 text-amber-700',  emoji: '🟡' },
  unsubscribe:    { label: '配信停止', color: 'bg-red-100 text-red-600',      emoji: '🔴' },
}

function ReplyCard({ reply: initial }: { reply: SalesReply }) {
  const [reply, setReply] = useState(initial)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-stone-900">{reply.lead?.company_name ?? '不明'}</p>
          <p className="text-xs text-stone-500">{reply.lead?.email ?? '—'}</p>
          {intentInfo && (
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${intentInfo.color}`}>
              {intentInfo.emoji} {intentInfo.label}
              {reply.intent_confidence != null && (
                <span className="opacity-60">({Math.round(reply.intent_confidence * 100)}%)</span>
              )}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 shrink-0">
          {new Date(reply.created_at).toLocaleDateString('ja-JP')}
        </p>
      </div>

      {reply.reply_body && (
        <div className="bg-stone-50 rounded-xl p-3 mb-3 text-sm text-stone-700 whitespace-pre-wrap line-clamp-4">
          {reply.reply_body}
        </div>
      )}

      {reply.ai_draft_response && !reply.human_approved && (
        <div className="border border-indigo-100 bg-indigo-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-indigo-600 mb-1">🤖 AI ドラフト返信</p>
          {reply.ai_draft_subject && (
            <p className="text-xs text-indigo-500 mb-1">件名: {reply.ai_draft_subject}</p>
          )}
          <p className="text-sm text-stone-700 whitespace-pre-wrap">{reply.ai_draft_response}</p>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="mt-3 w-full bg-indigo-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '送信中...' : '✅ 承認してこのドラフトで返信する'}
          </button>
        </div>
      )}

      {reply.human_approved && (
        <p className="text-xs text-green-600 font-medium">✅ 承認済み・返信済み</p>
      )}

      {!reply.ai_draft_response && !reply.human_approved && (
        <p className="text-xs text-stone-400 italic">AI ドラフト未生成（CLI で `replies` コマンドを実行してください）</p>
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
