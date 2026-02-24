import NewsAPI from 'newsapi';
import type { NewsArticle, NewsAPIConfig } from './types';

/**
 * NewsAPI経由でニュースを取得（top-headlines API使用）
 * 無料プランの制限: 100リクエスト/日
 */
export async function fetchFromNewsAPI(config: NewsAPIConfig): Promise<NewsArticle[]> {
  const newsapi = new NewsAPI(config.apiKey);
  const pageSize = config.pageSize || 20;

  console.log(`[NewsAPI Debug] APIキー: ${config.apiKey?.substring(0, 5)}...`);
  console.log(`[NewsAPI Debug] カテゴリ: ${config.category || 'general'}`);
  console.log(`[NewsAPI Debug] pageSize: ${pageSize}`);

  try {
    const response = await newsapi.v2.topHeadlines({
      country: 'us',
      category: config.category || 'general',
      pageSize: pageSize,
    });

    console.log(`[NewsAPI Debug] レスポンスステータス: ${response.status}`);
    console.log(`[NewsAPI Debug] 記事数: ${response.totalResults}`);
    console.log(`[NewsAPI Debug] 最初の記事タイトル: ${response.articles?.[0]?.title}`);

    if (response.status === 'error') {
      console.error(`[NewsAPI Debug] エラー: ${(response as any).code} ${(response as any).message}`);
      throw new Error(`NewsAPI エラー: ${(response as any).code} - ${(response as any).message}`);
    }

    if (response.status !== 'ok') {
      throw new Error(`NewsAPI エラー: ${response.status}`);
    }

    const articles: NewsArticle[] = response.articles
      .filter((article: any) => article.url && article.title && article.title !== '[Removed]')
      .map((article: any) => ({
        title: article.title,
        description: article.description || article.content || null,
        url: article.url,
        source: 'newsapi' as const,
        source_name: article.source?.name || null,
        language: 'en' as const,
        published_at: new Date(article.publishedAt),
        category: config.category || null,
        keywords: extractKeywords(article.title + ' ' + (article.description || '')),
      }));

    console.log(`[NewsAPI] ${articles.length}件の記事を取得しました（${config.category}）`);
    return articles;

  } catch (error) {
    console.error(`[NewsAPI] エラー (${config.category}):`, error instanceof Error ? error.message : error);
    console.error(`[NewsAPI] エラー詳細:`, error);
    return [];
  }
}

/**
 * 英語ニュースをカテゴリ別に取得（日本語は無料プラン非対応のため除外）
 */
export async function fetchNewsFromBothLanguages(apiKey: string): Promise<NewsArticle[]> {
  const categories = ['business', 'technology', 'science'];

  const allArticles: NewsArticle[] = [];
  const errors: Array<{ source: string; error: string }> = [];

  // 英語ニュース取得（top-headlines API）
  for (const category of categories) {
    try {
      const articles = await fetchFromNewsAPI({
        apiKey,
        language: 'en',
        query: '',
        category,
      });
      allArticles.push(...articles);
    } catch (error) {
      errors.push({
        source: `NewsAPI-en-${category}`,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (errors.length > 0) {
    console.warn(`[NewsAPI] ${errors.length}件のエラーが発生しました:`, errors);
  }

  console.log(`[NewsAPI] 合計 ${allArticles.length}件の記事を取得`);
  return allArticles;
}

/**
 * 簡易的なキーワード抽出（頻出単語を抽出）
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'の', 'は', 'が', 'を', 'に', 'で', 'と', 'も', 'から', 'まで', 'より',
    'へ', 'や', 'か', 'など', 'こと', 'もの', 'ため', 'する', 'ある', 'なる',
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
