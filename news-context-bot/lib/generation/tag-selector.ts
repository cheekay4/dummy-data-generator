import { generateJSONWithClaude } from './claude-client';
import { generateTagSelectionPrompt } from '../prompts/persona';

export interface TagSelectionResult {
  tags: string[];
}

/**
 * 記事に適したnoteタグを自動選定
 *
 * @param articleTitle 記事タイトル
 * @param articleContent 記事本文
 * @param topicName トピック名
 * @returns 選定されたタグ配列（5つ）
 */
export async function selectTagsForArticle(params: {
  articleTitle: string;
  articleContent: string;
  topicName: string;
}): Promise<string[]> {
  console.log(`[Tag Selector] タグ選定中... (トピック: ${params.topicName})`);

  const prompt = generateTagSelectionPrompt(params);

  try {
    const result = await generateJSONWithClaude<TagSelectionResult>({
      systemPrompt: 'あなたはnote記事のタグ選定を行う専門家です。適切なタグを選定してください。',
      userPrompt: prompt,
      maxTokens: 500,
    });

    if (!result.tags || !Array.isArray(result.tags)) {
      throw new Error('タグ選定結果が不正です');
    }

    // 5つに調整
    const selectedTags = result.tags.slice(0, 5);

    console.log(`[Tag Selector] タグ選定完了: ${selectedTags.join(', ')}`);

    return selectedTags;

  } catch (error) {
    console.error('[Tag Selector] タグ選定エラー:', error);

    // フォールバック: 固定タグを返す
    const fallbackTags = [
      'ニュース解説',
      '海外の反応',
      params.topicName,
      'ビジネス',
      'テクノロジー',
    ];

    console.log(`[Tag Selector] フォールバックタグを使用: ${fallbackTags.join(', ')}`);
    return fallbackTags.slice(0, 5);
  }
}

/**
 * 複数の記事に対してタグを一括選定
 */
export async function selectTagsForMultipleArticles(
  articles: Array<{
    title: string;
    content: string;
    topicName: string;
  }>
): Promise<string[][]> {
  const results = await Promise.all(
    articles.map(article =>
      selectTagsForArticle({
        articleTitle: article.title,
        articleContent: article.content,
        topicName: article.topicName,
      })
    )
  );

  return results;
}
