import Anthropic from '@anthropic-ai/sdk';
import { Channel, AudienceSegment, ScoreResponse, CONVERSION_LABELS } from './types';
import { detectNgWords } from './ng-words';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getDominantAge(dist: AudienceSegment['ageDistribution']): string {
  const groups = [
    { label: '~19歳',   val: dist.under20 },
    { label: '20代',    val: dist.twenties },
    { label: '30代',    val: dist.thirties },
    { label: '40代',    val: dist.forties },
    { label: '50代',    val: dist.fifties },
    { label: '60歳以上', val: dist.sixtiesPlus },
  ];
  return groups.reduce((max, g) => g.val > max.val ? g : max).label;
}

function buildSystemPrompt(channel: Channel, audience: AudienceSegment, brandVoiceExtra?: string): string {
  const { totalRecipients, conversionGoal, gender, ageDistribution, attributes } = audience;
  const channelName =
    channel === 'email-subject' ? 'メール件名' :
    channel === 'email-body'    ? 'メール本文' :
    channel === 'line'          ? 'LINE配信文' : 'ブログ・SNS記事';
  const avgOpenRateStr = attributes.avgOpenRate != null
    ? `${attributes.avgOpenRate}%`
    : '未入力（業界平均で推定してください）';
  const avgCtrStr = attributes.avgCtr != null
    ? `${attributes.avgCtr}%`
    : '未入力（業界平均で推定してください）';

  // ブログ・SNS専用プロンプト
  if (channel === 'blog-sns') {
    return `あなたはコンテンツマーケティングとSNSマーケティングの専門家です。
入力されたブログ記事・SNS投稿を、読者セグメントの特性とコンテンツ目的を踏まえて評価してください。

## 読者セグメント情報
- 想定読者数: ${totalRecipients}人
- 性別構成: 女性${gender.female}% / 男性${gender.male}% / その他${gender.other}%
- 年代構成: ~19歳${ageDistribution.under20}% / 20代${ageDistribution.twenties}% / 30代${ageDistribution.thirties}% / 40代${ageDistribution.forties}% / 50代${ageDistribution.fifties}% / 60歳以上${ageDistribution.sixtiesPlus}%
- モバイル閲覧率: ${attributes.deviceMobile}%
- 既存フォロワー・読者率: ${attributes.existingCustomer}%
- 過去平均エンゲージメント率: ${avgOpenRateStr}
- 過去平均クリック率: ${avgCtrStr}

## チャネル: ${channelName}

## コンテンツ目的
${CONVERSION_LABELS[conversionGoal].name}

## 評価軸（5軸、各0-100点）
1. 見出し・フック力（重み25%）: タイトル・冒頭の引きの強さ。このセグメントが思わず読みたくなるか。
2. 読了性（重み20%）: 最後まで読まれるか。モバイル率${attributes.deviceMobile}%を考慮した構成か。段落・改行・文章の長さ。
3. エンゲージメント誘発力（重み20%）: いいね・シェア・コメントを促す要素があるか。感情を動かすか。
4. ターゲット適合度（重み20%）: 読者層のトーン・関心事・語彙との整合性。目的との合致度。
5. SEO・拡散適正（重み15%）: キーワードの自然な使用、ハッシュタグの適切さ、文字数・画像への言及など。

## 予測数値の算出ルール
- 基準エンゲージメント率: 過去平均があればそれをベース。なければブログ2%/SNS5%を業界平均として使用
- スコアに応じた調整（メールと同じルール適用）
- CTR（クリック率）= エンゲージメント数の約30%を基準に調整
- openRate = エンゲージメント率として出力（読了率相当）

## 出力形式
必ず以下のJSON形式のみで回答してください。JSONの前後にマークダウンのコードブロック記号を付けないでください。JSON以外のテキストは絶対に含めないこと。

{
  "totalScore": 数値(0-100の整数),
  "axes": [
    {"name": "見出し・フック力", "score": 数値(0-100), "feedback": "セグメント特性を踏まえた具体的な評価。50文字以上。"},
    {"name": "読了性", "score": 数値(0-100), "feedback": "モバイル率を考慮した評価。50文字以上。"},
    {"name": "エンゲージメント誘発力", "score": 数値(0-100), "feedback": "いいね・シェア・コメントを促す要素の評価。50文字以上。"},
    {"name": "ターゲット適合度", "score": 数値(0-100), "feedback": "読者層との整合性評価。50文字以上。"},
    {"name": "SEO・拡散適正", "score": 数値(0-100), "feedback": "キーワード・ハッシュタグ・文字数評価。50文字以上。"}
  ],
  "improvements": [
    "具体的な改善案1（何をどう変えるか明記）",
    "改善案2",
    "改善案3"
  ],
  "abVariants": [
    {
      "label": "パターンA: ○○重視",
      "text": "改善版の完全なテキスト",
      "predictedOpenRate": 数値(小数点1桁),
      "predictedCtr": 数値(小数点1桁),
      "predictedConversionRate": 数値(小数点1桁),
      "predictedConversionCount": 数値(整数)
    },
    {
      "label": "パターンB: ○○重視",
      "text": "改善版の完全なテキスト",
      "predictedOpenRate": 数値,
      "predictedCtr": 数値,
      "predictedConversionRate": 数値,
      "predictedConversionCount": 数値
    }
  ],
  "currentImpact": {
    "openRate": 数値(エンゲージメント率、小数点1桁),
    "openCount": 数値(エンゲージ数、整数),
    "ctr": 数値(クリック率、小数点1桁),
    "clickCount": 数値(整数),
    "conversionRate": 数値(小数点1桁),
    "conversionCount": 数値(整数),
    "conversionLabel": "クリック数"
  },
  "improvedImpact": {
    "openRate": 数値,
    "openCount": 数値,
    "ctr": 数値,
    "clickCount": 数値,
    "conversionRate": 数値,
    "conversionCount": 数値,
    "conversionLabel": "クリック数"
  }
}`;
  }

  const base = `あなたはメールマーケティング・LINEマーケティングの専門家であり、配信先セグメントの属性を考慮した効果予測ができるアナリストです。
入力されたマーケティングメッセージを、配信先セグメントの特性と配信目的を踏まえて評価してください。

## 配信先セグメント情報
- 配信母数: ${totalRecipients}件
- 性別構成: 女性${gender.female}% / 男性${gender.male}% / その他${gender.other}%
- 年代構成: ~19歳${ageDistribution.under20}% / 20代${ageDistribution.twenties}% / 30代${ageDistribution.thirties}% / 40代${ageDistribution.forties}% / 50代${ageDistribution.fifties}% / 60歳以上${ageDistribution.sixtiesPlus}%
- モバイル閲覧率: ${attributes.deviceMobile}%
- 既存顧客率: ${attributes.existingCustomer}%
- 過去平均開封率: ${avgOpenRateStr}
- 過去平均CTR: ${avgCtrStr}

## チャネル: ${channelName}

## 配信の目的（コンバージョン定義）
この配信のゴール: ${CONVERSION_LABELS[conversionGoal].name}

## 評価軸（5軸、各0-100点）
1. 開封誘引力（重み25%）: このセグメントの読者が件名・冒頭を見て開きたくなるか。年代・性別に合ったフックがあるか。
2. 読了性（重み20%）: このセグメントの読者が最後まで読むか。モバイル率${attributes.deviceMobile}%を考慮した構造か。
3. CTA強度（重み20%）: 配信目的に応じた行動喚起の強さ（下記「目的別CTA評価基準」参照）。
4. ターゲット適合度（重み20%）: セグメントの主要層とトーン・敬語レベル・訴求内容の整合性。配信目的との整合性も評価。
5. 配信適正（重み15%）: スパム判定リスク、文字数、チャネル固有の制約への準拠。

## 目的別CTA評価基準
CTA強度の評価は、配信目的に合わせて以下の基準で行ってください:
- 購入・注文: 価格訴求の具体性、限定感・緊急性、カート/購入ページへの誘導の明確さ、送料無料・ポイント等の付加価値訴求
- 記事クリック: 好奇心・続きを読みたくなる力、情報の出し惜しみ加減、見出しの引きの強さ、「続きを読む」への自然な誘導
- 申込・登録: ベネフィットの具体的な明示、不安や疑問の払拭、申込フォームへの誘導の簡潔さ、無料体験・特典の訴求
- 来店・予約: 場所・日時の具体性、予約の簡単さの伝達、地域密着感、「今すぐ予約」等の即時行動誘導
- 問い合わせ: 課題への共感、専門性・信頼感の提示、問い合わせハードルの低さ（「お気軽に」等）、返答の速さ・質の訴求

## セグメント別の評価ポイント（AIが自動で判断）
- 女性率が70%以上: 共感型の表現、パーソナルな語りかけ、感情に訴える言葉をプラス評価
- 20代が最多層: 絵文字OK、カジュアルな口調OK、長文はマイナス
- 30-40代女性が最多層: 共感+実利のバランス、「あなた」語りかけを評価
- 50代以上が最多層: 明瞭さ、信頼感のある丁寧な表現、読みやすさ重視
- 男性率70%以上かつ40代中心: 数値根拠、ROI訴求、簡潔さを高評価
- モバイル率70%以上: 件名15文字以内推奨、短い段落、縦スクロール最適化
- 既存顧客率70%以上: ロイヤルティ施策、特別感・限定感の訴求を評価

## 予測数値の算出ルール
- 基準開封率: 過去平均開封率がある場合はそれをベース。ない場合:
  - メール: 業界平均20%
  - LINE: 業界平均60%
- スコアに応じた調整:
  - 総合スコア85-100: 基準 +8pt
  - 総合スコア70-84: 基準 +3pt
  - 総合スコア55-69: 基準 ±0pt
  - 総合スコア40-54: 基準 -5pt
  - 総合スコア0-39: 基準 -10pt
- CTRは開封数の約20%を基準に、CTA強度スコアで調整
- 開封数 = 配信母数 × 開封率
- クリック数 = 配信母数 × CTR

## 最終コンバージョン数の算出
配信目的に応じた最終指標を算出してください:
- 購入・注文: 最終CVR = クリック数の1-3%（EC平均）。推定購入数 = クリック数 × CVR。conversionLabel = "購入数"
- 記事クリック: 最終指標 = クリック数そのもの。conversionRate = ctr、conversionCount = clickCount。conversionLabel = "クリック数"
- 申込・登録: 最終CVR = クリック数の3-8%（LP平均）。推定申込数 = クリック数 × CVR。conversionLabel = "申込数"
- 来店・予約: 最終CVR = クリック数の2-5%。推定予約数 = クリック数 × CVR。conversionLabel = "予約数"
- 問い合わせ: 最終CVR = クリック数の1-4%。推定問い合わせ数 = クリック数 × CVR。conversionLabel = "問い合わせ数"

## 出力形式
必ず以下のJSON形式のみで回答してください。
JSONの前後にマークダウンのコードブロック記号を付けないでください。
JSON以外のテキストは絶対に含めないこと。

{
  "totalScore": 数値(0-100の整数),
  "axes": [
    {"name": "開封誘引力", "score": 数値(0-100), "feedback": "セグメント特性を踏まえた具体的な評価。50文字以上。"},
    {"name": "読了性", "score": 数値(0-100), "feedback": "モバイル率を考慮した評価。50文字以上。"},
    {"name": "CTA強度", "score": 数値(0-100), "feedback": "配信目的（${conversionGoal}）に対するCTA評価。50文字以上。"},
    {"name": "ターゲット適合度", "score": 数値(0-100), "feedback": "セグメント×目的との整合性評価。50文字以上。"},
    {"name": "配信適正", "score": 数値(0-100), "feedback": "チャネル固有の制約への準拠評価。50文字以上。"}
  ],
  "improvements": [
    "配信目的とセグメントを考慮した具体的な改善案1（何をどう変えるか明記）",
    "改善案2",
    "改善案3"
  ],
  "abVariants": [
    {
      "label": "パターンA: ○○重視",
      "text": "改善版の完全なテキスト",
      "predictedOpenRate": 数値(小数点1桁),
      "predictedCtr": 数値(小数点1桁),
      "predictedConversionRate": 数値(小数点1桁),
      "predictedConversionCount": 数値(整数)
    },
    {
      "label": "パターンB: ○○重視",
      "text": "改善版の完全なテキスト",
      "predictedOpenRate": 数値,
      "predictedCtr": 数値,
      "predictedConversionRate": 数値,
      "predictedConversionCount": 数値
    }
  ],
  "currentImpact": {
    "openRate": 数値(小数点1桁),
    "openCount": 数値(整数),
    "ctr": 数値(小数点1桁),
    "clickCount": 数値(整数),
    "conversionRate": 数値(小数点1桁),
    "conversionCount": 数値(整数),
    "conversionLabel": "購入数"
  },
  "improvedImpact": {
    "openRate": 数値,
    "openCount": 数値,
    "ctr": 数値,
    "clickCount": 数値,
    "conversionRate": 数値,
    "conversionCount": 数値,
    "conversionLabel": "購入数"
  }
}`;

  if (brandVoiceExtra) {
    return `${base}\n\n${brandVoiceExtra}`;
  }
  return base;
}

