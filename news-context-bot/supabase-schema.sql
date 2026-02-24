-- ============================================
-- ニュース自動解説システム - Supabaseスキーマ
-- ============================================

-- 収集したニュース記事
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,        -- 'newsapi' | 'rss'
  source_name TEXT,             -- 'Reuters' | 'BBC' | 'NHK' 等
  language TEXT NOT NULL,       -- 'ja' | 'en'
  published_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  category TEXT,                -- 'business' | 'technology' | 'politics'
  keywords TEXT[]               -- 抽出されたキーワード
);

-- トピック（クラスタリング結果）
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,           -- 'AI規制'、'円安' 等
  gap_score FLOAT NOT NULL,     -- 温度差スコア（0-1）
  japan_sentiment TEXT,         -- 国内論調の要約
  overseas_sentiment TEXT,      -- 海外論調の要約
  article_ids UUID[],           -- 関連記事のID配列
  created_at TIMESTAMP DEFAULT NOW()
);

-- 生成した記事
CREATE TABLE IF NOT EXISTS generated_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,        -- Markdown本文
  tags TEXT[],                  -- noteタグ（自動選定）
  gap_score FLOAT,
  published_to_note BOOLEAN DEFAULT FALSE,
  note_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_gap ON topics(gap_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created ON generated_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_language ON news_articles(language);
CREATE INDEX IF NOT EXISTS idx_news_source ON news_articles(source);

-- コメント
COMMENT ON TABLE news_articles IS '収集した生のニュース記事データ';
COMMENT ON TABLE topics IS 'クラスタリングされたトピックと温度差スコア';
COMMENT ON TABLE generated_articles IS 'Claude APIで生成されたnote用記事';

COMMENT ON COLUMN topics.gap_score IS '国内外の論調の差（0-1、高いほど温度差が大きい）';
COMMENT ON COLUMN generated_articles.published_to_note IS 'noteへの投稿済みフラグ（Phase 2で使用）';
