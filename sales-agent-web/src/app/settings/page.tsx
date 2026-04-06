export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import AutomationControls from '@/components/AutomationControls'

async function getStats() {
  const [totalLeads, totalSent, totalReplies] = await Promise.all([
    supabase.from('sales_leads').select('id', { count: 'exact', head: true }),
    supabase.from('sales_emails').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
    supabase.from('sales_replies').select('id', { count: 'exact', head: true }),
  ])
  return {
    totalLeads: totalLeads.count ?? 0,
    totalSent: totalSent.count ?? 0,
    totalReplies: totalReplies.count ?? 0,
  }
}

export default async function SettingsPage() {
  const stats = await getStats()
  const replyRate = stats.totalSent > 0
    ? ((stats.totalReplies / stats.totalSent) * 100).toFixed(1)
    : '—'

  const envCheck = [
    { key: 'SUPABASE_URL', ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'), label: 'Supabase' },
    { key: 'GMAIL_CLIENT_ID', ok: !!process.env.GMAIL_CLIENT_ID, label: 'Gmail Client ID' },
    { key: 'GMAIL_REFRESH_TOKEN', ok: !!process.env.GMAIL_REFRESH_TOKEN, label: 'Gmail Refresh Token' },
    { key: 'SENDER_EMAIL', ok: !!process.env.SENDER_EMAIL, label: 'Sender Email' },
    { key: 'CRON_SECRET', ok: !!process.env.CRON_SECRET && process.env.CRON_SECRET !== 'generate_a_random_secret', label: 'Cron Secret' },
    { key: 'GOOGLE_SEARCH_API_KEY', ok: !!process.env.GOOGLE_SEARCH_API_KEY, label: 'Google Search API（自動探索・任意）' },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">設定</p>
        <h1 className="text-2xl font-bold text-stone-900">システム設定</h1>
      </div>

      {/* 累計統計 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">📊 累計統計</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-stone-900">{stats.totalLeads}</p>
            <p className="text-xs text-stone-500 mt-1">総リード数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalSent}</p>
            <p className="text-xs text-stone-500 mt-1">送信済み</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{replyRate}%</p>
            <p className="text-xs text-stone-500 mt-1">返信率（{stats.totalReplies}件）</p>
          </div>
        </div>
      </div>

      {/* 環境変数チェック */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">🔑 環境変数チェック</h2>
        <div className="space-y-2">
          {envCheck.map(({ key, ok, label }) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-stone-700">{label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {ok ? '✅ 設定済み' : '⚠️ 未設定'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* オーケストレーター & 自動化制御 */}
      <AutomationControls />

      {/* Cron エンドポイント */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">⏰ Cron エンドポイント</h2>
        <div className="space-y-2">
          <div className="bg-stone-50 rounded-lg p-3 font-mono text-xs text-stone-700">
            <p className="text-stone-400 mb-1"># 毎日 09:00 JST に承認済みメールを送信</p>
            <p>POST /api/cron/send</p>
            <p className="text-stone-400 mt-0.5">Authorization: Bearer {'{CRON_SECRET}'}</p>
          </div>
          <p className="text-xs text-stone-400">
            Vercel Dashboard → Settings → Cron Jobs でスケジュールを設定してください（例: <code className="bg-stone-100 px-1 rounded">0 0 * * *</code> UTC = JST 09:00）。
          </p>
        </div>
      </div>
    </div>
  )
}
