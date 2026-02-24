import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/gmail'
import type { SalesReply, SalesEmail, Lead } from '@/lib/types'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 返信情報を取得（関連するリード・元メールも JOIN）
  const { data: reply, error } = await supabase
    .from('sales_replies')
    .select('*, lead:lead_id(*), email:email_id(*)')
    .eq('id', id)
    .single()

  if (error || !reply) {
    return NextResponse.json({ error: '返信が見つかりません' }, { status: 404 })
  }

  const r = reply as SalesReply & { lead?: Lead; email?: SalesEmail }

  if (!r.ai_draft_response) {
    return NextResponse.json({ error: 'AI ドラフトがありません' }, { status: 400 })
  }

  const leadEmail = r.lead?.email
  if (!leadEmail) {
    return NextResponse.json({ error: 'リードのメールアドレスが見つかりません' }, { status: 400 })
  }

  try {
    // 元メールのスレッドに返信
    const originalSubject = r.email?.subject ?? ''
    const reSubject = r.ai_draft_subject
      ? r.ai_draft_subject
      : originalSubject.startsWith('Re:')
      ? originalSubject
      : `Re: ${originalSubject}`

    await sendEmail({
      to: leadEmail,
      subject: reSubject,
      bodyText: r.ai_draft_response,
      bodyHtml: `<p>${r.ai_draft_response.replace(/\n/g, '<br>')}</p>`,
      threadId: r.email?.gmail_thread_id ?? undefined,
    })

    // 承認済みにマーク
    await supabase
      .from('sales_replies')
      .update({
        human_approved: true,
        responded_at: new Date().toISOString(),
      })
      .eq('id', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '送信エラー' },
      { status: 500 }
    )
  }
}