function buildUserPrompt(
  channel: Channel,
  text: string,
  audience: AudienceSegment,
  subject?: string,
): string {
  const channelName =
    channel === 'email-subject' ? 'メール件名' :
    channel === 'email-body'    ? 'メール本文' :
    channel === 'line'          ? 'LINE配信文' : 'ブログ・SNS記事';
  const dominantAge = getDominantAge(audience.ageDistribution);

  return `チャネル: ${channelName}
配信目的: ${CONVERSION_LABELS[audience.conversionGoal].name}
セグメント: ${audience.presetName ?? 'カスタム設定'}
配信母数: ${audience.totalRecipients}件
性別: 女性${audience.gender.female}% / 男性${audience.gender.male}%
主要年代: ${dominantAge}
モバイル: ${audience.attributes.deviceMobile}% / 既存顧客: ${audience.attributes.existingCustomer}%

--- 評価対象テキスト ---
${subject ? `件名: ${subject}\n\n` : ''}${text}`;
}

type ImpactClamp = ScoreResponse['currentImpact'];
function clampImpact(impact: ImpactClamp): ImpactClamp {
  return {
    ...impact,
    openRate:        Math.min(100, Math.max(0, Number(impact.openRate))),
    ctr:             Math.min(100, Math.max(0, Number(impact.ctr))),
    conversionRate:  Math.min(100, Math.max(0, Number(impact.conversionRate))),
    openCount:       Math.max(0, Math.round(Number(impact.openCount))),
    clickCount:      Math.max(0, Math.round(Number(impact.clickCount))),
    conversionCount: Math.max(0, Math.round(Number(impact.conversionCount))),
  };
}

