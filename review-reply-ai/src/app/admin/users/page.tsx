'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AdminUser } from '@/lib/types'

const PAGE_SIZE = 50

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [offset, setOffset] = useState(0)
  const [changingPlan, setChangingPlan] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (planFilter) params.set('plan', planFilter)
    params.set('limit', String(PAGE_SIZE))
    params.set('offset', String(offset))

    const r = await fetch(`/api/admin/users?${params}`)
    if (r.ok) {
      const data = await r.json()
      setUsers(data.users)
      setTotal(data.total)
    }
    setLoading(false)
  }, [search, planFilter, offset])

  useEffect(() => { load() }, [load])

  async function handlePlanChange(userId: string, newPlan: string) {
    setChangingPlan(userId)
    const r = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan }),
    })
    if (r.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan: newPlan as 'free' | 'pro' } : u))
    }
    setChangingPlan(null)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="メールアドレスで検索..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOffset(0) }}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="flex gap-1">
          {['', 'free', 'pro'].map((p) => (
            <button
              key={p}
              onClick={() => { setPlanFilter(p); setOffset(0) }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                planFilter === p
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'
              }`}
            >
              {p === '' ? '全て' : p === 'free' ? 'Free' : 'Pro'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-stone-400 py-16 text-sm">ユーザーが見つかりません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">メール</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 w-24">プラン</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 w-20 hidden sm:table-cell">利用数</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 w-24 hidden sm:table-cell">プロファイル</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 w-28 hidden md:table-cell">登録日</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 text-stone-700 truncate max-w-[200px]">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.plan}
                        disabled={changingPlan === u.id}
                        onChange={(e) => handlePlanChange(u.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${
                          u.plan === 'pro'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden sm:table-cell">{u.usageToday}</td>
                    <td className="px-4 py-3 text-stone-500 hidden sm:table-cell">{u.profileCount}件</td>
                    <td className="px-4 py-3 text-stone-400 text-xs hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-amber-600 hover:text-amber-700 text-xs font-medium"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-400">{total}件中 {offset + 1}〜{Math.min(offset + PAGE_SIZE, total)}件</p>
          <div className="flex gap-1">
            <button
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              disabled={offset === 0}
              className="p-2 rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="flex items-center px-3 text-sm text-stone-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setOffset(offset + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total}
              className="p-2 rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
