/**
 * MsgScore 外部スコアリングAPI v1
 * 認証: Authorization: Bearer msk_xxxxx
 */
import { NextRequest, NextResponse } from 'next/server';
import { scoreMessage } from '@/lib/scoring';
import { validateApiKey, checkApiKeyRateLimit } from '@/lib/db/api-keys';
import { getTeamById, getBrandVoice } from '@/lib/db/teams';
import { getOrganizationKnowledge } from '@/lib/db/campaign-results';
import { DEFAULT_NG_WORDS } from '@/lib/ng-words';
import type { Channel, AudienceSegment, ConversionGoal } from '@/lib/types';

const DEFAULT_AUDIENCE: AudienceSegment = {
  totalRecipients: 10000,
  conversionGoal: 'purchase',
  gender: { female: 55, male: 40, other: 5 },
  ageDistribution: { under20: 5, twenties: 25, thirties: 30, forties: 25, fifties: 10, sixtiesPlus: 5 },
  attributes: { deviceMobile: 60, existingCustomer: 50 },
};

function err(code: string, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

function buildBrandVoiceText(bv: {
  tone?: string;
  ng_words?: string[];
  required_checks?: string[];
  subject_rules?: string;
}): string {
  const lines: string[] = ['## ブランドボイス設定'];
  if (bv.tone) lines.push('', '【トーン指針】', bv.tone);
  const ng = [...DEFAULT_NG_WORDS, ...(bv.ng_words ?? [])];
  if (ng.length > 0) lines.push('', '【NGワード】', ng.join('、'));
  if ((bv.required_checks ?? []).length > 0) lines.push('', '【必須チェック】', (bv.required_checks ?? []).join('、'));
  if (bv.subject_rules) lines.push('', '【件名ルール】', bv.subject_rules);
  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  // ── 認証 ──────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return err('INVALID_API_KEY', 'Authorization ヘッダーが必要です。', 401);
  }
  const token = authHeader.slice(7).trim();
  const authResult = await validateApiKey(token);
  if (!authResult) {
    return err('INVALID_API_KEY', 'APIキーが無効です。', 401);
  }

  // ── Team Pro チェック ──────────────────────────────────────
  const team = await getTeamById(authResult.teamId);
  if (!team || team.plan !== 'team_pro') {
    return err('TEAM_NOT_PRO', 'Team ProプランのAPIキーが必要です。', 403);
  }

  // ── レート制限 ─────────────────────────────────────────────
  const rateCheck = await checkApiKeyRateLimit(authResult.keyId, 1000);
  if (!rateCheck.allowed) {
    return err('RATE_LIMITED', 'API利用上限（1,000回/日）に達しました。', 429);
  }

  // ── リクエストパース ───────────────────────────────────────
  let body: {
    channel?: string;
    text?: string;
    audience?: Partial<AudienceSegment> & { age?: Partial<AudienceSegment['ageDistribution']> };
    conversionGoal?: ConversionGoal;
  };
  try {
    body = await req.json() as typeof body;
  } catch {
    return err('INVALID_INPUT', 'リクエストボディが不正なJSONです。', 400);
  }

  const { channel, text } = body;

  if (!channel || !['email_subject', 'email-subject', 'email_body', 'email-body', 'line'].includes(channel)) {
    return err('INVALID_INPUT', 'channel は email_subject / email_body / line のいずれかを指定してください。', 400);
  }
  if (!text || !text.trim()) {
    return err('INVALID_INPUT', 'text は必須です。', 400);
  }
  if (text.length > 5000) {
    return err('INVALID_INPUT', 'text は5,000文字以内にしてください。', 400);
  }

  // channel 正規化（アンダースコア → ハイフン）
  const normalizedChannel = channel.replace(/_/g, '-') as Channel;

  // audience マージ
  const audience: AudienceSegment = {
    ...DEFAULT_AUDIENCE,
    ...(body.audience ?? {}),
    conversionGoal: body.audience?.conversionGoal ?? body.conversionGoal ?? DEFAULT_AUDIENCE.conversionGoal,
    gender: { ...DEFAULT_AUDIENCE.gender, ...(body.audience?.gender ?? {}) },
    ageDistribution: { ...DEFAULT_AUDIENCE.ageDistribution, ...(body.audience?.age ?? body.audience?.ageDistribution ?? {}) },
    attributes: { ...DEFAULT_AUDIENCE.attributes, ...(body.audience?.attributes ?? {}) },
  };

  // ── ブランドボイス + ナレッジ取得 ─────────────────────────
  let brandVoiceExtra: string | undefined;
  let ngWords: string[] = [];
  try {
    const bv = await getBrandVoice(team.id);
    if (bv) {
      brandVoiceExtra = buildBrandVoiceText(bv);
      ngWords = bv.ng_words ?? [];
    }

    // organization_knowledge を注入
    const knowledge = await getOrganizationKnowledge(team.id);
    if (knowledge.length > 0) {
      const knowledgeText = knowledge.slice(0, 3).map(k => k.content).join('\n\n---\n\n');
      brandVoiceExtra = (brandVoiceExtra ?? '') + '\n\n## 組織ナレッジ（過去実績から学習済み）\n' + knowledgeText;
    }
  } catch {
    // 取得失敗はスキップ
  }

  // ── スコアリング ───────────────────────────────────────────
  try {
    const result = await scoreMessage(
      normalizedChannel,
      text,
      audience,
      undefined,
      ngWords,
      brandVoiceExtra,
    );

    return NextResponse.json({
      success: true,
      data: {
        totalScore: result.totalScore,
        axes: result.axes,
        improvements: result.improvements,
        abVariants: result.abVariants,
        currentImpact: result.currentImpact,
        improvedImpact: result.improvedImpact,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return err('SCORING_FAILED', `スコアリングに失敗しました: ${msg}`, 500);
  }
}
