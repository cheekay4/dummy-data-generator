/**
 * ニュース収集に関する型定義
 */

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  source: 'newsapi' | 'rss';
  source_name: string | null;
  language: 'ja' | 'en';
  published_at: Date;
  category?: string | null;
  keywords?: string[] | null;
}

export interface RSSFeedConfig {
  url: string;
  name: string;
  language: 'ja' | 'en';
  category?: string;
}

export interface NewsAPIConfig {
  apiKey: string;
  language: 'ja' | 'en';
  query: string;
  category?: string;
  from?: Date;
  pageSize?: number;
}

export interface NewsCollectionResult {
  articles: NewsArticle[];
  sources: string[];
  totalCount: number;
  errors: Array<{ source: string; error: string }>;
}
