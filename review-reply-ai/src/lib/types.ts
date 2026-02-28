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

export type AxisKey = 'agreeableness' | 'extraversion' | 'conscientiousness' | 'openness'

export type DISCType = 'D' | 'I' | 'S' | 'C'

export type CreationMethod = 'text_learning' | 'diagnosis'

export type Plan = 'free' | 'pro'

export interface UserProfile {
  id: string
  email: string | null
  display_name: string | null
  stripe_customer_id: string | null
  plan: Plan
  created_at: string
}

export interface ReplyProfile {
  id: string
  user_id: string
  profile_name: string
  agreeableness: number   // 0-5, 0.5刻み
  extraversion: number    // 0-5, 0.5刻み
  conscientiousness: number // 0-5, 0.5刻み
  openness: number        // 0-5, 0.5刻み
  disc_type: DISCType | null
  analysis_text: string | null
  speaking_style: string | null
  creation_method: CreationMethod
  shop_name: string | null
  shop_description: string | null
  business_type: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface ReplyPattern {
  label: string
  reply: string
}

export interface CustomerAnalysis {
  estimatedDemographic: string
  priorities: string[]
  visitMotivation: string
  repeatLikelihood: number // 1-5
  insight: string
}

export interface GenerateReplyResult {
  sentiment: Sentiment
  patterns: [ReplyPattern, ReplyPattern]
  tips: string
  customerAnalysis: CustomerAnalysis
}

export interface GenerateReplyRequest {
  reviewText: string
  rating: number
  platform: Platform
  businessType: BusinessType
  tone: Tone
  shopName?: string
  shopDescription?: string
  profileId?: string
  modifierId?: string
  source: 'web' | 'api'
}

export type GenerateReplyResponse =
  | { success: true; data: GenerateReplyResult; remainingToday: number }
  | { success: false; error: string; remainingToday?: number }

export interface AnalyzeWritingResult {
  scores: {
    agreeableness: number
    extraversion: number
    conscientiousness: number
    openness: number
  }
  analysis: string
  speaking_patterns: string[]
  disc_type: DISCType
}

export interface ReplyHistory {
  id: string
  user_id: string
  review_text: string
  rating: number
  platform: string | null
  business_type: string | null
  tone: string | null
  profile_id: string | null
  generated_replies: ReplyPattern[]
  selected_reply: string | null
  created_at: string
}

// --- Admin types ---

export interface AdminStats {
  totalUsers: number
  newUsersThisWeek: number
  proCount: number
  generationsToday: number
  anonymousTrialsToday: number
  activeUsersToday: number
  recentSignups: { email: string; created_at: string }[]
}

export interface AdminUser {
  id: string
  email: string
  display_name: string | null
  plan: Plan
  created_at: string
  usageToday: number
  profileCount: number
}

export interface AdminUserDetail extends AdminUser {
  replyProfiles: ReplyProfile[]
  recentUsage: { date: string; count: number }[]
  recentHistory: ReplyHistory[]
  subscription: {
    stripe_subscription_id: string | null
    status: string | null
  } | null
}

export interface AdminAuditLog {
  id: string
  admin_id: string
  action: string
  target_id: string | null
  details: Record<string, unknown>
  created_at: string
}
