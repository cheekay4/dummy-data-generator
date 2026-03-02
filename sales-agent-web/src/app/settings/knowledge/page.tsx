export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import KnowledgeManager from '@/components/settings/KnowledgeManager'
import type { KnowledgeEntry } from '@/lib/types'

export default async function KnowledgePage() {
  const { data } = await supabase
    .from('sales_knowledge')
    .select('*')
    .order('category')
    .order('usage_count', { ascending: false })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">設定</p>
        <h1 className="text-2xl font-bold text-stone-900">ナレッジ管理</h1>
        <p className="text-sm text-stone-500 mt-1">
          返信ドラフト生成時に参照される FAQ・料金・競合情報を管理します
        </p>
      </div>
      <KnowledgeManager initialEntries={(data ?? []) as KnowledgeEntry[]} />
    </div>
  )
}
