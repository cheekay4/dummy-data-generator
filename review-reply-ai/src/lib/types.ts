export type Platform =
  | 'Google マップ'
  | '食べログ'
  | 'ホットペッパー'
  | 'Amazon'
  | '楽天'
  | 'じゃらん'
  | 'トリップアドバイザー'
  | 'その他'

export type BusinessType =
  | '飲食店（カフェ・レストラン・居酒屋）'
  | '美容院・ネイルサロン'
  | 'クリニック・歯科'
  | 'ホテル・旅館'
  | '小売店・雑貨店'
  | '整体・マッサージ'
  | '不動産'
  | 'その他（自由記述）'

export type Tone = '丁寧' | 'フレンドリー' | 'カジュアル'

export type Sentiment = 'positive' | 'negative' | 'mixed'

export interface ReplyPattern {
  label: string
  reply: string
}

export interface GenerateReplyResult {
  sentiment: Sentiment
  patterns: [ReplyPattern, ReplyPattern]
  tips: string
}

export interface GenerateReplyRequest {
  reviewText: string
  rating: number
  platform: Platform
  businessType: BusinessType
  tone: Tone
  shopName?: string
  shopDescription?: string
  source: 'web' | 'api'
}

export type GenerateReplyResponse =
  | { success: true; data: GenerateReplyResult; remainingToday: number }
  | { success: false; error: string; remainingToday?: number }
