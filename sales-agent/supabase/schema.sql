-- リードテーブル
CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  website_url TEXT,
  industry TEXT,                    -- 'ec_retail' | 'restaurant' | 'gym' | 'saas' | 'other'
  industry_detail JSONB,            -- Claude分析結果（業態詳細、ペインポイント等）
  source_url TEXT,                  -- 抽出元ページURL
  status TEXT DEFAULT 'new',        -- 'new' | 'analyzed' | 'draft_ready' | 'approved' | 'sent' | 'replied' | 'declined' | 'unsubscribed'
  icp_score INTEGER,                -- 0-100: ICP適合スコア
  personalization_hooks JSONB,      -- パーソナライズに使う要素（店名言及、特徴等）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 送信済みメールテーブル
CREATE TABLE IF NOT EXISTS sales_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES sales_leads(id),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  template_used TEXT,               -- 使用テンプレートID
  gmail_message_id TEXT,            -- Gmail API返却ID
  gmail_thread_id TEXT,             -- スレッドID（返信追跡用）
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,           -- 将来: トラッキングピクセル対応時
  status TEXT DEFAULT 'draft',      -- 'draft' | 'approved' | 'sent' | 'bounced' | 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 返信テーブル
CREATE TABLE IF NOT EXISTS sales_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID REFERENCES sales_emails(id),
  lead_id UUID REFERENCES sales_leads(id),
  gmail_message_id TEXT,
  intent TEXT,                      -- 'interested' | 'not_interested' | 'question' | 'out_of_office' | 'unsubscribe'
  intent_confidence FLOAT,
  reply_body TEXT,
  ai_draft_response TEXT,           -- AI生成の返信ドラフト
  ai_research_notes JSONB,          -- リサーチ結果
  human_approved BOOLEAN DEFAULT FALSE,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 日次送信カウンター
CREATE TABLE IF NOT EXISTS sales_daily_stats (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  replies_received INTEGER DEFAULT 0,
  positive_replies INTEGER DEFAULT 0
);

-- ナレッジベース
CREATE TABLE IF NOT EXISTS sales_knowledge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,           -- 'faq' | 'competitor' | 'roadmap' | 'case_study'
  question TEXT,
  answer TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_leads_status ON sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_industry ON sales_leads(industry);
CREATE INDEX IF NOT EXISTS idx_emails_lead_id ON sales_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_emails_thread_id ON sales_emails(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_replies_lead_id ON sales_replies(lead_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON sales_knowledge(category);
