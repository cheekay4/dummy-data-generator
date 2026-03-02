import { createHmac } from 'crypto'

const SECRET = process.env.QUICK_APPROVE_SECRET ?? ''

export function generateUnsubscribeToken(leadId: string): string {
  return createHmac('sha256', SECRET)
    .update(`unsubscribe:${leadId}`)
    .digest('hex')
}

export function verifyUnsubscribeToken(leadId: string, token: string): boolean {
  if (!SECRET || !token) return false
  const expected = generateUnsubscribeToken(leadId)
  // タイミング攻撃対策: 長さチェック + 全文字比較
  if (expected.length !== token.length) return false
  let match = true
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== token[i]) match = false
  }
  return match
}

export function getUnsubscribeUrl(leadId: string): string {
  const token = generateUnsubscribeToken(leadId)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sales-agent-web-drab.vercel.app'
  return `${base}/api/unsubscribe/${leadId}?token=${token}`
}
