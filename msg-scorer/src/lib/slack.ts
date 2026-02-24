import type { SlackNotificationType } from './types';
import { createAdminClient } from './supabase/admin';

interface NotificationPayload {
  type: SlackNotificationType;
  teamId: string;
  data?: Record<string, unknown>;
}

function buildSlackMessage(payload: NotificationPayload): Record<string, unknown> {
  const { type, data = {} } = payload;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://msg-scorer.vercel.app';

  switch (type) {
    case 'min_score': {
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '⚠️ 最低スコアライン未達', emoji: true } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*メンバー*\n${data.memberEmail ?? '不明'}` },
              { type: 'mrkdwn', text: `*スコア*\n${data.score ?? '-'} / ${data.threshold ?? '-'}（最低ライン）` },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*チャネル*: ${data.channelLabel ?? data.channel ?? '-'}\n*テキスト*: 「${String(data.text ?? '').slice(0, 80)}」`,
            },
          },
          ...(data.historyId ? [{
            type: 'actions',
            elements: [{
              type: 'button',
              text: { type: 'plain_text', text: '結果を確認', emoji: true },
              url: `${appUrl}/history/${data.historyId}`,
            }],
          }] : []),
        ],
      };
    }
    case 'approval_request': {
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '📋 承認リクエスト', emoji: true } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${data.memberEmail ?? 'メンバー'}さんのスコアリング結果が最低ラインを下回りました。承認または修正依頼をしてください。`,
            },
          },
          {
            type: 'actions',
            elements: [{
              type: 'button',
              text: { type: 'plain_text', text: '承認画面を開く', emoji: true },
              url: `${appUrl}/team`,
              style: 'primary',
            }],
          },
        ],
      };
    }
    case 'approval_complete': {
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '✅ 承認完了', emoji: true } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${data.ownerEmail ?? '管理者'}が修正依頼を承認しました。`,
            },
          },
        ],
      };
    }
    case 'approval_revision': {
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '🔄 修正依頼', emoji: true } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${data.ownerEmail ?? '管理者'}から修正依頼が届きました。\n*コメント*: ${data.comment ?? '-'}`,
            },
          },
          {
            type: 'actions',
            elements: [{
              type: 'button',
              text: { type: 'plain_text', text: '詳細を確認', emoji: true },
              url: `${appUrl}/team`,
            }],
          },
        ],
      };
    }
    case 'all_scoring': {
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '📊 スコアリング実行', emoji: true } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*メンバー*\n${data.memberEmail ?? '-'}` },
              { type: 'mrkdwn', text: `*スコア*\n${data.score ?? '-'}` },
            ],
          },
        ],
      };
    }
    case 'feedback': {
      const ratingLabel = data.rating === -1 ? '👎 改善が必要' : (data.ratingLabel ?? '👍 役立った');
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '💬 フィードバック投稿', emoji: true } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*メンバー*\n${data.memberEmail ?? '不明'}` },
              { type: 'mrkdwn', text: `*評価*\n${ratingLabel}` },
            ],
          },
          ...(data.comment ? [{
            type: 'section',
            text: { type: 'mrkdwn', text: `*コメント*\n${String(data.comment).slice(0, 200)}` },
          }] : []),
        ],
      };
    }
    default:
      return { text: `MsgScore通知: ${type}` };
  }
}

export async function sendSlackNotification(payload: NotificationPayload): Promise<void> {
  const admin = createAdminClient();

  const { data: team } = await admin
    .from('teams')
    .select('slack_webhook_url, slack_notifications')
    .eq('id', payload.teamId)
    .single();

  if (!team?.slack_webhook_url) return; // Webhook未設定はスキップ

  const settings = (team.slack_notifications as Record<string, boolean>) ?? {};
  if (!settings[payload.type]) return; // 通知条件OFF

  const message = buildSlackMessage(payload);

  try {
    await fetch(team.slack_webhook_url as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch {
    // Webhook失敗はサイレントに無視（本体処理を止めない）
  }
}
