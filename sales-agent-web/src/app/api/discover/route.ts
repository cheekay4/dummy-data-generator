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

interface TavilyResult {
  title: string
  url: string
  content?: string
  score?: number
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

  const apiKey = process.env.TAVILY_API_KEY

  // API KEY 未設定の場合はモックデータを返す
  if (!apiKey) {
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
    ]
    return NextResponse.json({
      candidates: mockCandidates,
      total_found: mockCandidates.length,
      with_email: mockCandidates.filter((c) => c.email).length,
      note: 'TAVILY_API_KEY が未設定のため、デモ用のモックデータを表示しています。',
    })
  }

  // Tavily Search API を呼び出す
  const term = INDUSTRY_TERMS[industry] ?? industry
  const loc = `${region}${sub_region ? ` ${sub_region}` : ''}`
  const queries = [
    `${term.split(' ')[0]} ${loc} 公式サイト お問い合わせ`,
    keyword ? `${term.split(' ')[0]} ${loc} ${keyword}` : null,
  ].filter(Boolean) as string[]

  const candidates: Candidate[] = []

  for (const q of queries) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query: q,
          search_depth: 'basic',
          max_results: 10,
          include_answer: false,
        }),
      })

      const data = await res.json() as { results?: TavilyResult[]; error?: string }

      if (data.error) {
        console.error('Tavily error:', data.error)
        continue
      }

      for (const item of data.results ?? []) {
        // 大手ポータルサイトを除外（個別店舗サイトを優先）
        const skipDomains = ['tabelog.com', 'hotpepper.jp', 'jalan.net', 'amazon.co.jp', 'rakuten.co.jp', 'wikipedia.org', 'youtube.com', 'instagram.com', 'twitter.com', 'x.com', 'facebook.com']
        try {
          const urlObj = new URL(item.url)
          if (skipDomains.some((d) => urlObj.hostname.includes(d))) continue
        } catch {
          continue
        }

        if (!candidates.find((c) => c.website_url === item.url)) {
          candidates.push({
            name: item.title.split('|')[0].split('–')[0].split('-')[0].trim().slice(0, 40),
            email: null,
            website_url: item.url,
            industry,
            estimated_scale: scale.includes('individual') ? 'individual' : 'small',
            has_line_official: item.content?.includes('LINE') ?? false,
            source_url: 'https://tavily.com',
          })
        }
        if (candidates.length >= limit) break
      }
    } catch (err) {
      console.error('Tavily fetch error:', err instanceof Error ? err.message : String(err))
    }
    if (candidates.length >= limit) break
  }

  return NextResponse.json({
    candidates: candidates.slice(0, limit),
    total_found: candidates.length,
    with_email: candidates.filter((c) => c.email).length,
    note: 'Tavily Search API 使用中。メール抽出は CLI (scrape コマンド) で実施してください。',
  })
}
