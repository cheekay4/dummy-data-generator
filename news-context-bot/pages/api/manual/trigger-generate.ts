import type { NextApiRequest, NextApiResponse } from 'next';
import { collectAllNews } from '../../../lib/news-sources/rss-feeds';
import { saveNewsArticles, saveTopics, saveGeneratedArticles } from '../../../lib/storage/supabase';
import { extractTopicsFromArticles, selectTopicsForGeneration, convertToSupabaseTopic } from '../../../lib/analysis/topic-extractor';
import { generateMultipleArticles, convertToSupabaseArticle } from '../../../lib/generation/article-generator';
import { saveArticlesToMarkdown, ensureOutputDirectory } from '../../../lib/storage/github-backup';
import { detectArticleMode, type ArticleMode } from '../../../lib/prompts/persona';

interface ApiResponse {
  success: boolean;
  articles?: Array<{
    title: string;
    topic: string;
    gapScore: number;
    tags: string[];
  }>;
  stats?: {
    newsCollected: number;
    topicsExtracted: number;
    articlesGenerated: number;
  };
  error?: string;
}

/**
 * 手動実行用APIエンドポイント
 *
 * アクセス方法:
 * http://localhost:3000/api/manual/trigger-generate
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // モード判定（クエリパラメータで上書き可能、デフォルトは曜日自動判定）
  const modeParam = req.query.mode as string | undefined;
  const mode: ArticleMode = (modeParam === 'weekday' || modeParam === 'weekend')
    ? modeParam
    : detectArticleMode();
  const modeLabel = mode === 'weekend' ? '週末特集' : '平日';

  console.log('\n\n========================================');
  console.log(`記事自動生成プロセス開始（${modeLabel}モード）`);
  console.log('========================================\n');

  const startTime = Date.now();

  try {
    // Step 1: ニュース収集
    console.log('\n【Step 1】ニュース収集開始...');
    const newsApiKey = process.env.NEWSAPI_KEY; // オプション
    const newsArticles = await collectAllNews(newsApiKey);

    if (newsArticles.length === 0) {
      throw new Error('ニュース記事を取得できませんでした');
    }

    // Supabaseに保存
    const savedNewsArticles = await saveNewsArticles(
      newsArticles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source,
        source_name: article.source_name,
        language: article.language,
        published_at: article.published_at.toISOString(),
        category: article.category,
        keywords: article.keywords,
      }))
    );

    console.log(`✓ Step 1 完了: ${savedNewsArticles?.length || newsArticles.length}件の記事を保存`);

    // Step 2: トピック抽出
    console.log('\n【Step 2】トピック抽出開始...');
    const allTopics = await extractTopicsFromArticles(newsArticles);

    console.log(`✓ Step 2 完了: ${allTopics.length}個のトピックを抽出`);

    // 記事生成用トピック2つを選定
    const [topic1, topic2] = selectTopicsForGeneration(allTopics);

    if (!topic1) {
      throw new Error('記事生成に適したトピックが見つかりませんでした（記事数: ' + newsArticles.length + '件）');
    }

    const selectedTopics = [topic1, topic2].filter(Boolean) as any[];

    console.log(`✓ Step 2 完了: ${selectedTopics.length}個のトピックを選定`);

    // Step 3: 記事生成（モードに応じた文字数・構成で生成）
    console.log(`\n【Step 3】記事生成開始...（${modeLabel}モード）`);
    const generatedArticles = await generateMultipleArticles(selectedTopics, mode);

    if (generatedArticles.length === 0) {
      throw new Error('記事を生成できませんでした');
    }

    console.log(`✓ Step 3 完了: ${generatedArticles.length}本の記事を生成`);

    // Step 4: Supabaseに保存
    console.log('\n【Step 4】データベースに保存中...');

    // トピックを保存
    const savedTopics = await saveTopics(
      selectedTopics.map((topic, index) => {
        // 関連記事のIDを取得
        const articleUrls = topic.articles.map((a: any) => a.url);
        const relatedArticleIds = savedNewsArticles
          ?.filter((saved: any) => articleUrls.includes(saved.url))
          .map((saved: any) => saved.id) || [];

        return convertToSupabaseTopic(topic, relatedArticleIds);
      })
    );

    // 生成記事を保存
    const savedGeneratedArticles = await saveGeneratedArticles(
      generatedArticles.map((article, index) => {
        const topicId = savedTopics[index]?.id || null;
        return convertToSupabaseArticle(article, topicId!);
      })
    );

    console.log(`✓ Step 4 完了: データベース保存完了`);

    // Step 5: Markdownファイルに保存
    console.log('\n【Step 5】Markdownファイル出力中...');

    await ensureOutputDirectory();

    const markdownFiles = await saveArticlesToMarkdown(
      generatedArticles.map(article => ({
        title: article.title,
        content: article.content,
        tags: article.tags,
        gap_score: article.gapScore,
        created_at: new Date(),
        topic_name: article.topicName,
      }))
    );

    console.log(`✓ Step 5 完了: ${markdownFiles.length}件のMarkdownファイルを保存`);

    // 完了
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n========================================');
    console.log(`記事自動生成プロセス完了（${duration}秒）`);
    console.log('========================================\n');

    // レスポンスを返す
    res.status(200).json({
      success: true,
      articles: generatedArticles.map(article => ({
        title: article.title,
        topic: article.topicName,
        gapScore: article.gapScore,
        tags: article.tags,
      })),
      stats: {
        newsCollected: newsArticles.length,
        topicsExtracted: allTopics.length,
        articlesGenerated: generatedArticles.length,
      },
    });

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
