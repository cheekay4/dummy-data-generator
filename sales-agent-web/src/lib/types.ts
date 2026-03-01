export type LeadStatus =
  | 'new'
  | 'analyzed'
  | 'draft_ready'
  | 'approved'
  | 'sent'
  | 'replied'
  | 'declined'
  | 'unsubscribed'
  | 'bounced'

export type EmailStatus = 'draft' | 'approved' | 'sent' | 'bounced' | 'replied' | 'rejected'

export type ReplyIntent =
  | 'interested'
  | 'not_interested'
  | 'question'
  | 'out_of_office'
  | 'unsubscribe'
  | 'soft_decline'
  | 'internal_review'

export type EmailType = 'initial' | 'followup_1' | 'followup_2' | 'reapproach' | 'ack'

export type ProductId = 'msgscore' | 'review-reply-ai'

export interface Lead {
  id: string
  company_name: string
  email: string
  website_url?: string
  industry?: string
  industry_detail?: Record<string, unknown>
  source_url?: string
  status: LeadStatus
  icp_score?: number
  personalization_hooks?: Record<string, unknown>
  estimated_scale?: string
  discovery_method?: string
  source_query?: string
  product: ProductId
  unsubscribed_at?: string
  bounced_at?: string
  conversation_phase?: string
  phase_changed_at?: string
  total_exchanges?: number
  created_at: string
  updated_at: string
}

export interface SalesEmail {
  id: string
  lead_id: string
  subject: string
  body_html: string
  body_text: string
  template_used?: string
  gmail_message_id?: string
  gmail_thread_id?: string
  sent_at?: string
  status: EmailStatus
  variant?: string
  msgscore?: number
  msgscore_detail?: Record<string, unknown>
  low_score?: boolean
  generation_attempt?: number
  test_sent_at?: string
  email_type?: EmailType
  auto_approved?: boolean
  bounce_reason?: string
  bounced_at?: string
  created_at: string
  lead?: Lead
}

export interface SalesReply {
  id: string
  email_id: string
  lead_id: string
  gmail_message_id?: string
  intent?: ReplyIntent
  intent_confidence?: number
  reply_body?: string
  ai_draft_response?: string
  ai_draft_subject?: string
  human_approved: boolean
  responded_at?: string
  ack_sent_at?: string
  reply_stage?: string
  needs_research?: boolean
  escalation_reason?: string
  knowledge_hits?: Record<string, unknown>
  conversation_history?: Record<string, unknown>
  final_response_sent_at?: string
  created_at: string
  lead?: Lead
}

export interface DailyStats {
  date: string
  emails_sent: number
  emails_opened: number
  replies_received: number
  positive_replies: number
}

export interface NextAction {
  id: string
  lead_id: string
  email_id?: string
  action_type: string
  scheduled_at: string
  status: 'pending' | 'completed' | 'cancelled'
  context: Record<string, unknown>
  created_at: string
  completed_at?: string
}

export interface KnowledgeEntry {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
  confidence: number
  usage_count: number
  product: string
  created_at: string
  updated_at: string
}

export interface VocEntry {
  id: string
  reply_id?: string
  lead_id: string
  category: string
  content: string
  raw_quote?: string
  sentiment?: string
  cluster_id?: string
  product: string
  created_at: string
}
