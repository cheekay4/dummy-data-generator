import Anthropic from '@anthropic-ai/sdk';

let anthropicInstance: Anthropic | null = null;

/**
 * Claude APIクライアントを取得（シングルトンパターン）
 */
export function getClaudeClient(): Anthropic {
  if (anthropicInstance) {
    return anthropicInstance;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY が設定されていません。.env.local を確認してください。'
    );
  }

  anthropicInstance = new Anthropic({
    apiKey,
  });

  console.log('[Claude] APIクライアント初期化完了');
  return anthropicInstance;
}

/**
 * Claude APIでテキスト生成
 *
 * @param systemPrompt システムプロンプト（ペルソナ定義）
 * @param userPrompt ユーザープロンプト（記事生成指示）
 * @param model 使用するモデル（デフォルト: claude-sonnet-4）
 * @param maxTokens 最大トークン数（デフォルト: 4000）
 */
export async function generateWithClaude(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const client = getClaudeClient();

  const {
    systemPrompt,
    userPrompt,
    model = 'claude-sonnet-4-20250514',
    maxTokens = 4000,
  } = params;

  console.log(`[Claude] テキスト生成開始...`);
  console.log(`  モデル: ${model}`);
  console.log(`  最大トークン: ${maxTokens}`);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    if (response.content[0].type !== 'text') {
      throw new Error('Claude APIから予期しないレスポンス形式を受信しました');
    }

    const generatedText = response.content[0].text;

    console.log(`[Claude] テキスト生成完了（${generatedText.length}文字）`);

    return generatedText;

  } catch (error) {
    console.error('[Claude] テキスト生成エラー:', error);
    throw error;
  }
}

/**
 * Claude APIでJSON形式のレスポンスを生成
 * タグ選定等、構造化されたデータを返す場合に使用
 */
export async function generateJSONWithClaude<T = any>(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  const rawResponse = await generateWithClaude(params);

  try {
    // JSON部分を抽出（マークダウンのコードブロックが含まれる場合に対応）
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                      rawResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('レスポンスからJSON形式のデータを抽出できませんでした');
    }

    const jsonString = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonString);

    return parsed as T;

  } catch (error) {
    console.error('[Claude] JSON解析エラー:', error);
    console.error('Raw response:', rawResponse);
    throw new Error(`JSON解析に失敗しました: ${error}`);
  }
}
