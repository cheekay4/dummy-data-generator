import type { TopicCluster } from './clustering';

export interface TopicWithGapScore extends TopicCluster {
  gapScore: number;
  japanCount: number;
  overseasCount: number;
  totalCount: number;
}

/**
 * トピックごとの温度差スコアを計算
 *
 * 温度差スコア = |日本語記事数 - 英語記事数| / 総記事数
 *
 * - 0.0: 両国で同じくらい報道されている
 * - 1.0: 片方のみで報道されている（最大の温度差）
 */
export function calculateGapScores(clusters: TopicCluster[]): TopicWithGapScore[] {
  console.log(`[Gap Calculator] ${clusters.length}個のトピックの温度差スコアを計算中...`);

  const topicsWithScores: TopicWithGapScore[] = clusters.map(cluster => {
    const japanCount = cluster.japaneseArticles.length;
    const overseasCount = cluster.englishArticles.length;
    const totalCount = cluster.articles.length;

    // 温度差スコア計算
    const gapScore = totalCount > 0
      ? Math.abs(japanCount - overseasCount) / totalCount
      : 0;

    return {
      ...cluster,
      gapScore,
      japanCount,
      overseasCount,
      totalCount,
    };
  });

  // 温度差スコアでソート（高い順）
  topicsWithScores.sort((a, b) => b.gapScore - a.gapScore);

  console.log(`[Gap Calculator] 温度差スコア計算完了`);
  topicsWithScores.slice(0, 5).forEach(topic => {
    console.log(`  - ${topic.name}: ${topic.gapScore.toFixed(2)} (日本: ${topic.japanCount}, 海外: ${topic.overseasCount})`);
  });

  return topicsWithScores;
}

/**
 * 記事生成に適したトピックを2つ選定
 *
 * 1本目: 温度差スコアが最も高いトピック
 * 2本目: 温度差スコアが0.0以上のトピックからランダム選択
 *        （なければ、記事数が最も多いホットな話題）
 */
export function selectTopicsForArticles(
  topicsWithScores: TopicWithGapScore[]
): [TopicWithGapScore | null, TopicWithGapScore | null] {
  if (topicsWithScores.length === 0) {
    console.warn('[Gap Calculator] トピックが存在しません');
    return [null, null];
  }

  // 1本目: 温度差スコアが最も高いトピック
  const firstTopic = topicsWithScores[0];

  // 2本目の候補: gap_score >= 0.0 のトピック（1本目を除く、つまり全て）
  const highGapTopics = topicsWithScores
    .slice(1)
    .filter(topic => topic.gapScore >= 0.0);

  let secondTopic: TopicWithGapScore | null = null;

  if (highGapTopics.length > 0) {
    // 温度差が高いトピックからランダム選択
    const randomIndex = Math.floor(Math.random() * highGapTopics.length);
    secondTopic = highGapTopics[randomIndex];
    console.log(`[Gap Calculator] 2本目: 温度差トピックから選定 (${secondTopic.name})`);
  } else {
    // フォールバック: 記事数が最も多いホットな話題
    const hotTopics = topicsWithScores
      .slice(1)
      .sort((a, b) => b.totalCount - a.totalCount);

    if (hotTopics.length > 0) {
      secondTopic = hotTopics[0];
      console.log(`[Gap Calculator] 2本目: ホットな話題から選定 (${secondTopic.name})`);
    }
  }

  console.log(`[Gap Calculator] 記事生成対象トピック:`);
  console.log(`  1本目: ${firstTopic.name} (gap: ${firstTopic.gapScore.toFixed(2)})`);
  if (secondTopic) {
    console.log(`  2本目: ${secondTopic.name} (gap: ${secondTopic.gapScore.toFixed(2)})`);
  }

  return [firstTopic, secondTopic];
}

/**
 * トピックの論調を要約（簡易版）
 * 将来的には、Claude APIで各記事の論調を分析して要約
 */
export function summarizeSentiments(topic: TopicWithGapScore): {
  japanSentiment: string;
  overseasSentiment: string;
} {
  // 簡易版: 記事タイトルを列挙
  const japanTitles = topic.japaneseArticles
    .slice(0, 3)
    .map(a => `- ${a.title}`)
    .join('\n');

  const overseasTitles = topic.englishArticles
    .slice(0, 3)
    .map(a => `- ${a.title}`)
    .join('\n');

  return {
    japanSentiment: japanTitles || '（日本語の報道なし）',
    overseasSentiment: overseasTitles || '（海外の報道なし）',
  };
}
