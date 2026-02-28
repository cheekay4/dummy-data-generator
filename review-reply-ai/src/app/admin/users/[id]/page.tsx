'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import type { AdminUserDetail } from '@/lib/types'

const DISC_LABELS: Record<string, string> = {
  D: '主導型', I: '感化型', S: '安定型', C: '慎重型',
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [changingPlan, setChangingPlan] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(setUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handlePlanChange(newPlan: string) {
    if (!user) return
    setChangingPlan(true)
    const r = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan }),
    })
    if (r.ok) setUser({ ...user, plan: newPlan as 'free' | 'pro' })
    setChangingPlan(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const r = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (r.ok) {
      window.location.href = '/admin/users'
    } else {
      setDeleting(false)
      setError('削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">ユーザーが見つかりません</p>
        <Link href="/admin/users" className="text-amber-600 text-sm hover:underline mt-2 inline-block">← 一覧に戻る</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600">
        <ArrowLeft className="w-4 h-4" /> ユーザー一覧
      </Link>

      {/* Basic Info */}
      <div className="bg-white border border-stone-200 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-800">{user.email}</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {user.display_name && <span className="mr-3">{user.display_name}</span>}
              ID: {user.id.slice(0, 8)}...
            </p>
            <p className="text-xs text-stone-400 mt-1">
              登録: {new Date(user.created_at).toLocaleDateString('ja-JP')}
              {user.subscription?.status && (
                <span className="ml-3">Stripe: {user.subscription.status}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={user.plan}
              disabled={changingPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer border-0 ${
                user.plan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
              }`}
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Reply Profiles */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-stone-700 mb-3">
            返信プロファイル ({user.replyProfiles.length}件)
          </h3>
          {user.replyProfiles.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">プロファイルなし</p>
          ) : (
            <div className="space-y-2">
              {user.replyProfiles.map((p) => (
                <div key={p.id} className="border border-stone-100 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-700">{p.profile_name}</span>
                    <div className="flex items-center gap-2">
                      {p.disc_type && (
                        <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded">
                          {DISC_LABELS[p.disc_type] ?? p.disc_type}
                        </span>
                      )}
                      <span className="text-xs text-stone-400">
                        {p.creation_method === 'diagnosis' ? '診断' : 'テキスト'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-stone-400">
                    <span>温:{p.agreeableness}</span>
                    <span>社:{p.extraversion}</span>
                    <span>丁:{p.conscientiousness}</span>
                    <span>独:{p.openness}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage History */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-stone-700 mb-3">利用履歴（直近30日）</h3>
          {user.recentUsage.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">利用データなし</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-1.5 text-stone-400 font-medium text-xs">日付</th>
                    <th className="text-right py-1.5 text-stone-400 font-medium text-xs">回数</th>
                  </tr>
                </thead>
                <tbody>
                  {user.recentUsage.map((u) => (
                    <tr key={u.date} className="border-b border-stone-50">
                      <td className="py-1.5 text-stone-600">{u.date}</td>
                      <td className="py-1.5 text-right text-stone-500">{u.count}回</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Generated Replies */}
      <div className="bg-white border border-stone-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-stone-700 mb-3">生成履歴（直近20件）</h3>
        {user.recentHistory.length === 0 ? (
          <p className="text-sm text-stone-400 py-4 text-center">生成履歴なし</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-3 py-2 text-stone-400 font-medium text-xs">レビュー抜粋</th>
                  <th className="text-left px-3 py-2 text-stone-400 font-medium text-xs w-12">星</th>
                  <th className="text-left px-3 py-2 text-stone-400 font-medium text-xs w-28 hidden sm:table-cell">プラットフォーム</th>
                  <th className="text-left px-3 py-2 text-stone-400 font-medium text-xs w-24 hidden md:table-cell">日時</th>
                </tr>
              </thead>
              <tbody>
                {user.recentHistory.map((h) => (
                  <tr key={h.id} className="border-b border-stone-50">
                    <td className="px-3 py-2 text-stone-600 truncate max-w-[300px]">
                      {h.review_text.slice(0, 60)}{h.review_text.length > 60 ? '...' : ''}
                    </td>
                    <td className="px-3 py-2 text-amber-500">{'★'.repeat(h.rating)}</td>
                    <td className="px-3 py-2 text-stone-400 text-xs hidden sm:table-cell">{h.platform}</td>
                    <td className="px-3 py-2 text-stone-400 text-xs hidden md:table-cell">
                      {new Date(h.created_at).toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-xl p-5">
        <h3 className="text-sm font-bold text-red-700 mb-2">危険な操作</h3>
        <p className="text-xs text-red-500 mb-3">ユーザーを削除すると、プロファイル・利用履歴・サブスクリプションが全て削除されます。この操作は取り消せません。</p>
        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          ユーザーを削除する
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-stone-800 mb-2">本当に削除しますか？</h3>
            <p className="text-sm text-stone-500 mb-4">
              確認のため、メールアドレスを入力してください:
            </p>
            <p className="text-xs text-stone-400 mb-2 font-mono">{user.email}</p>
            <input
              type="text"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDelete(false); setDeleteEmail('') }}
                className="flex-1 border border-stone-300 text-stone-600 py-2.5 rounded-lg text-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteEmail !== user.email || deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40"
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
