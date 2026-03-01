export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'
import LeadsTable from '@/components/leads/LeadsTable'

const PRODUCT_TABS = [
  { value: '', label: '全て' },
  { value: 'review-reply-ai', label: 'AI口コミ返信' },
  { value: 'msgscore', label: 'MsgScore' },
]

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams

  let query = supabase
    .from('sales_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (product && ['msgscore', 'review-reply-ai'].includes(product)) {
    query = query.eq('product', product)
  }

  const { data: leads } = await query

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

      <div className="flex gap-2 mb-4">
        {PRODUCT_TABS.map((tab) => (
          <a key={tab.value} href={tab.value ? `/leads?product=${tab.value}` : '/leads'}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (product ?? '') === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      <LeadsTable leads={(leads as Lead[]) ?? []} />
    </div>
  )
}
