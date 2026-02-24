import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL } from '../config/constants.js';
import type { Lead, ReplyAnalysis } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface ResearchResult {
  topics: Record<string, string>;
  summary: string;
}

/**
 * 返信の質問・懸念に対してナレッジベースをもとにリサーチし、回答素材を生成する
 */
export async function researchForReply(
  lead: Lead,
  analysis: ReplyAnalysis,
  knowledgeContext: string,
): Promise<ResearchResult> {
  if (!analysis.research_needed || analysis.research_topics.length === 0) {
    return { topics: {}, summary: '' };
  }

  const prompt = `あなたはMsgScoreのサポート担当アシスタントです。
営業先の${lead.company_name}（${lead.industry_detail.business_type}）から返信が来ました。

## 返信内容の要約
${analysis.summary}

## 返信への対応で調査が必要なトピック
${analysis.research_topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## MsgScoreに関するナレッジ
${knowledgeContext.slice(0, 3000)}

## 依頼
各トピックに対して、ナレッジを参照して簡潔な回答素材を作成してください。

## 出力形式（JSONのみ）
{
  "topics": {
    "トピック名": "回答素材（2-3文）"
  },
  "summary": "調査結果の要約（1文）"
}`;

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) return { topics: {}, summary: '' };

  return JSON.parse(jsonMatch[0]) as ResearchResult;
}
