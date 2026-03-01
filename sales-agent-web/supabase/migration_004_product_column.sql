-- migration_004: sales_leads に product カラム追加
-- プロダクト分離（MsgScore / review-reply-ai）

ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS product TEXT NOT NULL DEFAULT 'review-reply-ai';

-- CHECK制約（2プロダクトのみ許可）
ALTER TABLE sales_leads DROP CONSTRAINT IF EXISTS sales_leads_product_check;
ALTER TABLE sales_leads ADD CONSTRAINT sales_leads_product_check
  CHECK (product IN ('msgscore', 'review-reply-ai'));

-- フィルタ用インデックス
CREATE INDEX IF NOT EXISTS idx_leads_product ON sales_leads(product);
