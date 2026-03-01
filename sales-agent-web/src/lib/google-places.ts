/**
 * Google Places API (New) — Text Search クライアント
 */

// 都道府県 → 緯度経度マッピング（locationBias 用）
const PREFECTURE_COORDS: Record<string, { lat: number; lng: number }> = {
  '北海道': { lat: 43.0642, lng: 141.3469 },
  '東京都': { lat: 35.6762, lng: 139.6503 },
  '神奈川県': { lat: 35.4478, lng: 139.6425 },
  '埼玉県': { lat: 35.8617, lng: 139.6455 },
  '千葉県': { lat: 35.6047, lng: 140.1233 },
  '大阪府': { lat: 34.6937, lng: 135.5023 },
  '京都府': { lat: 35.0116, lng: 135.7681 },
  '兵庫県': { lat: 34.6913, lng: 135.1830 },
  '愛知県': { lat: 35.1802, lng: 136.9066 },
  '福岡県': { lat: 33.5904, lng: 130.4017 },
}

// 業種 → Google Place Type マッピング
const INDUSTRY_PLACE_TYPES: Record<string, string[]> = {
  restaurant: ['restaurant', 'cafe', 'bakery', 'bar'],
  beauty: ['beauty_salon', 'hair_salon', 'nail_salon', 'spa'],
  gym: ['gym', 'fitness_center'],
  school: ['school', 'yoga_studio'],
  realestate: ['real_estate_agency'],
  ec: [],
  saas: [],
  other: [],
}

// 業種 → 検索テキスト（Places Text Search 用）
const INDUSTRY_TEXT: Record<string, string> = {
  restaurant: '飲食店 レストラン カフェ',
  beauty: 'ネイルサロン エステ 美容室',
  gym: 'パーソナルジム フィットネス',
  school: '教室 スクール ヨガ',
  realestate: '不動産',
  ec: 'EC 通販 ネットショップ',
  saas: 'SaaS ITサービス',
  other: '',
}

export interface PlaceResult {
  displayName: string
  formattedAddress: string
  websiteUri: string | null
  nationalPhoneNumber: string | null
  rating: number | null
  userRatingCount: number | null
  googleMapsUri: string | null
  placeId: string
  primaryType: string | null
}

interface PlacesAPIResponse {
  places?: Array<{
    name?: string // resource name like "places/ChIJ..."
    displayName?: { text?: string }
    formattedAddress?: string
    websiteUri?: string
    nationalPhoneNumber?: string
    rating?: number
    userRatingCount?: number
    googleMapsUri?: string
    primaryType?: string
  }>
  nextPageToken?: string
}

const FIELD_MASK = [
  'places.name',
  'places.displayName',
  'places.formattedAddress',
  'places.websiteUri',
  'places.nationalPhoneNumber',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'places.primaryType',
].join(',')

export async function searchPlaces(opts: {
  industry: string
  region: string
  subRegion?: string
  keyword?: string
  limit?: number
}): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return []

  const maxResults = Math.min(opts.limit ?? 20, 20) // API max per request is 20
  const coords = PREFECTURE_COORDS[opts.region]

  // Build text query
  const industryText = INDUSTRY_TEXT[opts.industry] ?? opts.industry
  const locationText = `${opts.region}${opts.subRegion ? ` ${opts.subRegion}` : ''}`
  const textQuery = [industryText, locationText, opts.keyword].filter(Boolean).join(' ')

  const body: Record<string, unknown> = {
    textQuery,
    languageCode: 'ja',
    maxResultCount: maxResults,
  }

  // includedType: use first matching Place Type if available
  const placeTypes = INDUSTRY_PLACE_TYPES[opts.industry]
  if (placeTypes && placeTypes.length > 0) {
    body.includedType = placeTypes[0]
  }

  // locationBias: circle around prefecture center (30km radius)
  if (coords) {
    body.locationBias = {
      circle: {
        center: { latitude: coords.lat, longitude: coords.lng },
        radius: 30000.0,
      },
    }
  }

  const results: PlaceResult[] = []

  try {
    const res = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      console.error('Google Places API error:', res.status, await res.text())
      return []
    }

    const data: PlacesAPIResponse = await res.json()

    for (const place of data.places ?? []) {
      // Extract place ID from resource name "places/ChIJ..."
      const placeId = place.name?.replace('places/', '') ?? ''

      results.push({
        displayName: place.displayName?.text ?? '',
        formattedAddress: place.formattedAddress ?? '',
        websiteUri: place.websiteUri ?? null,
        nationalPhoneNumber: place.nationalPhoneNumber ?? null,
        rating: place.rating ?? null,
        userRatingCount: place.userRatingCount ?? null,
        googleMapsUri: place.googleMapsUri ?? null,
        placeId,
        primaryType: place.primaryType ?? null,
      })
    }
  } catch (err) {
    console.error('Google Places fetch error:', err instanceof Error ? err.message : String(err))
  }

  return results
}
