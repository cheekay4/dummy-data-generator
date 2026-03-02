import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyUnsubscribeToken } from '@/lib/hmac'

const UNSUBSCRIBE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>配信停止完了</title>
<style>
  body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; }
  .card { text-align: center; background: white; border-radius: 16px; padding: 48px 32px; max-width: 400px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  h1 { font-size: 20px; margin-bottom: 12px; }
  p { font-size: 14px; color: #78716c; line-height: 1.6; }
</style>
</head>
<body>
<div class="card">
  <h1>配信停止を承りました</h1>
  <p>今後メールをお送りすることはございません。<br>ご不便をおかけし申し訳ございませんでした。</p>
</div>
</body>
</html>`

async function handleUnsubscribe(leadId: string, token: string | null): Promise<Response> {
  if (!token || !verifyUnsubscribeToken(leadId, token)) {
    return new Response('無効なリンクです', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  // リードを配信停止に更新
  await supabase
    .from('sales_leads')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('id', leadId)

  // pending のフォローアップを全てキャンセル
  await supabase
    .from('sales_next_actions')
    .update({ status: 'cancelled' })
    .eq('lead_id', leadId)
    .eq('status', 'pending')

  return new Response(UNSUBSCRIBE_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// RFC 8058 One-Click Unsubscribe（メールクライアントからの POST）
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params
  const url = new URL(req.url)
  let token = url.searchParams.get('token')

  // One-Click の場合は form body にも token がある可能性
  if (!token) {
    try {
      const formData = await req.formData()
      token = formData.get('token') as string | null
    } catch {
      // body が form でない場合は無視
    }
  }

  return handleUnsubscribe(leadId, token)
}

// ブラウザからのリンククリック
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  return handleUnsubscribe(leadId, token)
}
