import { generateWithClaude } from './claude-client';
import { selectTagsForArticle } from './tag-selector';
import {
  BASE_PERSONA,
  generateArticlePrompt,
  type ArticleMode,
  getArticleModeConfig,
} from '../prompts/persona';
import type { ExtractedTopic } from '../analysis/topic-extractor';
import type { GeneratedArticleInsert } from '../storage/supabase';

// ============================================================
// ハルシネーション検証
// ============================================================

const KNOWN_MEDIA_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /(?:NYT|New York Times|ニューヨーク・タイムズ)/gi, name: 'New York Times' },
  { pattern: /(?:BBC)/gi, name: 'BBC' },
  { pattern: /(?:Reuters|ロイター)/gi, name: 'Reuters' },
  { pattern: /(?:CNN)/gi, name: 'CNN' },
  { pattern: /(?:Washington Post|ワシントン・ポスト)/gi, name: 'Washington Post' },
  { pattern: /(?:Financial Times|FT(?!\w))/gi, name: 'Financial Times' },
  { pattern: /(?:Wall Street Journal|WSJ)/gi, name: 'Wall Street Journal' },
  { pattern: /(?:Guardian|ガーディアン)/gi, name: 'The Guardian' },
  { pattern: /(?:NPR)/gi, name: 'NPR' },
  { pattern: /(?:ScienceAlert)/gi, name: 'ScienceAlert' },
  { pattern: /(?:Live Science)/gi, name: 'Live Science' },
  { pattern: /(?:Associated Press|AP通信)/gi, name: 'Associated Press' },
  { pattern: /(?:Bloomberg|ブルームバーグ)/gi, name: 'Bloomberg' },
  { pattern: /(?:朝日新聞)/gi, name: '朝日新聞' },
  { pattern: /(?:読売新聞)/gi, name: '読売新聞' },
  { pattern: /(?:毎日新聞)/gi, name: '毎日新聞' },
  { pattern: /(?:日経新聞|日本経済新聞)/gi, name: '日経新聞' },
  { pattern: /(?:NHK)/gi, name: 'NHK' },
  { pattern: /(?:産経新聞)/gi, name: '産経新聞' },
];

/**
 * 生成された記事が参照記事リストの範囲内かを検証
 */
