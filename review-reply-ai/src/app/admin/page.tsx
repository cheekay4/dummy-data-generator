'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, Zap, UserCheck } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  newUsersThisWeek: number
  proCount: number
  generationsToday: number
  anonymousTrialsToday: number
  activeUsersToday: number
  recentSignups: { email: string; created_at: string }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">データの読み込みに失敗しました</p>
        <p className="text-red-400 text-sm mt-1">{error}</p>
      </div>
    )
  }

  const conversionRate = stats.totalUsers > 0
    ? ((stats.proCount / stats.totalUsers) * 100).toFixed(1)
    : '0'

  const mrr = stats.proCount * 390

  const kpis = [
    {
      label: '総ユーザー数',
      value: stats.totalUsers,
      sub: `+${stats.newUsersThisWeek} 今週`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pro転換率',
      value: `${conversionRate}%`,
      sub: `${stats.proCount}人 / ${stats.totalUsers}人`,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: '今日の生成数',
      value: stats.generationsToday,
      sub: `匿名: ${stats.anonymousTrialsToday}件`,
      icon: Zap,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: '今日のアクティブ',
      value: stats.activeUsersToday,
      sub: 'ログインユーザー',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  const freeCount = stats.totalUsers - stats.proCount
  const freePercent = stats.totalUsers > 0
    ? ((freeCount / stats.totalUsers) * 100).toFixed(0)
    : '0'

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs text-stone-400 font-medium">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{kpi.value}</p>
              <p className="text-xs text-stone-400 mt-1">{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Plan Distribution */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-stone-700 mb-3">プラン分布</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${100 - Number(freePercent)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-400">Free: {freeCount}人 ({freePercent}%)</span>
            <span className="text-amber-600 font-medium">Pro: {stats.proCount}人</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-400">推定MRR</p>
            <p className="text-lg font-bold text-stone-800">¥{mrr.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-stone-700 mb-3">直近の登録</h3>
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">まだ登録ユーザーはいません</p>
          ) : (
            <div className="space-y-2">
              {stats.recentSignups.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 truncate max-w-[200px]">{u.email}</span>
                  <span className="text-xs text-stone-400 whitespace-nowrap ml-2">
                    {new Date(u.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
