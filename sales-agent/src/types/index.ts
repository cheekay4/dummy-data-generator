export type Industry = 'ec_retail' | 'restaurant' | 'gym' | 'saas' | 'other';

export type LeadStatus =
  | 'new'
  | 'analyzed'
  | 'draft_ready'
  | 'approved'
  | 'sent'
  | 'replied'
  | 'declined'
  | 'unsubscribed';

export type EmailStatus = 'draft' | 'approved' | 'sent' | 'bounced' | 'replied';

export type ReplyIntent =
  | 'interested'
  | 'not_interested'
  | 'question'
  | 'out_of_office'
  | 'unsubscribe';

export interface IndustryDetail {
  business_type: string;
  key_services: string[];
  target_customers: string;
  pain_points: string[];
  online_presence: {
    has_line: boolean;
    has_newsletter: boolean;
    has_ec: boolean;
    sns_platforms: string[];
  };
  personalization_angle: string;
}

export interface PersonalizationHook {
  type: 'company_specific' | 'industry_trend' | 'pain_point' | 'compliment';
  content: string;
}

export interface Lead {
  id: string;
  company_name: string;
  email: string;
  website_url: string;
  industry: Industry;
  industry_detail: IndustryDetail;
  source_url: string;
  status: LeadStatus;
  icp_score: number;
  personalization_hooks: PersonalizationHook[];
  created_at: string;
  updated_at: string;
}

export interface EmailDraft {
  lead_id: string;
  subject: string;
  body_html: string;
  body_text: string;
  template_used: string;
  // Add-B: A/B テスト + MsgScore セルフスコアリング
  variant?: 'A' | 'B';
  msgscore?: number;
  msgscore_detail?: Record<string, unknown>;
  low_score?: boolean;
  generation_attempt?: number;
}

export interface SentEmail {
  id: string;
  lead_id: string;
  subject: string;
  body_html: string;
  body_text: string;
  template_used: string;
  gmail_message_id: string | null;
  gmail_thread_id: string | null;
  sent_at: string | null;
  status: EmailStatus;
  created_at: string;
}

export interface ReplyAnalysis {
  intent: ReplyIntent;
  confidence: number;
  summary: string;
  key_questions: string[];
  suggested_action: string;
  research_needed: boolean;
  research_topics: string[];
}

export interface Reply {
  id: string;
  email_id: string;
  lead_id: string;
  gmail_message_id: string;
  intent: ReplyIntent | null;
  intent_confidence: number | null;
  reply_body: string;
  ai_draft_response: string | null;
  ai_research_notes: Record<string, unknown> | null;
  human_approved: boolean;
  responded_at: string | null;
  created_at: string;
}

export interface ScrapedPage {
  url: string;
  title: string;
  emails: string[];
  pageContent: string;
}

export interface ValidatedEmail {
  address: string;
  source: string;
  mxValid: boolean;
}

export interface DailyStats {
  date: string;
  emails_sent: number;
  emails_opened: number;
  replies_received: number;
  positive_replies: number;
}
