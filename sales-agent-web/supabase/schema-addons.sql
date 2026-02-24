-- ============================================================
-- sales-agent-web Add-A / Add-B / Add-C スキーマ拡張
-- Supabase Dashboard > SQL Editor で実行してください
-- ============================================================

-- Add-A: ターゲット自動探索
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS estimated_scale TEXT;        -- 'individual'|'small'|'medium'|'large'
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS discovery_method TEXT DEFAULT 'manual'; -- 'auto_discover'|'url_scrape'|'similar'|'manual'
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS source_query TEXT;            -- 探索時の検索条件（再現用）

-- Add-B: ABテスト + MsgScore セルフスコアリング
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS variant TEXT;               -- 'A' | 'B'
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS msgscore INTEGER;           -- 0-100
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS msgscore_detail JSONB;      -- スコア内訳
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS low_score BOOLEAN DEFAULT FALSE;
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS generation_attempt INTEGER DEFAULT 1;

-- Add-C: ドライラン（テスト送信）
ALTER TABLE sales_emails ADD COLUMN IF NOT EXISTS test_sent_at TIMESTAMPTZ;

-- 返信 AI ドラフト件名
ALTER TABLE sales_replies ADD COLUMN IF NOT EXISTS ai_draft_subject TEXT;
