import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL } from '../config/constants.js';
import type { ReplyAnalysis, ReplyIntent } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

/**
 * 返信メールの意図を分類し、対応方針を生成する
 */
export async function classifyIntent(
  replyBody: string,
  originalSubject: string,
): Promise<ReplyAnalysis> {
  const prompt = `あなたは営業メールへの返信を分析するアシスタントです。

## 送信したメールの件名
${originalSubject}

## 受信した返信
${replyBody.slice(0, 2000)}

## 分析してください
返信の意図を以下の5つから1つ選び、JSON形式で返してください。

intent の選択肢:
- interested: 興味あり・詳細を聞きたい
- not_interested: 不要・興味なし
- question: 質問・問い合わせ
- out_of_office: 自動返信・不在
- unsubscribe: 配信停止希望

## 出力形式（JSONのみ）
{
  "intent": "interested",
  "confidence": 0.9,
  "summary": "返信内容の要約（1文）",
  "key_questions": ["質問1", "質問2"],
  "suggested_action": "推奨する対応（1文）",
  "research_needed": false,
  "research_topics": []
}`;

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error('Claude APIの応答からJSONを取得できませんでした');

  return JSON.parse(jsonMatch[0]) as ReplyAnalysis;
}

/**
 * 複数返信を一括分類する
 */
export async function classifyIntents(
  replies: Array<{ id: string; replyBody: string; originalSubject: string }>,
): Promise<Array<{ id: string; analysis: ReplyAnalysis }>> {
  const results = [];
  for (const reply of replies) {
    const analysis = await classifyIntent(reply.replyBody, reply.originalSubject);
    results.push({ id: reply.id, analysis });
  }
  return results;
}
