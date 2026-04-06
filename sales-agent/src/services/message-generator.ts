import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL, SAFETY } from '../config/constants.js';
import { buildBaseEmail } from '../templates/base.js';
import { getIndustryTemplate } from '../templates/industries/index.js';
import { scoreEmailSubject, MSGSCORE_LOW_SCORE_THRESHOLD } from './msgscore-client.js';
import { getProduct, type ProductId } from '../config/products.js';
import type { Lead, EmailDraft } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface GeneratedEmail {
  subject: string;
  body_text: string;
  body_html: string;
  personalization_score: number;
}

function getProductTemplate(productId: ProductId, companyName: string): string {
  if (productId === 'review-reply-ai') {
    return `お世話になります。
突然のご連絡失礼いたします。

食べログやGoogleマップの口コミに
一つ一つ返信を書くのって、
意外と時間がかかりませんか？
忙しい営業中だと
後回しになってしまいがちだと思います。

タイムリーに返信できると、
お客様にも良い印象を持ってもらえます。

「AI口コミ返信ジェネレーター」であるMyReplyToneは、
まずはあなたの性格診断を行い、口コミの内容に合わせて
「あなたらしい」返信文を数秒で生成します。
ログインすれば1日5回まで無料で使えます！
性格診断だけ、自動生成返信だけでも使ってみてください！

もし、ご不明点や不満があれば、本メールに返信して教えて下さい。
ぜひ、${companyName}様の日々の業務のお役に立てることを願っています。`;
  }

  // MsgScore
  return `お世話になります。
突然のご連絡失礼いたします。

メールやLINEで配信を送るとき、
件名や文面の反応率って
気になりませんか？
なんとなくで送ってしまい、
開封率が伸びないまま…ということはないでしょうか。

送る前に「この文面で大丈夫か」がわかると、
配信の効果がぐっと変わります。

「MsgScore」は、メールやLINEの配信文を
AIが採点して、開封率・クリック率の改善ポイントを
具体的に教えてくれるツールです。
登録不要で1日5回まで無料で使えます！
まずは1通、今の配信文を貼り付けて試してみてください！

もし、ご不明点や不満があれば、本メールに返信して教えて下さい。
ぜひ、${companyName}様の配信業務のお役に立てることを願っています。`;
}

function buildVariantAPrompt(lead: Lead, productId: ProductId): string {
  const p = getProduct(productId);
  const businessType = lead.industry_detail?.business_type || '';
  const template = getProductTemplate(productId, lead.company_name);

  return `以下のテンプレートをベースに、送信先の企業に合わせたコールドメールを作成してください。

## テンプレート（この構成・トーン・長さを忠実に守ること）
${template}

## 送信先
${lead.company_name}（${businessType}）

## カスタマイズ指示
- テンプレートの構成（挨拶→課題共感→解決の糸口→商品紹介→寄り添い）を維持する
- 送信先の業態に合わせて「課題共感」パートの表現を自然に調整する
- ただし商品の文脈は絶対にブレさせない:
  - MyReplyTone → 必ず「口コミ返信」の話をする。「配信」「メルマガ」等の話題は禁止
  - MsgScore → 必ず「メール・LINE配信文の採点」の話をする。「口コミ」の話題は禁止
- 商品名・URL・機能説明はテンプレート通りにする（勝手に変えない）
- 全体の文量はテンプレートと同程度にする（大幅に増やさない）
- 企業名は「${lead.company_name}様」で統一

## 件名ルール
- 20〜30文字
- ポジティブで提案型にする（「〜しませんか？」「〜できます」）
- 「無料」というワードを自然に入れる
${productId === 'review-reply-ai'
    ? `- 必ず「口コミ返信」に関する件名にする。「配信」という言葉は使わない
- 業態名（カフェ、レストラン、ジビエ等）を件名に入れない。汎用的な件名にする
- 良い件名の例: 「口コミの返信を無料で効率化しませんか？」「口コミ返信を無料でスムーズにしませんか？」
- 悪い件名の例: 「カフェの口コミ返信を〜」「イタリアンの口コミ返信を〜」（業態名が入っている）`
    : `- 必ず「メール・LINE配信」に関する件名にする。「口コミ」という言葉は使わない
- 業態名を件名に入れない。汎用的な件名にする
- 良い件名の例: 「メール配信の改善点、無料で診断できます」「LINE配信の開封率を無料で改善しませんか？」`}
- 悪い件名の例（挑発的・上から目線なので禁止）: 「毎日何分かけてますか？」「後回しにしていませんか？」

## 出力形式（JSONのみ）
{
  "subject": "件名",
  "body_text": "プレーンテキスト版（署名・フッターなし）",
  "body_html": "<p>HTML版（pタグとbrタグのみ）</p>",
  "personalization_score": 7
}`;
}

