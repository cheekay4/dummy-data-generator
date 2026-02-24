import type { NewsArticle } from '../news-sources/types';

export interface TopicCluster {
  name: string;
  keywords: string[];
  articles: NewsArticle[];
  japaneseArticles: NewsArticle[];
  englishArticles: NewsArticle[];
}

/**
 * トピック候補から除外するストップワード
 */
const STOP_WORDS = new Set([
  // 基本的な英単語
  'new', 'not', 'off', 'just', 'some', 'you', 'your', 'its', 'his', 'her',
  'could', 'would', 'should', 'will', 'can', 'may', 'get', 'got', 'out',
  'about', 'after', 'how', 'what', 'when', 'where', 'why', 'who', 'which',
  'more', 'most', 'than', 'been', 'have', 'has', 'had', 'was', 'were', 'are',
  'being', 'the', 'and', 'for', 'with', 'into', 'from', 'that', 'this',
  'they', 'their', 'them', 'then', 'there', 'these', 'those', 'over', 'also',
  'all', 'but', 'one', 'two', 'first', 'last', 'make', 'made', 'like',
  'back', 'still', 'even', 'take', 'say', 'says', 'said', 'going', 'come',
  'came', 'know', 'here', 'now', 'way', 'well', 'much', 'many', 'very',
  'any', 'only', 'other', 'each', 'every', 'both', 'few', 'own', 'same',
  'long', 'high', 'big', 'old', 'year', 'years', 'day', 'days', 'time',
  'week', 'month', 'people', 'world', 'part', 'good', 'right', 'left',
  'light', 'life', 'work', 'home', 'need', 'help', 'keep', 'let', 'end',
  'set', 'put', 'run', 'show', 'try', 'ask', 'use', 'used', 'using',
  'look', 'want', 'give', 'tell', 'call', 'think', 'see', 'seen',
  'before', 'between', 'under', 'while', 'since', 'against', 'through',
  'during', 'without', 'within', 'along', 'around', 'another', 'because',
  'really', 'still', 'already', 'never', 'always', 'often', 'might',
  'must', 'does', 'did', 'doing', 'done', 'going', 'been', 'being',
  'news', 'report', 'reports', 'reported', 'according', 'update', 'latest',
  'top', 'best', 'worst', 'per', 'via', 'near', 'next', 'down',
  // 日本語の一般的な助詞・助動詞・一般語
  'の', 'に', 'を', 'は', 'が', 'で', 'と', 'から', 'まで', 'や', 'も',
  'こと', 'もの', 'ため', 'する', 'ある', 'なる', 'いる', 'れる', 'できる',
  'その', 'この', 'それ', 'これ', 'あの', 'どの', 'ない', 'よう', 'など',
]);

/**
 * キーワードがストップワードか判定
 */
function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.toLowerCase());
}

/**
 * 固有名詞らしさを判定（大文字始まりの単語はスコアが高い）
 */
function isLikelyProperNoun(word: string): boolean {
  if (word.length < 2) return false;
  // 全大文字（AI, EU, US等）または先頭大文字
  return word === word.toUpperCase() || /^[A-Z][a-z]/.test(word);
}

/**
 * 記事タイトルからバイグラム（2単語ペア）を抽出
 */
function extractBigrams(articles: NewsArticle[]): Map<string, number> {
  const bigramCount = new Map<string, number>();

  articles.forEach(article => {
    const words = article.title
      .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !isStopWord(w));

    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigramCount.set(bigram, (bigramCount.get(bigram) || 0) + 1);
    }
  });

  return bigramCount;
}

/**
 * 記事をキーワードベースでクラスタリング
 * ストップワード除外 + 固有名詞優先 + バイグラム対応
 */
