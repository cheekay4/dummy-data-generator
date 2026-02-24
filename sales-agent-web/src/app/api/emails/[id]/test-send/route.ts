import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/gmail'
import type { SalesEmail } from '@/lib/types'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const senderEmail = process.env.SENDER_EMAIL

  if (!senderEmail) {
    return NextResponse.json({ error: 'SENDER_EMAIL が未設定です' }, { status: 500 })
  }

  const { data: email, error } = await supabase
    .from('sales_emails')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !email) {
    return NextResponse.json({ error: 'メールが見つかりません' }, { status: 404 })
  }

  const draft = email as SalesEmail

  try {
    await sendEmail({
      to: senderEmail,
      subject: `[テスト送信] ${draft.subject}`,
      bodyText: draft.body_text,
      bodyHtml: draft.body_html,
    })

    // test_sent_at を記録
    await supabase
      .from('sales_emails')
      .update({ test_sent_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '送信エラー' },
      { status: 500 }
    )
  }
}
