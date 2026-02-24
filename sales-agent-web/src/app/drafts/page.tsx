export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { SalesEmail } from '@/lib/types'
import DraftsList from '@/components/drafts/DraftsList'

export default async function DraftsPage() {
  const { data: drafts } = await supabase
    .from('sales_emails')
    .select('*, lead:lead_id(*)')
    .eq('status', 'draft')
    .order('created_at', { ascending: false })

  const { data: todayStats } = await supabase
    .from('sales_daily_stats')
    .select('emails_sent')
    .eq('date', new Date().toISOString().split('T')[0])
    .single()

  const todaySent = todayStats?.emails_sent ?? 0
  const DAILY_LIMIT = 20

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">承認待ち</p>
          <h1 className="text-2xl font-bold text-stone-900">ドラフト一覧</h1>
        </div>

        {/* サマリーバー */}
        <div className="flex items-center gap-6 bg-white border border-stone-200 rounded-2xl px-5 py-3 shrink-0">
          <div className="text-center">
            <p className="text-xs text-stone-400">承認待ち</p>
            <p className="text-xl font-bold text-amber-600">
              {drafts?.length ?? 0}<span className="text-sm font-normal text-stone-500 ml-1">件</span>
            </p>
          </div>
          <div className="h-8 w-px bg-stone-200" />
          <div className="text-center">
            <p className="text-xs text-stone-400">今日の送信</p>
            <p className="text-xl font-bold text-stone-900">
              {todaySent}<span className="text-sm font-normal text-stone-400 ml-1">/ {DAILY_LIMIT}</span>
            </p>
          </div>
          <div className="h-8 w-px bg-stone-200" />
          <div className="text-center">
            <p className="text-xs text-stone-400">残り送信枠</p>
            <p className="text-xl font-bold text-green-600">
              {Math.max(0, DAILY_LIMIT - todaySent)}<span className="text-sm font-normal text-stone-500 ml-1">通</span>
            </p>
          </div>
        </div>
      </div>

      <DraftsList initialDrafts={(drafts as SalesEmail[]) ?? []} />
    </div>
  )
}
