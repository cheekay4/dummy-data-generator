/**
 * フォローアップメール生成サービス（Claude Sonnet 4）
 * followup_1: 別角度の価値提案（200字以内）
 * followup_2: 短いリマインダー（100字以内）
 * reapproach: 新規スレッドで再アプローチ
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Lead, EmailType } from '@/lib/types'
import { PRODUCTS, type ProductId } from '@/config/products'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function generateFollowup(params: {
  lead: Lead
  originalSubject: string
  originalBody: string
  followupType: Extract<EmailType, 'followup_1' | 'followup_2' | 'reapproach'>
  product?: string
}): Promise<{ subject: string; bodyText: string; bodyHtml: string }> {
  const { lead, originalSubject, originalBody, followupType } = params
  const productId = (params.product ?? lead.product ?? 'review-reply-ai') as ProductId
  const productConfig = PRODUCTS[productId]

  const typeGuidance: Record<string, string> = {
    followup_1: `## フォローアップ1（初回と別角度の価値提案）
- 初回メールとは別の切り口でアプローチ
- 具体的なメリットや事例を1つだけ提示
- 200字以内
- 「先日お送りしたメールの件ですが」のような前置きOK（1行だけ）`,
    followup_2: `## フォローアップ2（短いリマインダー）
- 「もしご関心があれば」程度の軽いトーン
- 100字以内
- CTA は1つだけ（返信 or URL）
- しつこくしない`,
    reapproach: `## 再アプローチ（新規スレッド）
- 新しい件名で送る（前回の件名とは異なる）
- 初回・フォローとは全く別の角度
- 新しいニュースや事例があれば使う
- 200字以内`,
  }

  const prompt = `あなたはRiku（個人開発者）の代わりに、フォローアップメールを書いてください。

## Rikuの人物像
- 20代後半の個人開発者
- 丁寧だが堅苦しくない（ですます調）
- 「良いものを作ったので使ってほしい」というスタンス
- 売り込みは控えめ

## 紹介している商品（この商品についてのみ言及すること）
${productConfig.name}: ${productConfig.tagline}
URL: ${productConfig.url}
料金: ${productConfig.priceFree} / Pro ${productConfig.pricePro}

## 送信先
会社名: ${lead.company_name}
業種: ${lead.industry ?? '不明'}

## 初回メール
件名: ${originalSubject}
本文: ${originalBody.slice(0, 1000)}

${typeGuidance[followupType] ?? ''}

## メール文面ルール（必須）

### 改行
- 1文ごとに改行する（句点「。」で改行）
- 1行が25文字を超える場合は読点や文節の切れ目で折り返す
- 段落（話題の塊）ごとに空行を1行入れる

### AI臭の排除（以下の表現は使用禁止）
- 「これにより」「それにより」→ 削除 or 具体的に
- 「〜することが可能です」→「〜できます」
- 「包括的」「多角的」「総合的」「最適化」→ 具体的に
- 「非常に重要」「非常に有効」→ なぜかを書く
- 「サポート」「ソリューション」「アプローチ」→ 日本語で具体的に
- 「価値を最大化」「〜を実現」→ 具体的成果・数字で
- 「ぜひ」は1メール1回まで

### 語尾
- 同じ語尾を3回連続させない（です/ます/ください を意識的にバラす）

### 敬語
- 「です・ます」ベース。1文に敬語表現は1つまで
- 「〜させていただく」は1メール1回まで
- 過剰敬語禁止（「お伺いさせていただきます」→「伺います」）

### 呼称
- 企業名は「${lead.company_name}様」で統一（「さん」「御社」は使わない）

## 禁止事項
- 「突然のご連絡失礼いたします」（初回ではない）
- 「お忙しいところ恐れ入りますが」
- URLを2つ以上含める

## 出力形式
以下のJSON形式で出力してください:
{
  "subject": "${followupType === 'reapproach' ? '新しい件名（14〜20文字）' : `Re: ${originalSubject}`}",
  "body": "メール本文（署名なし）"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0]?.type === 'text' ? message.content[0].text.trim() : ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    const parsed = JSON.parse(jsonMatch[0]) as { subject: string; body: string }

    const subject = followupType === 'reapproach'
      ? parsed.subject
      : (originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`)

    const bodyText = parsed.body
    const bodyHtml = bodyText
      .split('\n')
      .map((line: string) => (line === '' ? '<br>' : `<p style="margin:0">${line}</p>`))
      .join('')

    return { subject, bodyText, bodyHtml }
  } catch {
    // JSON パース失敗時はテキストをそのまま使用
    const subject = followupType === 'reapproach'
      ? `${lead.company_name}様へ — ご確認のお願い`
      : (originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`)

    const bodyHtml = text
      .split('\n')
      .map((line: string) => (line === '' ? '<br>' : `<p style="margin:0">${line}</p>`))
      .join('')

    return { subject, bodyText: text, bodyHtml }
  }
}
