/**
 * VoC（Voice of Customer）抽出サービス
 * 返信メールから顧客の声を抽出し、カテゴリ分類する
 */

import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

interface VocItem {
  category: string
  content: string
  raw_quote: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

/**
 * 返信本文から VoC を抽出
 */
export async function extractVoc(params: {
  replyBody: string
  replyId: string
  leadId: string
  product?: string
}): Promise<VocItem[]> {
  const { replyBody, replyId, leadId, product } = params

  // 短すぎる返信はスキップ
  if (replyBody.length < 20) return []

  const prompt = `以下のビジネスメール返信から、顧客の声（VoC）を抽出してください。

## 返信本文
${replyBody.slice(0, 2000)}

## 抽出カテゴリ
- pain_point: 困っていること・課題
- need: 求めている機能・サービス
- objection: 反対意見・懸念
- praise: 好評・良い評価
- competitor_mention: 競合への言及
- pricing_feedback: 料金に関するフィードバック

## 出力形式
JSON配列で出力してください。該当なしの場合は空配列 [] を返してください。
[
  {
    "category": "カテゴリ名",
    "content": "要約（1-2文）",
    "raw_quote": "元の文章から引用",
    "sentiment": "positive|negative|neutral"
  }
]`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    const items = JSON.parse(jsonMatch[0]) as VocItem[]
    if (!Array.isArray(items) || items.length === 0) return []

    // DB に保存
    const rows = items.map((item) => ({
      reply_id: replyId,
      lead_id: leadId,
      category: item.category,
      content: item.content,
      raw_quote: item.raw_quote,
      sentiment: item.sentiment,
      product: product ?? 'review-reply-ai',
    }))

    await supabase.from('sales_voc').insert(rows)

    return items
  } catch {
    return []
  }
}
