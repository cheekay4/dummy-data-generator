/**
 * ACK（一次回答）自動送信サービス
 * 固定テンプレート。Claude API 不要。
 */

import { sendEmail } from '@/lib/gmail'
import { supabase } from '@/lib/supabase'
import { EMAIL_SIGNATURE } from '@/lib/email-signature'

// ACK をスキップすべきヘッダー
const AUTO_REPLY_HEADERS = [
  'x-autoreply',
  'x-autorespond',
  'auto-submitted',
]

// ACK をスキップすべきキーワード
const SKIP_KEYWORDS = [
  '配信停止', '配信を停止', '登録解除', 'unsubscribe',
  '不在', '自動返信', '不在通知', 'out of office',
  '送らないで', '迷惑',
]

/**
 * ACK を送るべきか判定
 */
export function shouldSendAck(params: {
  headers: Record<string, string>
  body: string
  intent?: string
  threadAlreadyAcked: boolean
}): boolean {
  // 同一スレッドで ACK 済み → スキップ
  if (params.threadAlreadyAcked) return false

  // unsubscribe / out_of_office → スキップ
  if (params.intent === 'unsubscribe' || params.intent === 'out_of_office') return false

  // auto-reply ヘッダー → スキップ
  for (const h of AUTO_REPLY_HEADERS) {
    if (params.headers[h]) return false
  }

  // 本文にスキップキーワード → スキップ（引用部分を除外）
  const bodyWithoutQuotes = params.body
    .split('\n')
    .filter((line) => !line.startsWith('>'))
    .join('\n')
  const bodyLower = bodyWithoutQuotes.toLowerCase()
  for (const kw of SKIP_KEYWORDS) {
    if (bodyLower.includes(kw)) return false
  }

  return true
}

/**
 * ACK メールを送信して記録する
 */
export async function sendAck(params: {
  to: string
  companyName: string
  threadId: string
  originalSubject: string
  leadId: string
  replyId: string
}): Promise<void> {
  const senderName = process.env.SENDER_NAME ?? 'Riku'

  const ackBody = `${params.companyName}様

ご返信ありがとうございます。
内容を確認の上、改めてご連絡いたします。

${EMAIL_SIGNATURE}`

  const ackHtml = ackBody
    .split('\n')
    .map((line) => (line === '' ? '<br>' : `<p style="margin:0">${line}</p>`))
    .join('')

  const subject = params.originalSubject.startsWith('Re:')
    ? params.originalSubject
    : `Re: ${params.originalSubject}`

  try {
    const result = await sendEmail({
      to: params.to,
      subject,
      bodyText: ackBody,
      bodyHtml: ackHtml,
      threadId: params.threadId,
    })

    // ACK を sales_emails に記録
    await supabase.from('sales_emails').insert({
      lead_id: params.leadId,
      subject,
      body_text: ackBody,
      body_html: ackHtml,
      gmail_message_id: result.messageId,
      gmail_thread_id: result.threadId,
      sent_at: new Date().toISOString(),
      status: 'sent',
      email_type: 'ack',
      auto_approved: true,
    })

    // sales_replies に ACK 送信時刻を記録
    await supabase
      .from('sales_replies')
      .update({ ack_sent_at: new Date().toISOString() })
      .eq('id', params.replyId)
  } catch (err) {
    console.error('ACK送信エラー:', err instanceof Error ? err.message : String(err))
  }
}
