/**
 * 返信 Intent 分類サービス（Claude Sonnet 4）
 * 日本語ビジネスメールの婉曲表現に対応
 */

import Anthropic from '@anthropic-ai/sdk'
import type { ReplyIntent } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface IntentAnalysis {
  intent: ReplyIntent
  confidence: number
  summary: string
  key_questions: string[]
  suggested_action: string
  research_needed: boolean
  research_topics: string[]
}

export async function classifyIntent(
  replyBody: string,
  originalSubject: string
): Promise<IntentAnalysis> {
  const prompt = `あなたは営業メールへの返信を分析するアシスタントです。
日本のビジネスメール文化に精通しています。

## 送信したメールの件名
${originalSubject}

## 受信した返信
${replyBody.slice(0, 2000)}

## 分析してください
返信の意図を以下の7つから1つ選び、JSON形式で返してください。

intent の選択肢:
- interested: 興味あり・詳細を聞きたい・デモ希望・資料請求
- not_interested: 明確に不要・興味なし・「結構です」
- question: 質問・問い合わせ（興味の度合いは不明）
- out_of_office: 自動返信・不在通知
- unsubscribe: 配信停止希望・「今後送らないで」・「迷惑」
- soft_decline: 婉曲な辞退（下記ルール参照）
- internal_review: 社内検討中・上司に確認する（下記ルール参照）

## ★★★ 日本語ビジネスメールの婉曲表現ルール ★★★

日本のビジネスメールでは、断りを直接的に伝えない文化がある。
以下の表現は文字通りに受け取ってはいけない:

soft_decline（婉曲拒否）に分類すべき表現:
- 「検討します」「検討いたします」→ 多くの場合「今は不要」
- 「また機会がありましたら」→ 丁寧な拒否
- 「今は間に合っています」→ 不要
- 「現在は予定がございません」→ 不要
- 「面白いですね」（それだけで終わる場合）→ 社交辞令
- 「いいですね、ただ〜」→ 「ただ」以降が本音。多くの場合拒否
- 「ありがとうございます」だけの短い返信 → 社交辞令

interested に分類すべき表現:
- 「もう少し詳しく教えてください」→ 本物の興味
- 「資料を送ってもらえますか」→ 確実な興味
- 「導入事例を知りたい」→ 関心あり

internal_review に分類すべき表現:
- 「社内で共有します」+ 具体的な部署名・担当者名 → 稟議プロセスの開始
- 「上に相談してみます」→ 前向き検討
- 「関係者に確認します」→ 前向き検討
- 「来週の会議で話してみます」→ 具体的なタイムライン = 本気

判断に迷う場合は confidence を 0.6 以下に設定してください。

## 出力形式（JSONのみ。説明文不要）
{
  "intent": "...",
  "confidence": 0.9,
  "summary": "返信内容の要約（1文）",
  "key_questions": ["質問があれば記載"],
  "suggested_action": "推奨する対応（1文）",
  "research_needed": false,
  "research_topics": []
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]+\}/)
  if (!jsonMatch) {
    console.error('Intent classification: JSON parse failed. Raw:', text.slice(0, 200))
    return {
      intent: 'question',
      confidence: 0.3,
      summary: '分類失敗',
      key_questions: [],
      suggested_action: '手動確認が必要',
      research_needed: true,
      research_topics: [],
    }
  }

  return JSON.parse(jsonMatch[0]) as IntentAnalysis
}
