import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL } from '../config/constants.js';
import type { Industry, IndustryDetail } from '../types/index.js';
import type { ProductId } from '../config/products.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface AnalysisResult {
  company_name: string;
  industry: Industry;
  icp_score: number;
  industry_detail: IndustryDetail;
  recommended_product: ProductId;
  estimated_scale: 'individual' | 'small' | 'medium' | 'large' | 'enterprise';
  is_chain: boolean;
}

/**
 * Claude APIでページ内容を分析し、企業の業界・業態・ペインポイントを抽出する
 */
export async function analyzeIndustry(
  url: string,
  title: string,
  pageContent: string,
): Promise<AnalysisResult> {
  const prompt = `あなたはB2Bマーケティングの専門家です。
以下のWebページの内容を分析し、JSON形式で企業情報を返してください。

## 分析対象ページ
URL: ${url}
タイトル: ${title}
本文:
${pageContent.slice(0, 3000)}

## 出力形式（JSONのみ。説明文不要）
{
  "company_name": "企業名",
  "industry": "ec_retail | restaurant | gym | saas | other",
  "business_type": "具体的な業態（例: オーガニックカフェ）",
  "key_services": ["サービス1", "サービス2"],
  "target_customers": "想定顧客層",
  "pain_points": ["ペインポイント1", "ペインポイント2"],
  "online_presence": {
    "has_line": true,
    "has_newsletter": false,
    "has_ec": true,
    "sns_platforms": ["Instagram", "X"]
  },
  "personalization_angle": "この企業にアプローチする際の最適な切り口（1文）",
  "icp_score": 0,
  "recommended_product": "msgscore | review-reply-ai",
  "estimated_scale": "individual",
  "is_chain": false
}

## estimated_scale の判定基準
- "individual": 個人事業主・オーナー1人で運営（例: 個人カフェ、フリーランス美容師）
- "small": 従業員1〜10名の小規模事業（例: 個人経営レストラン、小さなジム）
- "medium": 従業員11〜50名の中規模事業（例: 複数店舗展開、地域チェーン）
- "large": 従業員51〜300名（例: 地方チェーン、中堅企業）
- "enterprise": 従業員300名超の大企業・全国チェーン

## is_chain の判定基準
以下のいずれかに該当する場合 true:
- 「店舗一覧」「店舗情報」「全国○○店舗」等の記載がある
- フランチャイズ展開している
- 複数の都道府県に拠点がある
- ウェブサイトが明らかに企業サイト（IR情報、採用ページ等がある）

## ICP（理想顧客プロファイル）スコア基準
加点:
- LINE公式 or メルマガを運用 → +30
- EC機能あり → +20
- SNS活発（週3回以上更新） → +15
- 個人事業主 or 従業員10名以下 → +15
- メールアドレスが公開されている → +10
- 飲食/EC/ジムのいずれか → +10
減点（重要: 大企業やチェーン店は対象外）:
- estimated_scale が "medium" → -20
- estimated_scale が "large" → -40
- estimated_scale が "enterprise" → -60
- is_chain が true → -30

## recommended_product の判定基準
- 口コミが重要な業種（飲食・美容・ホテル・クリニック・ジム・教室等）→ "review-reply-ai"
- メール配信・LINE配信が多い業種（EC・SaaS等）→ "msgscore"
- 迷ったら "review-reply-ai"`;

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error('Claude APIの応答からJSONを取得できませんでした');

  const parsed = JSON.parse(jsonMatch[0]) as {
    company_name: string;
    industry: Industry;
    business_type: string;
    key_services: string[];
    target_customers: string;
    pain_points: string[];
    online_presence: IndustryDetail['online_presence'];
    personalization_angle: string;
    icp_score: number;
    recommended_product?: ProductId;
    estimated_scale?: string;
    is_chain?: boolean;
  };

  return {
    company_name: parsed.company_name,
    industry: parsed.industry,
    icp_score: Math.min(100, Math.max(0, parsed.icp_score)),
    industry_detail: {
      business_type: parsed.business_type,
      key_services: parsed.key_services,
      target_customers: parsed.target_customers,
      pain_points: parsed.pain_points,
      online_presence: parsed.online_presence,
      personalization_angle: parsed.personalization_angle,
    },
    recommended_product: parsed.recommended_product ?? 'review-reply-ai',
    estimated_scale: (parsed.estimated_scale as AnalysisResult['estimated_scale']) ?? 'small',
    is_chain: parsed.is_chain ?? false,
  };
}
