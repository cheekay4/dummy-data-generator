import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabase
    .from('sales_emails')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // リードも approved に更新
  const { data: email } = await supabase
    .from('sales_emails')
    .select('lead_id')
    .eq('id', id)
    .single()

  if (email?.lead_id) {
    await supabase
      .from('sales_leads')
      .update({ status: 'approved' })
      .eq('id', email.lead_id)
      .eq('status', 'draft_ready')
  }

  return NextResponse.json({ success: true })
}
