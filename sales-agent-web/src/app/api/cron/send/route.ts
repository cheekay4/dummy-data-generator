import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/gmail'
import type { SalesEmail } from '@/lib/types'

const DAILY_LIMIT = 20
const MIN_INTERVAL_MS = 60_000 // 60秒

/**
 * Cron エンドポイント: 承認済みメールを送信する（Step 7）
 * Vercel Cron または外部スケジューラーから Authorization: Bearer {CRON_SECRET} で呼び出す
 */
export async function POST(req: NextRequest) {
  // 認証チェック
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 今日の送信数チェック
  const today = new Date().toISOString().split('T')[0]!
  const { data: statsRow } = await supabase
    .from('sales_daily_stats')
    .select('emails_sent')
    .eq('date', today)
    .single()

  const todaySent = (statsRow as { emails_sent?: number } | null)?.emails_sent ?? 0
  if (todaySent >= DAILY_LIMIT) {
    return NextResponse.json({ ok: true, sent: 0, reason: `日次上限 ${DAILY_LIMIT} 通に到達済み` })
  }

  const remaining = DAILY_LIMIT - todaySent

  // 承認済みメールを取得（lead JOIN）
  const { data: approved } = await supabase
    .from('sales_emails')
    .select('*, lead:lead_id(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: true })
    .limit(remaining)

  if (!approved?.length) {
    return NextResponse.json({ ok: true, sent: 0, reason: '承認済みメールなし' })
  }

  let sent = 0
  const errors: string[] = []

  for (const email of approved as SalesEmail[]) {
    if (!email.lead?.email) {
      errors.push(`email_id=${email.id}: リードのメールアドレスなし`)
      continue
    }

    try {
      const { messageId, threadId } = await sendEmail({
        to: email.lead.email,
        subject: email.subject,
        bodyText: email.body_text,
        bodyHtml: email.body_html,
      })

      // 送信済みに更新
      await supabase
        .from('sales_emails')
        .update({
          status: 'sent',
          gmail_message_id: messageId,
          gmail_thread_id: threadId,
          sent_at: new Date().toISOString(),
        })
        .eq('id', email.id)

      // リードステータスを sent に更新
      await supabase
        .from('sales_leads')
        .update({ status: 'sent', updated_at: new Date().toISOString() })
        .eq('id', email.lead_id)

      // 日次統計を更新（UPSERT）
      await supabase.from('sales_daily_stats').upsert(
        { date: today, emails_sent: todaySent + sent + 1 },
        { onConflict: 'date' }
      )

      sent++

      // 送信間隔を確保（最後の1通は不要）
      if (sent < approved.length) {
        await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS))
      }
    } catch (err) {
      errors.push(`email_id=${email.id}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return NextResponse.json({ ok: true, sent, errors: errors.length ? errors : undefined })
}
