import type { NewsArticle } from '../news-sources/types';
import type { TopicInsert } from '../storage/supabase';
import {
  clusterArticlesByKeywords,
  refineTopicNames,
  extractSignificantTopics,
} from './clustering';
import {
  calculateGapScores,
  selectTopicsForArticles,
  summarizeSentiments,
  type TopicWithGapScore,
} from './gap-calculator';

export interface ExtractedTopic {
  name: string;
  gapScore: number;
  japanSentiment: string;
  overseasSentiment: string;
  articleIds: string[]; // Supabaseに保存されたarticleのID
  articles: NewsArticle[]; // 記事生成時に使用
}

/**
 * ニュース記事からトピックを抽出し、温度差スコアを計算
 *
 * @param articles 収集したニュース記事
 * @returns 抽出されたトピック配列（温度差スコア順）
 */
export async function extractTopicsFromArticles(
  articles: NewsArticle[]
): Promise<TopicWithGapScore[]> {
  console.log(`\n=== トピック抽出開始 ===`);
  console.log(`対象記事数: ${articles.length}件`);

  const japaneseCount = articles.filter(a => a.language === 'ja').length;
  const englishCount = articles.filter(a => a.language === 'en').length;
  console.log(`  日本語: ${japaneseCount}件`);
  console.log(`  英語: ${englishCount}件`);

  // Step 1: キーワードベースでクラスタリング
  const clusters = clusterArticlesByKeywords(articles);

  // Step 2: トピック名を洗練
  const refinedClusters = refineTopicNames(clusters);

  // Step 3: 有意なトピックのみ抽出（記事数に応じて動的に調整）
  const minArticles = articles.length > 100 ? 5 : articles.length > 50 ? 3 : 2;
  const significantClusters = extractSignificantTopics(refinedClusters, minArticles);

  // フォールバック処理: トピックが見つからない場合
  if (significantClusters.length === 0) {
    console.warn('[Topic Extractor] ⚠️ キーワードベースのトピックが見つかりませんでした');
    console.log('[Topic Extractor] フォールバック: 全記事を1つのトピックとしてまとめます');

    // 全記事を1つのトピックとして作成
    const fallbackCluster = {
      name: '最新ニュース',
      keywords: ['news'],
      articles: articles,
      japaneseArticles: articles.filter(a => a.language === 'ja'),
      englishArticles: articles.filter(a => a.language === 'en'),
    };

    const topicsWithScores = calculateGapScores([fallbackCluster]);

    console.log(`=== トピック抽出完了（フォールバック） ===`);
    console.log(`抽出されたトピック数: ${topicsWithScores.length}件\n`);

    return topicsWithScores;
  }

  // Step 4: 温度差スコアを計算
  const topicsWithScores = calculateGapScores(significantClusters);

  console.log(`=== トピック抽出完了 ===`);
  console.log(`抽出されたトピック数: ${topicsWithScores.length}件`);

  // トピック詳細を表示
  topicsWithScores.slice(0, 5).forEach((topic, i) => {
    console.log(`\nトピック${i + 1}: ${topic.name}`);
    console.log(`  温度差スコア: ${topic.gapScore.toFixed(2)}`);
    console.log(`  記事数: ${topic.totalCount}件（日本: ${topic.japanCount}件、海外: ${topic.overseasCount}件）`);
  });
  console.log('');

  return topicsWithScores;
}

/**
 * 記事生成用のトピック2つを選定
 */
export function selectTopicsForGeneration(
  topicsWithScores: TopicWithGapScore[]
): [ExtractedTopic | null, ExtractedTopic | null] {
  const [firstTopic, secondTopic] = selectTopicsForArticles(topicsWithScores);

  const convertToExtractedTopic = (topic: TopicWithGapScore | null): ExtractedTopic | null => {
    if (!topic) return null;

    const { japanSentiment, overseasSentiment } = summarizeSentiments(topic);

    return {
      name: topic.name,
      gapScore: topic.gapScore,
      japanSentiment,
      overseasSentiment,
      articleIds: [], // Supabase保存後に設定
      articles: topic.articles,
    };
  };

  return [
    convertToExtractedTopic(firstTopic),
    convertToExtractedTopic(secondTopic),
  ];
}

/**
 * ExtractedTopicをSupabase用の型に変換
 */
export function convertToSupabaseTopic(
  topic: ExtractedTopic,
  articleIds: string[]
): TopicInsert {
  return {
    name: topic.name,
    gap_score: topic.gapScore,
    japan_sentiment: topic.japanSentiment,
    overseas_sentiment: topic.overseasSentiment,
    article_ids: articleIds,
  };
}
