-- Sales Agent 返信対応モジュール — 全フェーズ統合マイグレーション
-- 冪等性担保: IF NOT EXISTS / DROP CONSTRAINT IF EXISTS

-- ========================================
-- Phase 1: 配信コンプライアンス
-- ========================================
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS bounce_reason TEXT;
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ;
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS email_type TEXT DEFAULT 'initial';
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT FALSE;

ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ;

ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS ack_sent_at TIMESTAMPTZ;

-- intent CHECK 制約の拡張（soft_decline, internal_review 追加）
ALTER TABLE sales_replies DROP CONSTRAINT IF EXISTS sales_replies_intent_check;
ALTER TABLE sales_replies ADD CONSTRAINT sales_replies_intent_check
  CHECK (intent IN ('interested','not_interested','question','out_of_office','unsubscribe','soft_decline','internal_review'));

-- ========================================
-- Phase 4: フォローアップシーケンス
-- ========================================
CREATE TABLE IF NOT EXISTS sales_next_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES sales_leads(id),
  email_id UUID REFERENCES sales_emails(id),
  action_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_next_actions_scheduled ON sales_next_actions(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_next_actions_lead ON sales_next_actions(lead_id);

-- ========================================
-- Phase 5: ナレッジ管理
-- ========================================
CREATE TABLE IF NOT EXISTS sales_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  confidence NUMERIC(3,2) DEFAULT 1.0,
  usage_count INTEGER DEFAULT 0,
  product TEXT DEFAULT 'review-reply-ai',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Phase 6: 2段階返信
-- ========================================
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS reply_stage TEXT DEFAULT 'initial';
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS needs_research BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS escalation_reason TEXT;
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS knowledge_hits JSONB;
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS final_response_sent_at TIMESTAMPTZ;

-- ========================================
-- Phase 7: マルチターン会話 + フェーズ判定
-- ========================================
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS conversation_phase TEXT DEFAULT 'initial';
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS phase_changed_at TIMESTAMPTZ;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS total_exchanges INTEGER DEFAULT 0;
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS conversation_history JSONB;

-- ========================================
-- Phase 8: VoC 収集
-- ========================================
CREATE TABLE IF NOT EXISTS sales_voc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID REFERENCES sales_replies(id),
  lead_id UUID NOT NULL REFERENCES sales_leads(id),
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  raw_quote TEXT,
  sentiment TEXT,
  cluster_id TEXT,
  product TEXT DEFAULT 'review-reply-ai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_voc_category ON sales_voc(category);
CREATE INDEX IF NOT EXISTS idx_voc_lead ON sales_voc(lead_id);
