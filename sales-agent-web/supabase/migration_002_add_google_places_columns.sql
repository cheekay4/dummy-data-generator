-- Google Places API 連携用カラム追加
-- sales_leads テーブルにリード情報の拡張フィールドを追加

ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1);
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_review_count INTEGER;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
