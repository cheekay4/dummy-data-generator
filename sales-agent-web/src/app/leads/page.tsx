export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'
import LeadsTable from '@/components/leads/LeadsTable'

export default async function LeadsPage() {
  const { data: leads } = await supabase
    .from('sales_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">リード管理</p>
          <h1 className="text-2xl font-bold text-stone-900">リード一覧</h1>
        </div>
        <a href="/campaigns"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
          + リードを追加
        </a>
      </div>
      <LeadsTable leads={(leads as Lead[]) ?? []} />
    </div>
  )
}
