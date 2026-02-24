/**
 * Gmail REST API クライアント（web app 用）
 * googleapis パッケージ不要 — fetch で直接呼び出す
 */

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gmail OAuth トークン取得失敗: ${text}`)
  }
  const data = await res.json() as { access_token: string }
  return data.access_token
}

function buildMimeMessage(params: {
  to: string
  subject: string
  bodyText: string
  bodyHtml: string
  threadId?: string
  inReplyTo?: string
}): string {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const senderName = process.env.SENDER_NAME ?? 'Riku'
  const senderEmail = process.env.SENDER_EMAIL ?? ''
  const date = new Date().toUTCString()
  const encodedSubject = `=?UTF-8?B?${Buffer.from(params.subject).toString('base64')}?=`

  const lines = [
    `From: ${senderName} <${senderEmail}>`,
    `To: ${params.to}`,
    `Subject: ${encodedSubject}`,
    `Date: ${date}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ]
  if (params.inReplyTo) {
    lines.push(`In-Reply-To: ${params.inReplyTo}`)
    lines.push(`References: ${params.inReplyTo}`)
  }
  lines.push(
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(params.bodyText).toString('base64'),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(params.bodyHtml).toString('base64'),
    ``,
    `--${boundary}--`,
  )
  return lines.join('\r\n')
}

function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

interface SendResult {
  messageId: string
  threadId: string
}

export async function sendEmail(params: {
  to: string
  subject: string
  bodyText: string
  bodyHtml: string
  threadId?: string
  inReplyTo?: string
}): Promise<SendResult> {
  const accessToken = await getAccessToken()
  const mime = buildMimeMessage(params)
  const raw = toBase64Url(mime)

  const body: Record<string, string> = { raw }
  if (params.threadId) body.threadId = params.threadId

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gmail 送信失敗: ${text}`)
  }

  const data = await res.json() as { id: string; threadId: string }
  return { messageId: data.id, threadId: data.threadId }
}
