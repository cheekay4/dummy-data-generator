import Parser from 'rss-parser';
import type { NewsArticle, RSSFeedConfig } from './types';

/**
 * RSSフィード設定（日本語・英語の主要ニュースソース）
 */
export const RSS_FEEDS: RSSFeedConfig[] = [
  // 日本語ソース
  {
    url: 'https://www.nhk.or.jp/rss/news/cat0.xml',
    name: 'NHK',
    language: 'ja',
    category: 'general',
  },
  // 注: 日経新聞のRSSは有料会員向けのため、無料で取得できるフィードが限られる
  // 代替として、Yahoo!ニュースやITmedia等を検討

  // 英語ソース
  {
    url: 'https://feeds.reuters.com/reuters/businessNews',
    name: 'Reuters',
    language: 'en',
    category: 'business',
  },
  {
    url: 'https://feeds.reuters.com/reuters/technologyNews',
    name: 'Reuters',
    language: 'en',
    category: 'technology',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    name: 'BBC',
    language: 'en',
    category: 'business',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    name: 'BBC',
    language: 'en',
    category: 'technology',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    name: 'NYT',
    language: 'en',
    category: 'business',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    name: 'NYT',
    language: 'en',
    category: 'technology',
  },
];

/**
 * 単一のRSSフィードから記事を取得
 */
export async function fetchFromRSSFeed(config: RSSFeedConfig): Promise<NewsArticle[]> {
  const parser = new Parser({
    timeout: 10000, // 10秒タイムアウト
    headers: {
      'User-Agent': 'NewsContextBot/1.0',
    },
  });

  console.log(`[RSS] ${config.name} (${config.language}) から取得中...`);

  try {
    const feed = await parser.parseURL(config.url);

    const articles: NewsArticle[] = feed.items
      .filter(item => item.link && item.title) // 必須フィールドチェック
      .map(item => ({
        title: item.title || '',
        description: item.contentSnippet || item.content || item.summary || null,
        url: item.link || '',
        source: 'rss' as const,
        source_name: config.name,
        language: config.language,
        published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
        category: config.category || null,
        keywords: extractKeywordsFromRSS(item.title + ' ' + (item.contentSnippet || '')),
      }))
      .filter(article => {
        // 過去24時間以内の記事のみ
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return article.published_at >= oneDayAgo;
      });

    console.log(`[RSS] ${config.name}: ${articles.length}件の記事を取得`);
    return articles;

  } catch (error) {
    console.error(`[RSS] エラー (${config.name}):`, error);
    return []; // エラー時は空配列を返す（処理継続）
  }
}

/**
 * 全RSSフィードから並行取得
 */
export async function fetchAllRSSFeeds(feeds: RSSFeedConfig[] = RSS_FEEDS): Promise<NewsArticle[]> {
  console.log(`[RSS] ${feeds.length}個のフィードから取得開始...`);

  const results = await Promise.allSettled(
    feeds.map(feed => fetchFromRSSFeed(feed))
  );

  const allArticles: NewsArticle[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      errors.push(`${feeds[index].name}: ${result.reason}`);
    }
  });

  if (errors.length > 0) {
    console.warn(`[RSS] ${errors.length}件のフィードでエラー:`, errors);
  }

  console.log(`[RSS] 合計 ${allArticles.length}件の記事を取得`);
  return allArticles;
}

/**
 * 簡易的なキーワード抽出（RSS用）
 */
function extractKeywordsFromRSS(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were',
    'の', 'は', 'が', 'を', 'に', 'で', 'と', 'も', 'から',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * ニュース収集のメイン関数（NewsAPI + RSS）
 */
export async function collectAllNews(newsApiKey?: string): Promise<NewsArticle[]> {
  const allArticles: NewsArticle[] = [];

  // RSS取得（並行実行）
  const rssArticles = await fetchAllRSSFeeds();
  allArticles.push(...rssArticles);

  // NewsAPI取得（APIキーがある場合のみ）
  if (newsApiKey) {
    try {
      const { fetchNewsFromBothLanguages } = await import('./newsapi');
      const newsApiArticles = await fetchNewsFromBothLanguages(newsApiKey);
      allArticles.push(...newsApiArticles);
    } catch (error) {
      console.error('[NewsAPI] 取得失敗:', error);
    }
  }

  // 重複除去（URLベース）
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.url, article])).values()
  );

  console.log(`[収集完了] 合計 ${uniqueArticles.length}件のユニーク記事を取得`);
  return uniqueArticles;
}
