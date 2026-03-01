/**
 * 返信ドラフト生成サービス（Claude Sonnet 4）
 * CLI 版（sales-agent/src/services/reply-generator.ts）を Web 用にポート
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Lead } from '@/lib/types'
import type { IntentAnalysis } from './intent-classifier'
import type { KnowledgeHit } from './knowledge-search'
import { PRODUCTS, type ProductId } from '@/config/products'
import { EMAIL_SIGNATURE } from '@/lib/email-signature'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function generateReplyDraft(params: {
  lead: Lead
  analysis: IntentAnalysis
  originalReplyBody: string
  originalSubject: string
  knowledgeHits?: KnowledgeHit[]
  conversationHistory?: { role: 'us' | 'them'; body: string }[]
  product?: string
}): Promise<{ subject: string; body: string }> {
  const { lead, analysis, originalReplyBody, originalSubject, knowledgeHits, conversationHistory } = params
  const productId = (params.product ?? lead.product ?? 'review-reply-ai') as ProductId
  const productConfig = PRODUCTS[productId]

  // out_of_office / unsubscribe はドラフト不要
  if (analysis.intent === 'out_of_office') {
    return { subject: '', body: '' }
  }

  const intentGuidance: Record<string, string> = {
    interested:
      '- 興味を持ってもらえたことへの感謝\n- 次のステップへの誘導（無料トライアル or 詳細説明）\n- 低ハードルなCTA',
    question:
      '- 質問への丁寧な回答\n- 不明点があれば「お気軽にご質問ください」\n- 追加で試してみる提案',
    not_interested:
      '- 感謝の言葉\n- 「また機会があれば」の一言\n- 短く。しつこくしない',
    soft_decline:
      '- 「承知しました」と受け入れ\n- 将来の可能性に触れる（押し付けず）\n- 3行以内',
    internal_review:
      '- 社内検討に対する感謝\n- 追加で必要な資料があれば提供する旨\n- 「ご不明点があればいつでもご連絡ください」',
    unsubscribe:
      '- 配信停止処理済みの旨を伝える\n- 感謝の言葉\n- 2行以内',
  }

  const prompt = `あなたはRiku（個人開発者）の代わりに、営業メールへの返信を書いてください。

## Rikuの人物像
- 20代後半の個人開発者
- 丁寧だが堅苦しくない（ですます調）
- 「良いものを作ったので使ってほしい」というスタンス
- 売り込みは控えめ

## 紹介している商品（この商品についてのみ回答すること）
${productConfig.name}: ${productConfig.tagline}
URL: ${productConfig.url}
料金: ${productConfig.priceFree} / Pro ${productConfig.pricePro}

## 返信先
会社名: ${lead.company_name}
業種: ${lead.industry ?? '不明'}

${conversationHistory?.length ? `## これまでの会話履歴（古い順）
${conversationHistory.map((m) => `[${m.role === 'us' ? 'Riku' : '相手'}]: ${m.body.slice(0, 500)}`).join('\n\n')}
` : ''}## 相手の最新返信
${originalReplyBody.slice(0, 2000)}

## 返信の意図分析
意図: ${analysis.intent}（確信度: ${analysis.confidence}）
要約: ${analysis.summary}
${analysis.key_questions.length > 0 ? `質問: ${analysis.key_questions.join('、')}` : ''}

## 返信メール要件
${intentGuidance[analysis.intent] ?? '- シンプルな返信'}
${knowledgeHits?.length ? `
## 参考ナレッジ（回答に活用してください）
${knowledgeHits.map((h) => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}` : ''}

## メール文面ルール（必須）

### 改行
- 1文ごとに改行する（句点「。」で改行）
- 1行が25文字を超える場合は読点や文節の切れ目で折り返す
- 段落（話題の塊）ごとに空行を1行入れる

### 文字数
- 本文300文字以内（署名除く）

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

### 書式
- Markdown記法（**太字**、##見出し、- 箇条書き）は一切使用禁止
- 箇条書きにしたい場合は「、」で繋げるか、改行のみで列挙する
- プレーンテキストのメールとして自然に読める形式で書く

## 関連ページURL（質問内容に応じて本文中に挿入すること）
- 料金について聞かれたら → ${productConfig.url}/pricing
- 機能・使い方について → ${productConfig.url}/generator
- 性格診断・トーン設定 → ${productConfig.url}/diagnosis
- 使い方ガイド → ${productConfig.url}/advice
- トップページ → ${productConfig.url}
※ 質問に関連するページURLを1つだけ本文中に自然に含める。2つ以上は不可。

## 禁止事項
- 「突然のご連絡失礼いたします」
- 「お忙しいところ恐れ入りますが」
- クリシェ的な営業文句

## 出力
返信メール本文のみ（件名・署名なし）。300文字以内。`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawBody = message.content[0]?.type === 'text' ? message.content[0].text.trim() : ''
  const body = rawBody + '\n\n' + EMAIL_SIGNATURE
  const subject = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`

  return { subject, body }
}
