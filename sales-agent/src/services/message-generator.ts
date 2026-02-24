import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL, SAFETY } from '../config/constants.js';
import { buildBaseEmail } from '../templates/base.js';
import { getIndustryTemplate } from '../templates/industries/index.js';
import { scoreEmailSubject, MSGSCORE_LOW_SCORE_THRESHOLD } from './msgscore-client.js';
import type { Lead, EmailDraft } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface GeneratedEmail {
  subject: string;
  body_text: string;
  body_html: string;
  personalization_score: number;
}

function buildVariantAPrompt(lead: Lead): string {
  const hooksText = lead.personalization_hooks
    .map((h) => `- [${h.type}] ${h.content}`)
    .join('\n');

  return `あなたはRikuという個人開発者の代筆者です。
Rikuが作ったWebサービス「MsgScore」を紹介するメールを書いてください。

## Rikuの人物像
- 20代後半の個人開発者
- 技術者だが、ビジネス的な話もできる
- 文体は丁寧だが堅苦しくない（ですます調、適度にカジュアル）
- 売り込みが苦手。「良いもの作ったので見てほしい」というスタンス

## MsgScoreとは
メール・LINE配信文をAIがスコアリングし、開封率・CTR・CV数を予測するツール。
無料で使える（Free: 5回/日）。Pro版は月980円。
URL: https://msgscore.jp

## 送信先企業の情報
会社名: ${lead.company_name}
業態: ${lead.industry_detail.business_type}
主要サービス: ${lead.industry_detail.key_services.join('、')}
ターゲット顧客: ${lead.industry_detail.target_customers}
推定ペインポイント: ${lead.industry_detail.pain_points.join('、')}
LINEあり: ${lead.industry_detail.online_presence.has_line}
メルマガあり: ${lead.industry_detail.online_presence.has_newsletter}
ECあり: ${lead.industry_detail.online_presence.has_ec}
SNS: ${lead.industry_detail.online_presence.sns_platforms.join('、') || 'なし'}

## パーソナライズの切り口
${lead.industry_detail.personalization_angle}

## パーソナライズフック
${hooksText || '（なし）'}

## メール要件
1. 件名: 15〜25文字。相手の社名 or 業態を含む。疑問形 or 提案形。
2. 冒頭: 自己紹介1文 + 相手のビジネスへの具体的言及1文
3. 本題: MsgScoreの紹介（相手のペインポイントに紐づけて）
   - 「御社の{業態}において、{ペインポイント}は課題ではないでしょうか」的な導入
   - MsgScoreがどう解決するか（具体例1つ）
4. CTA: 低ハードル（「まずは無料で1通試してみてください」）
5. 署名: Rikuの名前 + MsgScore URL
6. フッター: 特定電子メール法に基づく表示（テンプレートで付与するため不要）

## 禁止事項
- 「突然のメール失礼いたします」
- 「お忙しいところ恐れ入りますが」
- 3段落を超える長文
- 箇条書きの羅列
- URLを2つ以上含める

## 出力形式（JSONのみ）
{
  "subject": "件名",
  "body_text": "プレーンテキスト版（フッターなし）",
  "body_html": "<p>HTML版（シンプルなHTMLタグのみ）</p>",
  "personalization_score": 0
}`;
}

function buildVariantBPrompt(lead: Lead): string {
  const hooksText = lead.personalization_hooks
    .map((h) => `- [${h.type}] ${h.content}`)
    .join('\n');

  return `あなたはRikuという個人開発者の代筆者です。
Rikuが作ったWebサービス「MsgScore」を紹介するメールの【バリエーションB】を書いてください。

バリエーションBは、より直接的・簡潔で、件名に具体的な数字や問いを使ったアプローチです。
また、本文の末尾にP.S.として「このメールはAIを使って書いています」という一文を入れてください。

## MsgScoreとは
メール・LINE配信文をAIがスコアリングし、開封率・CTR・CV数を予測するツール。
無料で使える（Free: 5回/日）。Pro版は月980円。
URL: https://msgscore.jp

## 送信先企業の情報
会社名: ${lead.company_name}
業態: ${lead.industry_detail.business_type}
主要サービス: ${lead.industry_detail.key_services.join('、')}
ターゲット顧客: ${lead.industry_detail.target_customers}
推定ペインポイント: ${lead.industry_detail.pain_points.join('、')}

## パーソナライズフック
${hooksText || '（なし）'}

## メール要件（バリエーションB）
1. 件名: 20文字以内。数字（例：「3秒でわかる」）か直接的な問い（例：「開封率、測ってますか？」）を使う
2. 冒頭: 結論から入る。自己紹介は最小限（1文以内）
3. 本題: 1〜2文で MsgScore のメリットを端的に
4. CTA: 「無料で試す → https://msgscore.jp」の形式
5. P.S.: 「P.S. このメールはAIを使って下書きしました。変な文があればご容赦ください！」

## 禁止事項
- 「突然のメール失礼いたします」
- 「お忙しいところ恐れ入りますが」
- 3段落以上
- URLを2つ以上含める

## 出力形式（JSONのみ）
{
  "subject": "件名",
  "body_text": "プレーンテキスト版（フッターなし）",
  "body_html": "<p>HTML版</p>",
  "personalization_score": 0
}`;
}

async function generateWithClaude(prompt: string): Promise<GeneratedEmail> {
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error('Claude APIの応答からJSONを取得できませんでした');

  return JSON.parse(jsonMatch[0]) as GeneratedEmail;
}

function applyFooter(generated: GeneratedEmail): Pick<EmailDraft, 'body_text' | 'body_html'> {
  const { bodyText, bodyHtml } = buildBaseEmail(generated.body_text, generated.body_html);
  return { body_text: bodyText, body_html: bodyHtml };
}

/**
 * パーソナライズメール文面を A/B 2バリアントで生成する（Add-B）
 * - Variant A: 標準パーソナライズアプローチ（スコア不足時はテンプレートで再生成）
 * - Variant B: より直接的・簡潔、P.S. 付き
 * - 各バリアントを MsgScore API でスコアリング（失敗時はスキップ）
 */
export async function generateEmailDrafts(lead: Lead): Promise<EmailDraft[]> {
  const drafts: EmailDraft[] = [];

  // ── Variant A ──────────────────────────────────────────
  let generatedA = await generateWithClaude(buildVariantAPrompt(lead));
  let attemptA = 1;

  if (generatedA.personalization_score < SAFETY.PERSONALIZATION_SCORE_MIN) {
    const template = getIndustryTemplate(lead.industry);
    generatedA = {
      subject: template.subject(lead),
      body_text: template.bodyText(lead),
      body_html: template.bodyHtml(lead),
      personalization_score: SAFETY.PERSONALIZATION_SCORE_MIN,
    };
    attemptA = 2;
  }

  const scoreA = await scoreEmailSubject(generatedA.subject);
  const { body_text: bodyTextA, body_html: bodyHtmlA } = applyFooter(generatedA);

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
    const generatedB = await generateWithClaude(buildVariantBPrompt(lead));
    const scoreB = await scoreEmailSubject(generatedB.subject);
    const { body_text: bodyTextB, body_html: bodyHtmlB } = applyFooter(generatedB);

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
