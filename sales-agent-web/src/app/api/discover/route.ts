import { NextRequest, NextResponse } from 'next/server'

const INDUSTRY_TERMS: Record<string, string> = {
  restaurant: '飲食店 カフェ レストラン',
  ec:         'EC 通販 ネットショップ',
  gym:        'パーソナルジム フィットネス パーソナルトレーナー',
  beauty:     'ネイルサロン エステ 美容室',
  saas:       'SaaS ITサービス スタートアップ',
  realestate: '不動産 賃貸',
  school:     '教室 スクール ヨガ ピラティス',
  other:      '',
}

interface Candidate {
  name: string
  email: string | null
  website_url: string
  industry: string
  estimated_scale: string
  has_line_official: boolean
  source_url: string
}

export async function POST(req: NextRequest) {
  const { industry, region, sub_region, scale, keyword, limit = 20 } = await req.json() as {
    industry: string
    region: string
    sub_region?: string
    scale: string[]
    keyword?: string
    limit?: number
  }

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const cx = process.env.GOOGLE_SEARCH_CX

  // API KEY 未設定の場合はモックデータを返す
  if (!apiKey || !cx) {
    const mockCandidates: Candidate[] = [
      {
        name: `${region}のサンプル企業（${INDUSTRY_TERMS[industry]?.split(' ')[0] ?? industry}）`,
        email: `sample-a@${industry}-${region.replace('都', '').replace('府', '').replace('県', '')}.jp`,
        website_url: `https://${industry}-sample-a.jp`,
        industry,
        estimated_scale: scale[0] ?? 'small',
        has_line_official: true,
        source_url: 'https://www.google.com/search',
      },
      {
        name: `${sub_region ?? region}の個人事業主B`,
        email: `owner-b@${industry}-sample.com`,
        website_url: `https://${industry}-individual-b.jp`,
        industry,
        estimated_scale: 'individual',
        has_line_official: false,
        source_url: 'https://www.google.com/search',
      },
      {
        name: `${region}のメール未検出C`,
        email: null,
        website_url: `https://${industry}-no-email-c.jp`,
        industry,
        estimated_scale: 'small',
        has_line_official: false,
        source_url: 'https://www.google.com/search',
      },
    ]
    return NextResponse.json({
      candidates: mockCandidates,
      total_found: mockCandidates.length,
      with_email: mockCandidates.filter((c) => c.email).length,
      note: 'GOOGLE_SEARCH_API_KEY / GOOGLE_SEARCH_CX が未設定のため、デモ用のモックデータを表示しています。実運用時は Google Custom Search API を設定してください。',
    })
  }

  // Google Custom Search API を呼び出す
  const term = INDUSTRY_TERMS[industry] ?? industry
  const loc = `${region}${sub_region ? ` ${sub_region}` : ''}`
  const queries = [
    `${term.split(' ')[0]} ${loc} メールアドレス お問い合わせ`,
    keyword ? `${term.split(' ')[0]} ${loc} ${keyword}` : null,
  ].filter(Boolean) as string[]

  const candidates: Candidate[] = []

  for (const q of queries) {
    const url = new URL('https://www.googleapis.com/customsearch/v1')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('cx', cx)
    url.searchParams.set('q', q)
    url.searchParams.set('num', '5')
    url.searchParams.set('gl', 'jp')
    url.searchParams.set('hl', 'ja')

    try {
      const res = await fetch(url.toString())
      const data = await res.json() as { items?: Array<{ title: string; link: string; snippet?: string }> }
      for (const item of data.items ?? []) {
        if (!candidates.find((c) => c.website_url === item.link)) {
          candidates.push({
            name: item.title.split('|')[0].split('–')[0].split('-')[0].trim().slice(0, 40),
            email: null, // メール抽出はPlaywright CLI で実施
            website_url: item.link,
            industry,
            estimated_scale: scale.includes('individual') ? 'individual' : 'small',
            has_line_official: item.snippet?.includes('LINE') ?? false,
            source_url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
          })
        }
        if (candidates.length >= limit) break
      }
    } catch {
      // 個別クエリのエラーはスキップ
    }
    if (candidates.length >= limit) break
  }

  return NextResponse.json({
    candidates: candidates.slice(0, limit),
    total_found: candidates.length,
    with_email: candidates.filter((c) => c.email).length,
    note: 'Google Custom Search API 使用中。メール抽出は CLI (scrape コマンド) で実施してください。',
  })
}
