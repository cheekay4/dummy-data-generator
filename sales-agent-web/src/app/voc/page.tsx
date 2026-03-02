export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import VocList from '@/components/voc/VocList'
import type { VocEntry } from '@/lib/types'

export default async function VocPage() {
  const { data } = await supabase
    .from('sales_voc')
    .select('*, lead:lead_id(company_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  // カテゴリ別集計
  const entries = (data ?? []) as (VocEntry & { lead?: { company_name: string } })[]
  const categoryCounts: Record<string, number> = {}
  for (const e of entries) {
    categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">分析</p>
          <h1 className="text-2xl font-bold text-stone-900">VoC（顧客の声）</h1>
          <p className="text-sm text-stone-500 mt-1">返信メールから自動抽出された顧客インサイト</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3 shrink-0">
          <p className="text-xs text-indigo-600">総件数</p>
          <p className="text-xl font-bold text-indigo-700">{entries.length}<span className="text-sm font-normal ml-1">件</span></p>
        </div>
      </div>

      <VocList entries={entries} categoryCounts={categoryCounts} />
    </div>
  )
}
