import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: email } = await supabase
    .from('sales_emails')
    .select('lead_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('sales_emails')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // リードを analyzed に戻す（再生成可能に）
  if (email?.lead_id) {
    await supabase
      .from('sales_leads')
      .update({ status: 'analyzed' })
      .eq('id', email.lead_id)
  }

  return NextResponse.json({ success: true })
}
