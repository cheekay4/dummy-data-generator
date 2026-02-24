export type LeadStatus =
  | 'new'
  | 'analyzed'
  | 'draft_ready'
  | 'approved'
  | 'sent'
  | 'replied'
  | 'declined'
  | 'unsubscribed'

export type EmailStatus = 'draft' | 'approved' | 'sent' | 'bounced' | 'replied' | 'rejected'
export type ReplyIntent =
  | 'interested'
  | 'not_interested'
  | 'question'
  | 'out_of_office'
  | 'unsubscribe'

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
