import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email_ids } = (await req.json()) as { email_ids: string[] }
  if (!email_ids?.length) {
    return NextResponse.json({ error: 'email_ids required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('sales_emails')
    .update({ status: 'approved' })
    .in('id', email_ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, approved: email_ids.length })
}
