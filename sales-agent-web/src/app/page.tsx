export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { DailyStats } from '@/lib/types'

async function getStats() {
  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [statsRes, draftsRes, repliesRes, leadsRes] = await Promise.all([
    supabase.from('sales_daily_stats').select('*').gte('date', sevenDaysAgo).order('date'),
    supabase.from('sales_emails').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('sales_replies').select('id', { count: 'exact', head: true }).eq('human_approved', false),
    supabase.from('sales_leads').select('id', { count: 'exact', head: true }).in('status', ['new', 'analyzed']),
  ])

  const todayStats = (statsRes.data as DailyStats[] | null)?.find((s) => s.date === today)

  return {
    weeklyStats: (statsRes.data as DailyStats[] | null) ?? [],
    todaySent: todayStats?.emails_sent ?? 0,
    pendingDrafts: draftsRes.count ?? 0,
    pendingReplies: repliesRes.count ?? 0,
    pendingLeads: leadsRes.count ?? 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()
  const DAILY_LIMIT = 20
  const maxSent = Math.max(...stats.weeklyStats.map((s) => s.emails_sent), 1)

  const kpis = [
    { label: '今日の送信', value: `${stats.todaySent}/${DAILY_LIMIT}`, sub: `残り ${DAILY_LIMIT - stats.todaySent}通`, color: 'text-indigo-700' },
    { label: '承認待ちドラフト', value: String(stats.pendingDrafts), sub: '要アクション', color: stats.pendingDrafts > 0 ? 'text-amber-600' : 'text-stone-400', href: '/drafts' },
    { label: '未対応返信', value: String(stats.pendingReplies), sub: '要アクション', color: stats.pendingReplies > 0 ? 'text-green-600' : 'text-stone-400', href: '/replies' },
    { label: '分析待ちリード', value: String(stats.pendingLeads), sub: 'new/analyzed', color: 'text-stone-700', href: '/leads' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">ダッシュボード</p>
        <h1 className="text-2xl font-bold text-stone-900">
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </h1>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, color, href }) => {
          const card = (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-indigo-200 transition-colors">
              <p className="text-xs text-stone-500 mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-stone-400 mt-1">{sub}</p>
            </div>
          )
          return href ? (
            <a key={label} href={href}>{card}</a>
          ) : (
            <div key={label}>{card}</div>
          )
        })}
      </div>

      {/* 週次グラフ */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">過去7日間の送信数</h2>
        {stats.weeklyStats.length === 0 ? (
          <p className="text-sm text-stone-400">データがありません（メール送信後に表示されます）</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {stats.weeklyStats.map((s) => (
              <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-indigo-500 rounded-t-md"
                  style={{ height: `${Math.max((s.emails_sent / maxSent) * 100, 4)}%` }}
                />
                <p className="text-[10px] text-stone-400">{s.date.slice(5)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-3 gap-4">
        <a href="/drafts" className="bg-amber-50 border border-amber-200 rounded-2xl p-5 hover:bg-amber-100 transition-colors block">
          <p className="text-2xl mb-2">✉️</p>
          <p className="font-semibold text-amber-800">承認待ちドラフト</p>
          <p className="text-sm text-amber-600 mt-1">{stats.pendingDrafts}件を確認する →</p>
        </a>
        <a href="/replies" className="bg-green-50 border border-green-200 rounded-2xl p-5 hover:bg-green-100 transition-colors block">
          <p className="text-2xl mb-2">💬</p>
          <p className="font-semibold text-green-800">未対応の返信</p>
          <p className="text-sm text-green-600 mt-1">{stats.pendingReplies}件を確認する →</p>
        </a>
        <a href="/campaigns" className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 hover:bg-indigo-100 transition-colors block">
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-semibold text-indigo-800">リードを追加</p>
          <p className="text-sm text-indigo-600 mt-1">新しい探索を開始する →</p>
        </a>
      </div>
    </div>
  )
}