function validateArticleContent(
  generatedContent: string,
  sourceArticles: Array<{ title: string; source_name: string | null }>
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const sourceNames = sourceArticles
    .map(a => a.source_name?.toLowerCase() || '')
    .filter(Boolean);

  // メディア名の検証: 「○○が報じた」「○○によると」等の文脈で使われている場合
  const reportingPatterns = [
    /(.{0,30})(?:が報じ|によると|は報道|の記事|が伝え|の報道|は伝え|が分析|の分析)/g,
  ];

  // 「報道がなかった」「確認できない」等の否定的文脈パターン
  const negativeContextPatterns = [
    /確認(?:されていない|できない|できなかった|できる限り)/,
    /報道は(?:なし|ない|なかった|存在しない|ゼロ|0本)/,
    /0本/,
    /報じていない/,
    /扱った記事は.*(?:ない|なし)/,
    /からは.*(?:ない|なし|ゼロ)/,
  ];

  for (const { pattern, name } of KNOWN_MEDIA_PATTERNS) {
    // Reset regex state
    pattern.lastIndex = 0;
    const mentions = [...generatedContent.matchAll(pattern)];

    if (mentions.length > 0) {
      const hasSource = sourceNames.some(s =>
        s.includes(name.toLowerCase()) || name.toLowerCase().includes(s)
      );

      if (!hasSource) {
        // Check if this media is mentioned in a reporting context (not just general knowledge)
        for (const rp of reportingPatterns) {
          rp.lastIndex = 0;
          for (const rm of generatedContent.matchAll(rp)) {
            const context = rm[1];
            pattern.lastIndex = 0;
            if (pattern.test(context)) {
              // Check if it's in a negative context (e.g., "did not report")
              const matchIndex = rm.index || 0;
              const surroundingText = generatedContent.substring(
                Math.max(0, matchIndex - 50),
                Math.min(generatedContent.length, matchIndex + 100)
              );
              const isNegativeContext = negativeContextPatterns.some(np => np.test(surroundingText));

              if (!isNegativeContext) {
                issues.push(
                  `メディア「${name}」の報道に言及していますが、参照記事リストにこのソースがありません`
                );
              }
              break;
            }
          }
        }
      }
    }
  }

  // メディア帰属の文脈での記事タイトル引用を検証
  // 「〜が『タイトル』と報じた」「〜は『タイトル』という記事で」等のパターンのみ検出
  const mediaAttributionPatterns = [
    // "NPRは「タイトル」と報じた" / "NPRの「タイトル」" 等
    /(?:が|は|の)[「『]([^」』]{10,})[」』](?:と報じ|という記事|と題し|で報道|と伝え)/g,
    // 「タイトル」（メディア名）
    /[「『]([^」』]{10,})[」』](?:\s*[\(（][^)）]*[\)）])/g,
  ];

  for (const pattern of mediaAttributionPatterns) {
    pattern.lastIndex = 0;
    for (const match of generatedContent.matchAll(pattern)) {
      const title = match[1];
      const exists = sourceArticles.some(a =>
        a.title.includes(title) || title.includes(a.title.substring(0, 20))
      );

      if (!exists) {
        issues.push(
          `記事タイトル引用「${title.substring(0, 40)}...」が参照記事リストに見つかりません`
        );
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export interface GeneratedArticle {
  title: string;
  content: string;
  tags: string[];
  topicName: string;
  gapScore: number;
  mode: ArticleMode;
}

/**
 * 単一トピックから記事を生成
 *
 * @param topic トピック情報
 * @param mode 記事モード（weekday/weekend）
 * @returns 生成された記事
 */
export async function generateArticleFromTopic(
  topic: ExtractedTopic,
  mode: ArticleMode = 'weekday'
): Promise<GeneratedArticle> {
  const modeConfig = getArticleModeConfig(mode);
  const modeLabel = mode === 'weekend' ? '週末特集' : '平日';

  console.log(`\n=== 記事生成開始: ${topic.name}（${modeLabel}モード / ${modeConfig.totalChars}文字） ===`);

  // Step 1: Claude APIで記事本文を生成
  const articlePrompt = generateArticlePrompt({
    topicName: topic.name,
    gapScore: topic.gapScore,
    japanSentiment: topic.japanSentiment,
    overseasSentiment: topic.overseasSentiment,
    articles: topic.articles.map(a => ({
      source_name: a.source_name,
      title: a.title,
      url: a.url,
      language: a.language,
    })),
    mode,
    modeConfig,
  });

  console.log('[Article Generator] Claude APIで記事本文を生成中...');

  const articleContent = await generateWithClaude({
    systemPrompt: BASE_PERSONA,
    userPrompt: articlePrompt,
    maxTokens: modeConfig.maxTokens,
  });

  // タイトルを抽出（最初の行または#で始まる行）
  const titleMatch = articleContent.match(/^#\s*(.+)$/m) ||
                     articleContent.match(/^【.+】.+$/m);
  const title = titleMatch ? titleMatch[1] || titleMatch[0] : `【解説】${topic.name}`;

  console.log(`[Article Generator] タイトル: ${title}`);
  console.log(`[Article Generator] 文字数: ${articleContent.length}文字（目標: ${modeConfig.totalChars}文字）`);

  // Step 1.5: ハルシネーション検証
  const validation = validateArticleContent(
    articleContent,
    topic.articles.map(a => ({ title: a.title, source_name: a.source_name }))
  );

  if (!validation.valid) {
    console.warn('[Validation] 記事に潜在的なハルシネーションを検出:');
    validation.issues.forEach(issue => console.warn(`  ⚠ ${issue}`));
    console.warn('[Validation] 検出された問題は記事の信頼性に影響する可能性があります');
  } else {
    console.log('[Validation] ✓ ハルシネーション検証パス');
  }

  // Step 2: タグを自動選定
  const tags = await selectTagsForArticle({
    articleTitle: title,
    articleContent,
    topicName: topic.name,
  });

  console.log(`=== 記事生成完了: ${topic.name} ===\n`);

  return {
    title,
    content: articleContent,
    tags,
    topicName: topic.name,
    gapScore: topic.gapScore,
    mode,
  };
}

/**
 * 複数トピックから記事を一括生成
 *
 * @param topics トピック配列
 * @param mode 記事モード（weekday/weekend）
 * @returns 生成された記事配列
 */
export async function generateMultipleArticles(
  topics: ExtractedTopic[],
  mode: ArticleMode = 'weekday'
): Promise<GeneratedArticle[]> {
  const modeLabel = mode === 'weekend' ? '週末特集' : '平日';
  console.log(`\n=== ${topics.length}本の記事を生成開始（${modeLabel}モード） ===\n`);

  const articles: GeneratedArticle[] = [];

  for (const topic of topics) {
    try {
      const article = await generateArticleFromTopic(topic, mode);
      articles.push(article);
    } catch (error) {
      console.error(`[Article Generator] 記事生成エラー (${topic.name}):`, error);
    }
  }

  console.log(`\n=== ${articles.length}本の記事生成完了 ===\n`);

  return articles;
}

/**
 * GeneratedArticleをSupabase用の型に変換
 */
export function convertToSupabaseArticle(
  article: GeneratedArticle,
  topicId: string
): GeneratedArticleInsert {
  return {
    topic_id: topicId,
    title: article.title,
    content: article.content,
    tags: article.tags,
    gap_score: article.gapScore,
    published_to_note: false,
  };
}
