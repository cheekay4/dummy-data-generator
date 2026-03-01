import { NextRequest, NextResponse } from 'next/server'
import { searchPlaces } from '@/lib/google-places'
import { extractEmailsFromWebsite, isPortalDomain } from '@/lib/email-scraper'

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

export interface Candidate {
  name: string
  email: string | null
  website_url: string
  industry: string
  estimated_scale: string
  has_line_official: boolean
  source_url: string
  // Google Places 拡張フィールド
  google_place_id?: string
  google_rating?: number | null
  google_review_count?: number | null
  phone?: string | null
  address?: string | null
  google_maps_url?: string | null
  source: 'google_places' | 'tavily' | 'mock'
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

  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const tavilyApiKey = process.env.TAVILY_API_KEY

  // === 両方未設定 → モック ===
  if (!googleApiKey && !tavilyApiKey) {
    const mockCandidates: Candidate[] = [
      {
        name: `${region}のサンプル企業（${INDUSTRY_TERMS[industry]?.split(' ')[0] ?? industry}）`,
        email: `sample-a@${industry}-${region.replace('都', '').replace('府', '').replace('県', '')}.jp`,
        website_url: `https://${industry}-sample-a.jp`,
        industry,
        estimated_scale: scale[0] ?? 'small',
        has_line_official: true,
        source_url: 'https://www.google.com/search',
        source: 'mock',
      },
      {
        name: `${sub_region ?? region}の個人事業主B`,
        email: `owner-b@${industry}-sample.com`,
        website_url: `https://${industry}-individual-b.jp`,
        industry,
        estimated_scale: 'individual',
        has_line_official: false,
        source_url: 'https://www.google.com/search',
        source: 'mock',
      },
    ]
    return NextResponse.json({
      candidates: mockCandidates,
      total_found: mockCandidates.length,
      with_email: mockCandidates.filter((c) => c.email).length,
      note: 'GOOGLE_PLACES_API_KEY / TAVILY_API_KEY が未設定のため、デモ用のモックデータを表示しています。',
    })
  }

  const candidates: Candidate[] = []

  // ========================================
  // Stage 1: Google Places API → 店舗リスト取得
  // ========================================
  if (googleApiKey) {
    const places = await searchPlaces({
      industry,
      region,
      subRegion: sub_region,
      keyword,
      limit: Math.min(limit, 20),
    })

    for (const place of places) {
      // チェーン店スキップ（レビュー1000件超）
      if (place.userRatingCount && place.userRatingCount > 1000) continue
      // サイトなしスキップ
      if (!place.websiteUri) continue
      // ポータルサイトスキップ
      if (isPortalDomain(place.websiteUri)) continue
      // 重複チェック
      if (candidates.find((c) => c.website_url === place.websiteUri)) continue

      candidates.push({
        name: place.displayName.slice(0, 40),
        email: null, // Stage 2 で抽出
        website_url: place.websiteUri,
        industry,
        estimated_scale: scale.includes('individual') ? 'individual' : 'small',
        has_line_official: false,
        source_url: place.googleMapsUri ?? 'https://maps.google.com',
        google_place_id: place.placeId,
        google_rating: place.rating,
        google_review_count: place.userRatingCount,
        phone: place.nationalPhoneNumber,
        address: place.formattedAddress,
        google_maps_url: place.googleMapsUri,
        source: 'google_places',
      })
    }
  }

  // ========================================
  // Stage 2: 各サイトからメール抽出（5件バッチ）
  // ========================================
  if (candidates.length > 0) {
    const BATCH_SIZE = 5
    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      const batch = candidates.slice(i, i + BATCH_SIZE)
      const emailResults = await Promise.all(
        batch.map((c) => extractEmailsFromWebsite(c.website_url))
      )
      for (let j = 0; j < batch.length; j++) {
        const emails = emailResults[j]
        if (emails.length > 0) {
          batch[j].email = emails[0]
        }
      }
    }
  }

  // ========================================
  // Stage 3: メール未検出の店舗に Tavily で補助検索（最大5クエリ）
  // ========================================
  if (tavilyApiKey) {
    const noEmailCandidates = candidates.filter((c) => !c.email)
    const tavilyTargets = noEmailCandidates.slice(0, 5)

    for (const target of tavilyTargets) {
      try {
        const res = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyApiKey,
            query: `${target.name} メールアドレス お問い合わせ`,
            search_depth: 'basic',
            max_results: 3,
            include_answer: false,
          }),
        })

        const data = await res.json() as { results?: TavilyResult[]; error?: string }
        if (data.error) continue

        const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
        const skipDomains = ['example.com', 'sentry.io', 'wixpress.com']

        for (const item of data.results ?? []) {
          const found = item.content?.match(emailRegex) ?? []
          const email = found.find((e) => !skipDomains.some((d) => e.includes(d)))
          if (email) {
            target.email = email
            break
          }
        }
      } catch (err) {
        console.error('Tavily補助検索エラー:', err instanceof Error ? err.message : String(err))
      }
    }

    // Google Places で候補が少ない場合は Tavily で追加検索
    if (candidates.length < 5) {
      const term = INDUSTRY_TERMS[industry] ?? industry
      const loc = `${region}${sub_region ? ` ${sub_region}` : ''}`
      const queries = [
        `${term.split(' ')[0]} ${loc} 公式サイト メール 個人店`,
        keyword ? `${term.split(' ')[0]} ${loc} ${keyword}` : null,
      ].filter(Boolean) as string[]

      for (const q of queries) {
        try {
          const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: tavilyApiKey,
              query: q,
              search_depth: 'basic',
              max_results: 10,
              include_answer: false,
            }),
          })

          const data = await res.json() as { results?: TavilyResult[]; error?: string }
          if (data.error) continue

          const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
          const skipDomains = ['example.com', 'sentry.io', 'wixpress.com']

          for (const item of data.results ?? []) {
            if (isPortalDomain(item.url)) continue
            if (candidates.find((c) => c.website_url === item.url)) continue

            const found = item.content?.match(emailRegex) ?? []
            const email = found.find((e) => !skipDomains.some((d) => e.includes(d))) ?? null

            candidates.push({
              name: item.title.split('|')[0].split('–')[0].split('-')[0].trim().slice(0, 40),
              email,
              website_url: item.url,
              industry,
              estimated_scale: scale.includes('individual') ? 'individual' : 'small',
              has_line_official: item.content?.includes('LINE') ?? false,
              source_url: 'https://tavily.com',
              source: 'tavily',
            })

            if (candidates.length >= limit) break
          }
        } catch (err) {
          console.error('Tavily追加検索エラー:', err instanceof Error ? err.message : String(err))
        }
        if (candidates.length >= limit) break
      }
    }
  }

  // ========================================
  // ソート: メールあり → なし、同順位なら rating 降順
  // ========================================
  candidates.sort((a, b) => {
    if (a.email && !b.email) return -1
    if (!a.email && b.email) return 1
    const ratingA = a.google_rating ?? 0
    const ratingB = b.google_rating ?? 0
    return ratingB - ratingA
  })

  const sources: string[] = []
  if (candidates.some((c) => c.source === 'google_places')) sources.push('Google Places API')
  if (candidates.some((c) => c.source === 'tavily')) sources.push('Tavily Search')

  return NextResponse.json({
    candidates: candidates.slice(0, limit),
    total_found: candidates.length,
    with_email: candidates.filter((c) => c.email).length,
    note: sources.length > 0
      ? `${sources.join(' + ')} で検索。メール抽出はサイト巡回で実施。`
      : undefined,
  })
}
