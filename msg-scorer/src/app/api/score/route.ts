import { NextRequest, NextResponse } from 'next/server';
import { ScoreRequestBody, ErrorResponse } from '@/lib/types';
import { scoreMessage } from '@/lib/scoring';
import { createClient } from '@/lib/supabase/server';
import { getPlanLimits } from '@/lib/plan';
import { checkAndIncrementUsage } from '@/lib/db/rate-limit';
import { saveScore } from '@/lib/db/score-history';
import { getUserPlan, getProfile } from '@/lib/db/profiles';
import { getTeamByUserId, getBrandVoice } from '@/lib/db/teams';
import { findSimilarCampaigns, getOrganizationKnowledge } from '@/lib/db/campaign-results';
import { sendSlackNotification } from '@/lib/slack';
import { DEFAULT_NG_WORDS } from '@/lib/ng-words';
import { validateExtensionToken } from '@/lib/db/extension-token';

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function buildBrandVoicePrompt(brandVoice: {
  tone?: string;
  ng_words?: string[];
  required_checks?: string[];
  subject_rules?: string;
}): string {
  const lines: string[] = ['## ブランドボイス設定（管理者が設定済み）'];

  if (brandVoice.tone) {
    lines.push('', '【トーン指針】', brandVoice.tone);
  }

  const allNgWords = [...DEFAULT_NG_WORDS, ...(brandVoice.ng_words ?? [])];
  if (allNgWords.length > 0) {
    lines.push(
      '',
      '【NGワード】以下の単語が含まれる場合、配信適正スコアを減点しフィードバックに記載:',
      allNgWords.join('、'),
    );
  }

  if ((brandVoice.required_checks ?? []).length > 0) {
    lines.push(
      '',
      '【必須チェック】以下が欠けている場合、配信適正スコアを大幅に減点:',
      (brandVoice.required_checks ?? []).join('、'),
    );
  }

  if (brandVoice.subject_rules) {
    lines.push('', '【件名ルール】', brandVoice.subject_rules);
  }

  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 拡張トークン認証（セッション認証より先に確認）
  const extensionToken = req.headers.get('X-Extension-Token');
  let extensionUserId: string | null = null;
  if (extensionToken?.startsWith('mse_')) {
    extensionUserId = await validateExtensionToken(extensionToken);
  }

  // ユーザー認証確認
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = extensionUserId ?? user?.id ?? null;

  // チーム所属チェック
  let teamId: string | null = null;
  let isTeamPro = false;
  let brandVoiceExtra: string | undefined;
  let minScoreThreshold: number | undefined;
  let minScoreAction: 'warn' | 'badge' | undefined;
  let teamNgWords: string[] = [];

  if (userId) {
    try {
      const teamResult = await getTeamByUserId(userId);
      if (teamResult) {
        teamId = teamResult.team.id;
        isTeamPro = teamResult.team.plan === 'team_pro';
        const bv = await getBrandVoice(teamId);
        if (bv) {
          brandVoiceExtra = buildBrandVoicePrompt(bv);
          teamNgWords = bv.ng_words ?? [];
          if (bv.min_score_threshold) {
            minScoreThreshold = bv.min_score_threshold;
            minScoreAction = bv.min_score_action;
          }
        }
      }
    } catch {
      // チーム情報取得失敗はサイレントに無視
    }
  }

  // プランに応じたレート制限（チームメンバーは無制限）
  const plan = userId ? await getUserPlan(userId) : 'free';
  const isTeamMember = !!teamId;
  const effectivePlan = isTeamMember ? 'pro' : plan; // チームメンバーはPro相当
  const limits = getPlanLimits(effectivePlan);

  // DBベースのレート制限チェック
  const { allowed, remaining } = await checkAndIncrementUsage(
    userId,
    ip,
    limits.dailyScores,
  );

  if (!allowed) {
    return NextResponse.json<ErrorResponse>(
      {
        error: '本日の無料枠を使い切りました。明日またお試しいただくか、Proプランにアップグレードしてください。',
        code: 'RATE_LIMIT',
        remainingToday: 0,
      },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }

  // バリデーション
  let data: ScoreRequestBody;
  try {
    data = await req.json() as ScoreRequestBody;
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: 'リクエストの形式が正しくありません。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }

  const { channel, text, subject, audience } = data;

  if (!['email-subject', 'email-body', 'line'].includes(channel)) {
    return NextResponse.json<ErrorResponse>(
      { error: 'チャネルが不正です。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  if (!text || text.trim().length === 0 || text.length > 5000) {
    return NextResponse.json<ErrorResponse>(
      { error: 'テキストは1〜5000文字で入力してください。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  if (!audience?.totalRecipients || audience.totalRecipients < 1) {
    return NextResponse.json<ErrorResponse>(
      { error: '配信母数を入力してください。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  if (!['purchase', 'click', 'signup', 'visit', 'inquiry'].includes(audience.conversionGoal)) {
    return NextResponse.json<ErrorResponse>(
      { error: '配信目的が不正です。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  const genderTotal = audience.gender.female + audience.gender.male + audience.gender.other;
  if (Math.abs(genderTotal - 100) > 1) {
    return NextResponse.json<ErrorResponse>(
      { error: '性別構成の合計が100%になるよう設定してください。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  const ageTotal = Object.values(audience.ageDistribution).reduce((a, b) => a + b, 0);
  if (Math.abs(ageTotal - 100) > 1) {
    return NextResponse.json<ErrorResponse>(
      { error: '年代構成の合計が100%になるよう設定してください。', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }

  // カスタム NG ワード取得（個人）
  let customNgWords: string[] = [];
  if (userId) {
    try {
      const profile = await getProfile(userId);
      customNgWords = profile?.custom_ng_words ?? [];
    } catch {
      // 取得失敗は無視
    }
  }

  // チームNGワードと個人NGワードをマージ
  const allExtraNgWords = [...new Set([...customNgWords, ...teamNgWords])];

  // Team Pro: 組織ナレッジ + 類似配信を注入
  if (teamId) {
    try {
      // 組織ナレッジ（CSV傾向分析）
      const knowledge = await getOrganizationKnowledge(teamId);
      if (knowledge.length > 0) {
        const knowledgeText = knowledge.slice(0, 3).map(k => k.content).join('\n\n---\n\n');
        brandVoiceExtra = (brandVoiceExtra ?? '') + '\n\n## 組織ナレッジ（過去実績から学習済み）\n' + knowledgeText;
      }

      // 類似配信の実績（Team Proのみ）
      if (isTeamPro) {
        const similar = await findSimilarCampaigns(teamId, channel, text);
        if (similar.length > 0) {
          const lines: string[] = ['', '## 類似配信の過去実績（参考データ）', '', '以下は同組織で過去に配信された類似コンテンツの実績です。スコアリングの参考にしてください。'];
          similar.forEach((s, i) => {
            lines.push(``, `【類似配信${i + 1}】`);
            if (s.subject) lines.push(`件名: 「${s.subject}」`);
            if (s.body) lines.push(`本文: 「${String(s.body).slice(0, 80)}」`);
            lines.push(`チャネル: ${s.channel}`);
            if (s.open_rate != null) lines.push(`開封率: ${s.open_rate}%`);
            if (s.ctr != null) lines.push(`CTR: ${s.ctr}%`);
            if (s.recipients) lines.push(`配信数: ${s.recipients}件`);
            if (s.cv_count) lines.push(`CV数: ${s.cv_count}件`);
          });
          lines.push('', 'これらの実績を踏まえ、予測数値をより現実的に調整してください。');
          brandVoiceExtra = (brandVoiceExtra ?? '') + lines.join('\n');
        }
      }
    } catch {
      // 取得失敗はサイレントに無視
    }
  }

  // Claude API 呼び出し（タイムアウト 30秒）
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const result = await scoreMessage(channel, text, audience, subject, allExtraNgWords, brandVoiceExtra);
    clearTimeout(timeoutId);

    // チームスコアルール判定結果を追加
    if (minScoreThreshold !== undefined) {
      result.minScoreThreshold = minScoreThreshold;
      result.minScoreAction = minScoreAction;
    }

    // ログイン済みの場合、履歴を自動保存
    let historyId: string | null = null;
    let shareToken: string | null = null;
    if (userId) {
      try {
        const record = await saveScore({ userId, teamId, channel, text, subject, audience, result });
        historyId = record?.id ?? null;
        shareToken = record?.share_token ?? null;
      } catch {
        // 履歴保存失敗はサイレントに無視
      }
    }

    // Slack通知（チームメンバーのみ）
    if (teamId && userId) {
      const memberEmail = user?.email ?? undefined;
      const channelLabel = channel === 'email-subject' ? 'メール件名' : channel === 'email-body' ? 'メール本文' : 'LINE';
      try {
        // 全スコアリング通知
        sendSlackNotification({
          type: 'all_scoring',
          teamId,
          data: { memberEmail, score: result.totalScore },
        }).catch(() => {});

        // 最低スコアライン未達通知
        if (minScoreThreshold !== undefined && result.totalScore < minScoreThreshold) {
          sendSlackNotification({
            type: 'min_score',
            teamId,
            data: {
              memberEmail,
              score: result.totalScore,
              threshold: minScoreThreshold,
              channel,
              channelLabel,
              text: text.slice(0, 100),
              historyId,
            },
          }).catch(() => {});
          sendSlackNotification({
            type: 'approval_request',
            teamId,
            data: { memberEmail },
          }).catch(() => {});
        }
      } catch {
        // Slack通知失敗はサイレントに無視
      }
    }

    return NextResponse.json(
      { ...result, historyId, shareToken },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-Plan': effectivePlan,
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const isParseError = message.includes('JSON parse');
    return NextResponse.json<ErrorResponse>(
      {
        error: isParseError
          ? 'スコアリングに失敗しました。もう一度お試しください。'
          : 'AI処理中にエラーが発生しました。しばらく待ってから再試行してください。',
        code: isParseError ? 'PARSE_ERROR' : 'API_ERROR',
      },
      { status: 503, headers: { 'X-RateLimit-Remaining': String(remaining) } },
    );
  }
}
