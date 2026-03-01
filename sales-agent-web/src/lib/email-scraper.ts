/**
 * fetch ベースのメール抽出（Vercel serverless 対応）
 * Playwright 不要 — HTML を取得して正規表現で抽出
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

// 除外するメールプレフィックス
const GENERIC_PREFIXES = [
  'noreply', 'no-reply', 'donotreply', 'do-not-reply',
  'bounce', 'mailer-daemon', 'postmaster', 'webmaster',
  'abuse', 'spam', 'newsletter', 'info@example',
]

// 除外するメールドメイン
const SKIP_EMAIL_DOMAINS = [
  'example.com', 'example.jp', 'sentry.io', 'wixpress.com',
  'wix.com', 'googleapis.com', 'googleusercontent.com',
  'schema.org', 'w3.org', 'apple.com', 'microsoft.com',
  'wordpress.com', 'wordpress.org',
]

// ポータルサイト — これらのドメイン上のページから抽出したメールは無視
const PORTAL_DOMAINS = [
  'tabelog.com', 'hotpepper.jp', 'jalan.net', 'amazon.co.jp',
  'rakuten.co.jp', 'wikipedia.org', 'youtube.com', 'instagram.com',
  'twitter.com', 'x.com', 'facebook.com', 'tiktok.com',
  'gnavi.co.jp', 'retty.me', 'yelp.com', 'tripadvisor.com',
  'tripadvisor.jp', 'google.com', 'google.co.jp',
  'sales-agent-web-drab.vercel.app',
]

// メールが本物っぽいかフィルタ
function isValidEmail(email: string): boolean {
  const lower = email.toLowerCase()
  if (GENERIC_PREFIXES.some((p) => lower.startsWith(p))) return false
  const domain = lower.split('@')[1]
  if (!domain) return false
  if (SKIP_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) return false
  // 画像ファイル拡張子っぽいものを除外
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(domain)) return false
  return true
}

// ポータルドメインか判定
export function isPortalDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return PORTAL_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))
  } catch {
    return false
  }
}

// HTMLからメールアドレスを抽出
function extractEmailsFromHtml(html: string): string[] {
  const found = new Set<string>()

  // mailto: リンクから抽出
  const mailtoRegex = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi
  let match: RegExpExecArray | null
  while ((match = mailtoRegex.exec(html)) !== null) {
    const email = match[1].toLowerCase()
    if (isValidEmail(email)) found.add(email)
  }

  // テキストから抽出
  const textEmails = html.match(EMAIL_REGEX) ?? []
  for (const email of textEmails) {
    const lower = email.toLowerCase()
    if (isValidEmail(lower)) found.add(lower)
  }

  return [...found]
}

// 単一URLをfetchしてメール抽出
async function fetchAndExtract(url: string, timeoutMs: number): Promise<string[]> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
      redirect: 'follow',
    })

    clearTimeout(timer)

    if (!res.ok) return []
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) return []

    const html = await res.text()
    return extractEmailsFromHtml(html)
  } catch {
    return []
  }
}

// サブページ候補パス
const CONTACT_PATHS = [
  '/contact', '/contact/', '/contact.html',
  '/about', '/about/', '/about.html',
  '/company', '/company/', '/company.html',
  '/inquiry', '/inquiry/',
  '/otoiawase', '/otoiawase/',
  '/access', '/access/',
  '/info', '/info/',
]

/**
 * ウェブサイトからメールアドレスを抽出
 * メインページ → 未検出ならサブページ(contact, about等)を試行
 */
export async function extractEmailsFromWebsite(websiteUrl: string): Promise<string[]> {
  if (!websiteUrl || isPortalDomain(websiteUrl)) return []

  // Stage 1: メインページ
  const mainEmails = await fetchAndExtract(websiteUrl, 8000)
  if (mainEmails.length > 0) return mainEmails

  // Stage 2: サブページを試行
  let baseUrl: string
  try {
    const parsed = new URL(websiteUrl)
    baseUrl = `${parsed.protocol}//${parsed.host}`
  } catch {
    return []
  }

  // 3つずつ並列で試行（Vercelタイムアウト回避）
  for (let i = 0; i < CONTACT_PATHS.length; i += 3) {
    const batch = CONTACT_PATHS.slice(i, i + 3)
    const results = await Promise.all(
      batch.map((path) => fetchAndExtract(`${baseUrl}${path}`, 5000))
    )
    const found = results.flat()
    if (found.length > 0) return [...new Set(found)]
  }

  return []
}