export function clusterArticlesByKeywords(articles: NewsArticle[]): TopicCluster[] {
  console.log(`[Clustering] ${articles.length}件の記事をクラスタリング中...`);

  // 全記事からキーワードを抽出し、頻出度を計算
  const keywordFrequency = new Map<string, number>();
  const keywordArticleMap = new Map<string, Set<NewsArticle>>();
  const excludedWords: string[] = [];

  articles.forEach(article => {
    const keywords = article.keywords || [];
    keywords.forEach(keyword => {
      // ストップワード除外
      if (isStopWord(keyword)) {
        excludedWords.push(keyword);
        return;
      }
      // 短すぎる単語を除外（2文字以下の英単語）
      if (/^[a-zA-Z]{1,2}$/.test(keyword)) {
        excludedWords.push(keyword);
        return;
      }

      keywordFrequency.set(keyword, (keywordFrequency.get(keyword) || 0) + 1);

      if (!keywordArticleMap.has(keyword)) {
        keywordArticleMap.set(keyword, new Set());
      }
      keywordArticleMap.get(keyword)!.add(article);
    });
  });

  // バイグラム抽出（複数単語トピック用）
  const bigramFrequency = extractBigrams(articles);
  const significantBigrams = Array.from(bigramFrequency.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  // ストップフレーズ（バイグラムとして無意味なもの）
  const stopPhrases = new Set([
    'up to', 'out of', 'as well', 'so far', 'at least', 'no longer',
    'such as', 'due to', 'in order', 'each other', 'even though',
    'go to', 'come back', 'look like', 'turn out', 'find out',
  ]);

  // バイグラムの記事マッピング
  significantBigrams.forEach(([bigram, count]) => {
    const bigramLower = bigram.toLowerCase();
    // ストップフレーズを除外
    if (stopPhrases.has(bigramLower)) return;
    // 両方ストップワードのバイグラムを除外
    const words = bigramLower.split(' ');
    if (words.every(w => isStopWord(w))) return;

    const matchingArticles = articles.filter(a =>
      a.title.toLowerCase().includes(bigramLower)
    );
    if (matchingArticles.length >= 2) {
      keywordFrequency.set(bigram, matchingArticles.length);
      keywordArticleMap.set(bigram, new Set(matchingArticles));
    }
  });

  // 除外されたストップワードをログ出力
  const uniqueExcluded = [...new Set(excludedWords)];
  if (uniqueExcluded.length > 0) {
    console.log(`[Clustering] 除外された単語: ${uniqueExcluded.slice(0, 15).join(', ')}`);
  }

  // 最低記事数を動的に調整
  const minArticles = articles.length > 100 ? 5 : articles.length > 50 ? 3 : 2;

  // 頻出キーワード抽出（動的しきい値）
  const significantKeywords = Array.from(keywordFrequency.entries())
    .filter(([_, count]) => count >= minArticles)
    .sort((a, b) => {
      // 固有名詞を優先（スコアにボーナス）
      const aBonus = isLikelyProperNoun(a[0]) || a[0].includes(' ') ? 2 : 0;
      const bBonus = isLikelyProperNoun(b[0]) || b[0].includes(' ') ? 2 : 0;
      return (b[1] + bBonus) - (a[1] + aBonus);
    })
    .map(([keyword]) => keyword);

  console.log(`[Clustering] ${significantKeywords.length}個の有意なキーワードを検出（最低${minArticles}記事）`);

  // デバッグ: キーワード頻度を表示
  if (significantKeywords.length > 0) {
    console.log('[Clustering] 検出されたキーワード:');
    significantKeywords.slice(0, 10).forEach(keyword => {
      const pn = isLikelyProperNoun(keyword) ? ' [固有名詞]' : '';
      const bg = keyword.includes(' ') ? ' [複合語]' : '';
      console.log(`  - ${keyword}: ${keywordFrequency.get(keyword)}回${pn}${bg}`);
    });
  } else {
    console.log('[Clustering] ⚠️ 有意なキーワードが見つかりませんでした');
    // フォールバック: しきい値を2に下げて再試行
    const fallbackKeywords = Array.from(keywordFrequency.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);

    console.log('[Clustering] フォールバック（2記事以上）:');
    fallbackKeywords.slice(0, 10).forEach(([keyword, count]) => {
      console.log(`  - ${keyword}: ${count}回`);
    });

    // フォールバックキーワードを使用
    if (fallbackKeywords.length > 0) {
      significantKeywords.push(...fallbackKeywords.map(([kw]) => kw));
    }
  }

  // キーワードごとにクラスタを作成
  const clusters: TopicCluster[] = significantKeywords.map(keyword => {
    const clusterArticles = Array.from(keywordArticleMap.get(keyword) || []);
    const japaneseArticles = clusterArticles.filter(a => a.language === 'ja');
    const englishArticles = clusterArticles.filter(a => a.language === 'en');

    return {
      name: keyword,
      keywords: [keyword],
      articles: clusterArticles,
      japaneseArticles,
      englishArticles,
    };
  });

  // 重複する記事が多いクラスタを統合（バイグラムに含まれる単語のクラスタ）
  const mergedClusters = deduplicateClusters(clusters);

  // 記事数でソート（多い順）
  mergedClusters.sort((a, b) => b.articles.length - a.articles.length);

  console.log(`[Clustering] ${mergedClusters.length}個のクラスタを生成`);
  console.log(`[Clustering] 最終的なトピック: ${mergedClusters.slice(0, 10).map(t => t.name).join(', ')}`);

  return mergedClusters;
}

/**
 * 重複度の高いクラスタを統合
 * バイグラムクラスタがある場合、その構成単語のクラスタを吸収
 */
function deduplicateClusters(clusters: TopicCluster[]): TopicCluster[] {
  const bigramClusters = clusters.filter(c => c.name.includes(' '));
  const singleClusters = clusters.filter(c => !c.name.includes(' '));

  // バイグラムに含まれる単語のクラスタを除外
  const absorbedWords = new Set<string>();
  bigramClusters.forEach(bc => {
    bc.name.split(' ').forEach(word => {
      absorbedWords.add(word.toLowerCase());
    });
  });

  const filteredSingle = singleClusters.filter(c => {
    // バイグラムに吸収された単語で、かつバイグラム側の記事数が同等以上なら除外
    if (absorbedWords.has(c.name.toLowerCase())) {
      const matchingBigram = bigramClusters.find(bc =>
        bc.name.toLowerCase().includes(c.name.toLowerCase()) &&
        bc.articles.length >= c.articles.length * 0.5
      );
      return !matchingBigram;
    }
    return true;
  });

  return [...bigramClusters, ...filteredSingle];
}

/**
 * トピック名を洗練（複数のキーワードを統合）
 */
export function refineTopicNames(clusters: TopicCluster[]): TopicCluster[] {
  return clusters.map(cluster => ({
    ...cluster,
    name: capitalizeTopicName(cluster.name),
  }));
}

/**
 * トピック名を大文字化・整形
 */
function capitalizeTopicName(name: string): string {
  // バイグラム（複数単語）の場合、各単語を整形
  if (name.includes(' ')) {
    return name.split(' ').map(w => capitalizeTopicName(w)).join(' ');
  }

  // 既に全大文字の場合はそのまま（例: AI, EU）
  if (name === name.toUpperCase() && name.length <= 4) {
    return name;
  }

  // 日本語の場合はそのまま
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(name)) {
    return name;
  }

  // 英語の場合は先頭を大文字化
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * クラスタから最も関連性の高いトピックを抽出
 * @param clusters クラスタ配列
 * @param minArticles 最低記事数（デフォルト: 3）
 * @returns フィルタされたトピック配列
 */
export function extractSignificantTopics(
  clusters: TopicCluster[],
  minArticles: number = 3
): TopicCluster[] {
  const filtered = clusters.filter(cluster => cluster.articles.length >= minArticles);

  console.log(`[Clustering] ${filtered.length}個の有意なトピックを抽出（最低${minArticles}記事）`);

  return filtered;
}