function buildVariantBPrompt(lead: Lead, productId: ProductId): string {
  const p = getProduct(productId);
  const businessType = lead.industry_detail?.business_type || '';
  const template = getProductTemplate(productId, lead.company_name);

  return `以下のテンプレートをベースに、送信先の企業に合わせたコールドメールの【バリエーションB】を作成してください。

## テンプレート（この構成・トーン・長さを忠実に守ること）
${template}

## 送信先
${lead.company_name}（${businessType}）

## Variant B の特徴（テンプレートとの差分）
- 「課題共感」パートの切り口をVariant Aとは変える（違う角度から課題に触れる）
- 構成・長さ・トーンはテンプレートと同じにする

## カスタマイズ指示
- テンプレートの構成（挨拶→課題共感→解決の糸口→商品紹介→寄り添い）を維持する
- 送信先の業態に合わせて「課題共感」パートの表現を自然に調整する
- ただし商品の文脈は絶対にブレさせない:
  - MyReplyTone → 必ず「口コミ返信」の話をする。「配信」「メルマガ」等の話題は禁止
  - MsgScore → 必ず「メール・LINE配信文の採点」の話をする。「口コミ」の話題は禁止
- 商品名・URL・機能説明はテンプレート通りにする（勝手に変えない）
- 全体の文量はテンプレートと同程度にする（大幅に増やさない）
- 企業名は「${lead.company_name}様」で統一

## 件名ルール
- 20〜30文字
${productId === 'review-reply-ai'
    ? `- 「性格診断」「あなたらしい」というキーワードを含める（MyReplyToneの独自機能を訴求）
- ポジティブなトーンで「無料」も自然に入れる
- 必ず「口コミ返信」に関する件名にする。「配信」という言葉は使わない
- 業態名（カフェ、レストラン、ジビエ等）を件名に入れない。汎用的な件名にする
- 良い件名の例: 「性格診断付き！あなたらしい口コミ返信を無料で」「あなたらしい口コミ返信、性格診断で無料生成」
- 悪い件名の例: 「カフェの口コミ返信を〜」（業態名が入っている）`
    : `- ポジティブで提案型にする。Variant Aとは違う切り口にする
- 「無料」というワードを自然に入れる
- 必ず「メール・LINE配信」に関する件名にする。「口コミ」という言葉は使わない
- 業態名を件名に入れない。汎用的な件名にする
- 良い件名の例: 「配信文の反応率、無料AIで改善しませんか？」「LINE配信の開封率を無料で診断できます」`}
- 悪い件名の例（挑発的・上から目線なので禁止）: 「毎日何分かけてますか？」「後回しにしていませんか？」

## 出力形式（JSONのみ）
{
  "subject": "件名",
  "body_text": "プレーンテキスト版（署名・フッターなし）",
  "body_html": "<p>HTML版（pタグとbrタグのみ）</p>",
  "personalization_score": 7
}`;
}

async function generateWithClaude(prompt: string): Promise<GeneratedEmail> {
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error('Claude APIの応答からJSONを取得できませんでした');

  return JSON.parse(jsonMatch[0]) as GeneratedEmail;
}

function applyFooter(generated: GeneratedEmail, productId: ProductId = 'msgscore'): Pick<EmailDraft, 'body_text' | 'body_html'> {
  const { bodyText, bodyHtml } = buildBaseEmail(generated.body_text, generated.body_html, productId);
  return { body_text: bodyText, body_html: bodyHtml };
}

/**
 * パーソナライズメール文面を A/B 2バリアントで生成する（Add-B）
 * - Variant A: 標準パーソナライズアプローチ（スコア不足時はテンプレートで再生成）
 * - Variant B: より直接的・簡潔、P.S. 付き
 * - 各バリアントを MsgScore API でスコアリング（失敗時はスキップ）
 */
export async function generateEmailDrafts(lead: Lead): Promise<EmailDraft[]> {
  const productId: ProductId = lead.product ?? 'msgscore';
  const drafts: EmailDraft[] = [];

  // ── Variant A ──────────────────────────────────────────
  let generatedA = await generateWithClaude(buildVariantAPrompt(lead, productId));
  let attemptA = 1;

  if (generatedA.personalization_score < SAFETY.PERSONALIZATION_SCORE_MIN) {
    const template = getIndustryTemplate(lead.industry, productId);
    generatedA = {
      subject: template.subject(lead),
      body_text: template.bodyText(lead),
      body_html: template.bodyHtml(lead),
      personalization_score: SAFETY.PERSONALIZATION_SCORE_MIN,
    };
    attemptA = 2;
  }

  const scoreA = await scoreEmailSubject(generatedA.subject);
  const { body_text: bodyTextA, body_html: bodyHtmlA } = applyFooter(generatedA, productId);

  drafts.push({
    lead_id: lead.id,
    subject: generatedA.subject,
    body_text: bodyTextA,
    body_html: bodyHtmlA,
    template_used: `claude-${CLAUDE_MODEL}`,
    variant: 'A',
    msgscore: scoreA?.totalScore,
    msgscore_detail: scoreA ? { ...scoreA.detail, suggestions: scoreA.suggestions } : undefined,
    low_score: scoreA != null && scoreA.totalScore < MSGSCORE_LOW_SCORE_THRESHOLD,
    generation_attempt: attemptA,
  });

  // ── Variant B ──────────────────────────────────────────
  try {
    const generatedB = await generateWithClaude(buildVariantBPrompt(lead, productId));
    const scoreB = await scoreEmailSubject(generatedB.subject);
    const { body_text: bodyTextB, body_html: bodyHtmlB } = applyFooter(generatedB, productId);

    drafts.push({
      lead_id: lead.id,
      subject: generatedB.subject,
      body_text: bodyTextB,
      body_html: bodyHtmlB,
      template_used: `claude-${CLAUDE_MODEL}-varB`,
      variant: 'B',
      msgscore: scoreB?.totalScore,
      msgscore_detail: scoreB ? { ...scoreB.detail, suggestions: scoreB.suggestions } : undefined,
      low_score: scoreB != null && scoreB.totalScore < MSGSCORE_LOW_SCORE_THRESHOLD,
      generation_attempt: 1,
    });
  } catch {
    // Variant B 生成に失敗しても Variant A だけで続行
  }

  return drafts;
}

/**
 * 後方互換: 単一ドラフトを返す（send コマンド等から利用）
 * @deprecated generateEmailDrafts を使うこと
 */
export async function generateEmailDraft(lead: Lead): Promise<EmailDraft> {
  const drafts = await generateEmailDrafts(lead);
  return drafts[0]!;
}
