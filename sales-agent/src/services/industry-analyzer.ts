import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { CLAUDE_MODEL } from '../config/constants.js';
import type { Industry, IndustryDetail } from '../types/index.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

interface AnalysisResult {
  company_name: string;
  industry: Industry;
  icp_score: number;
  industry_detail: IndustryDetail;
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
  "icp_score": 0
}

## ICP（理想顧客プロファイル）スコア基準
- LINE公式 or メルマガを運用 → +30
- EC機能あり → +20
- SNS活発（週3回以上更新） → +15
- 従業員10名以下（小規模） → +15
- メールアドレスが公開されている → +10
- 飲食/EC/ジムのいずれか → +10`;

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
  };
}
