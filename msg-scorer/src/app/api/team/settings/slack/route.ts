import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTeamByUserId } from '@/lib/db/teams';
import type { SlackNotifications } from '@/lib/types';

const DEFAULT_NOTIFICATIONS: SlackNotifications = {
  min_score: true,
  approval_request: true,
  approval_complete: true,
  all_scoring: false,
  feedback: false,
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const admin = createAdminClient();
  const { data: team } = await admin
    .from('teams')
    .select('slack_webhook_url, slack_notifications')
    .eq('id', teamResult.team.id)
    .single();

  return NextResponse.json({
    slack_webhook_url: team?.slack_webhook_url ?? '',
    slack_notifications: (team?.slack_notifications as SlackNotifications) ?? DEFAULT_NOTIFICATIONS,
  });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみ設定できます。' }, { status: 403 });
  }

  let body: { slack_webhook_url?: string; slack_notifications?: SlackNotifications };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('teams')
    .update({
      slack_webhook_url: body.slack_webhook_url ?? null,
      slack_notifications: body.slack_notifications ?? DEFAULT_NOTIFICATIONS,
    })
    .eq('id', teamResult.team.id);

  if (error) return NextResponse.json({ error: '設定の保存に失敗しました。' }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  // テスト送信
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみ実行できます。' }, { status: 403 });
  }

  let body: { webhook_url: string };
  try {
    body = await req.json() as { webhook_url: string };
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  if (!body.webhook_url?.startsWith('https://hooks.slack.com/')) {
    return NextResponse.json({ error: 'Webhook URLの形式が不正です。' }, { status: 400 });
  }

  try {
    const res = await fetch(body.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '✅ MsgScore テスト通知', emoji: true } },
          { type: 'section', text: { type: 'mrkdwn', text: 'Slack連携が正常に設定されています！' } },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Slack送信失敗（${res.status}）。Webhook URLを確認してください。` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Slack送信中にエラーが発生しました。' }, { status: 500 });
  }
}
