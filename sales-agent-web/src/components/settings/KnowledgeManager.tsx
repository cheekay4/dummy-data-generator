'use client'

import { useState } from 'react'
import type { KnowledgeEntry } from '@/lib/types'

const CATEGORIES = ['faq', 'pricing', 'competitor', 'objection', 'feature', 'other'] as const
const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  faq:        { label: 'FAQ',      emoji: '❓' },
  pricing:    { label: '料金',     emoji: '💰' },
  competitor: { label: '競合',     emoji: '⚔️' },
  objection:  { label: '反論対応', emoji: '🛡️' },
  feature:    { label: '機能',     emoji: '⚙️' },
  other:      { label: 'その他',   emoji: '📝' },
}

const PRODUCTS = ['review-reply-ai', 'msgscore'] as const

function EntryCard({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: KnowledgeEntry
  onUpdate: (e: KnowledgeEntry) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    question: entry.question,
    answer: entry.answer,
    category: entry.category,
    keywords: entry.keywords.join(', '),
    product: entry.product,
  })
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const res = await fetch('/api/knowledge', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: entry.id,
        question: form.question,
        answer: form.answer,
        category: form.category,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        product: form.product,
      }),
    })
    setLoading(false)
    if (res.ok) {
      const updated = await res.json() as KnowledgeEntry
      onUpdate(updated)
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (!confirm('このナレッジを削除しますか？')) return
    setLoading(true)
    const res = await fetch(`/api/knowledge?id=${entry.id}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) onDelete(entry.id)
  }

  const cat = CATEGORY_LABELS[entry.category] ?? { label: entry.category, emoji: '📝' }

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border border-indigo-200 p-5">
        <div className="space-y-3">
          <div className="flex gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="text-sm border border-stone-200 rounded-lg px-2 py-1.5"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]?.emoji} {CATEGORY_LABELS[c]?.label}</option>
              ))}
            </select>
            <select
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="text-sm border border-stone-200 rounded-lg px-2 py-1.5"
            >
              {PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="質問"
            className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="回答"
            rows={4}
            className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
          />
          <input
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            placeholder="キーワード（カンマ区切り）"
            className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600`}>
            {cat.emoji} {cat.label}
          </span>
          <span className="text-xs text-stone-400">{entry.product}</span>
          {entry.usage_count > 0 && (
            <span className="text-xs text-stone-400">使用: {entry.usage_count}回</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
          >
            削除
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold text-stone-800 mb-1">Q: {entry.question}</p>
      <p className="text-sm text-stone-600 whitespace-pre-wrap">A: {entry.answer}</p>
      {entry.keywords.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {entry.keywords.map((kw, i) => (
            <span key={i} className="text-xs bg-stone-50 text-stone-500 px-2 py-0.5 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function KnowledgeManager({
  initialEntries,
}: {
  initialEntries: KnowledgeEntry[]
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'faq',
    keywords: '',
    product: 'review-reply-ai',
  })
  const [loading, setLoading] = useState(false)

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.category === filter)

  async function handleAdd() {
    if (!form.question || !form.answer) return
    setLoading(true)
    const res = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      }),
    })
    setLoading(false)
    if (res.ok) {
      const created = await res.json() as KnowledgeEntry
      setEntries((prev) => [created, ...prev])
      setForm({ question: '', answer: '', category: 'faq', keywords: '', product: 'review-reply-ai' })
      setShowAdd(false)
    }
  }

  function handleUpdate(updated: KnowledgeEntry) {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            全て ({entries.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = entries.filter((e) => e.category === cat).length
            if (count === 0) return null
            const info = CATEGORY_LABELS[cat]!
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                {info.emoji} {info.label} ({count})
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0"
        >
          + 追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showAdd && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-4">
          <p className="text-sm font-semibold text-indigo-700 mb-3">新規ナレッジ追加</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="text-sm border border-stone-200 rounded-lg px-2 py-1.5"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]?.emoji} {CATEGORY_LABELS[c]?.label}</option>
                ))}
              </select>
              <select
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="text-sm border border-stone-200 rounded-lg px-2 py-1.5"
              >
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="質問（例: 料金はいくらですか？）"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
            />
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="回答"
              rows={4}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
            />
            <input
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="キーワード（カンマ区切り。例: 料金, 価格, 無料）"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={loading || !form.question || !form.answer}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? '追加中...' : '追加'}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* エントリ一覧 */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-stone-600 font-medium">ナレッジがまだありません</p>
          <p className="text-stone-400 text-sm mt-2">「+ 追加」ボタンから FAQ や料金情報を登録してください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