export async function scoreMessage(
  channel: Channel,
  text: string,
  audience: AudienceSegment,
  subject?: string,
  extraNgWords: string[] = [],
  brandVoiceExtra?: string,
): Promise<ScoreResponse> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    temperature: 0.3,
    system: buildSystemPrompt(channel, audience, brandVoiceExtra),
    messages: [{ role: 'user', content: buildUserPrompt(channel, text, audience, subject) }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '';

  let parsed: ScoreResponse;
  try {
    parsed = JSON.parse(raw) as ScoreResponse;
  } catch {
    const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (match) {
      parsed = JSON.parse(match[1]) as ScoreResponse;
    } else {
      throw new Error('JSON parse failed');
    }
  }

  parsed.totalScore = Math.min(100, Math.max(0, Math.round(Number(parsed.totalScore))));
  parsed.axes = parsed.axes.map((a) => ({
    ...a,
    score: Math.min(100, Math.max(0, Math.round(Number(a.score)))),
  }));
  parsed.currentImpact  = clampImpact(parsed.currentImpact);
  parsed.improvedImpact = clampImpact(parsed.improvedImpact);

  // NGワード検出
  const fullText = subject ? `${subject}\n${text}` : text;
  parsed.ngWordsFound = detectNgWords(fullText, extraNgWords);

  return parsed;
}
