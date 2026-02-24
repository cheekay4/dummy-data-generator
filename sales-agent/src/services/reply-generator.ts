import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL } from '../config/constants.js';
import type { Lead, ReplyAnalysis } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

/**
 * 返信メールのドラフトを生成する
 */
export async function generateReplyDraft(
  lead: Lead,
  analysis: ReplyAnalysis,
  researchNotes: Record<string, string>,
  originalReplyBody: string,
): Promise<string> {
  const researchText =
    Object.entries(researchNotes)
      .map(([topic, answer]) => `【${topic}】\n${answer}`)
      .join('\n\n') || '（リサーチ不要）';

  const prompt = `あなたはRiku（個人開発者）の代わりに、営業メールへの返信を書いてください。

## Rikuの人物像
- 20代後半の個人開発者
- 丁寧だが堅苦しくない（ですます調）
- 「良いものを作ったので使ってほしい」というスタンス
- 売り込みは控えめ

## 返信先
会社名: ${lead.company_name}
業態: ${lead.industry_detail.business_type}

## 相手の返信内容
${originalReplyBody.slice(0, 1000)}

## 返信の意図分析
意図: ${analysis.intent}
要約: ${analysis.summary}
${analysis.key_questions.length > 0 ? `質問: ${analysis.key_questions.join('、')}` : ''}

## リサーチ結果（回答に使える情報）
${researchText}

## 返信メール要件
${
    analysis.intent === 'interested'
      ? '- 興味を持ってもらえたことへの感謝\n- 次のステップへの誘導（無料トライアル or 詳細説明）\n- 低ハードルなCTA'
      : analysis.intent === 'question'
        ? '- 質問への丁寧な回答\n- 不明点があれば「お気軽にご質問ください」\n- 追加で試してみる提案'
        : analysis.intent === 'not_interested'
          ? '- 感謝の言葉\n- 「また機会があれば」の一言\n- 配信停止の案内（押し付けがましくなく）'
          : '- シンプルな返信（返信不要の場合は空文字を返す）'
  }

## 禁止事項
- 「突然のご連絡失礼いたします」
- 「お忙しいところ恐れ入りますが」
- 3段落を超える長文
- URLを2つ以上含める

## 出力
返信メール本文のみ（件名・署名なし）。${analysis.intent === 'out_of_office' ? '不在自動返信の場合は空文字を返してください。' : ''}`;

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';
}
