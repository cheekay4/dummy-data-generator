export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { SalesReply } from '@/lib/types'
import RepliesList from '@/components/replies/RepliesList'

export default async function RepliesPage() {
  const { data: replies } = await supabase
    .from('sales_replies')
    .select('*, lead:lead_id(*), email:email_id(*)')
    .order('created_at', { ascending: false })
    .limit(50)

  const pendingCount = (replies ?? []).filter(
    (r: SalesReply) => !r.human_approved && r.ai_draft_response
  ).length

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">返信管理</p>
          <h1 className="text-2xl font-bold text-stone-900">受信返信</h1>
        </div>
        {pendingCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 shrink-0">
            <p className="text-xs text-green-600">承認待ち</p>
            <p className="text-xl font-bold text-green-700">
              {pendingCount}<span className="text-sm font-normal ml-1">件</span>
            </p>
          </div>
        )}
      </div>

      <RepliesList replies={(replies as SalesReply[]) ?? []} />
    </div>
  )
}
