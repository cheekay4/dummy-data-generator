import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';
import { createApiKey, getApiKeys, revokeApiKey } from '@/lib/db/api-keys';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみ閲覧できます。' }, { status: 403 });
  }

  const keys = await getApiKeys(teamResult.team.id);
  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみ生成できます。' }, { status: 403 });
  }

  if (teamResult.team.plan !== 'team_pro') {
    return NextResponse.json({ error: 'Team Proプランが必要です。' }, { status: 403 });
  }

  // 上限チェック（5キーまで）
  const existing = await getApiKeys(teamResult.team.id);
  const active = existing.filter(k => !k.revoked_at);
  if (active.length >= 5) {
    return NextResponse.json({ error: 'APIキーは最大5つまでです。不要なキーを無効化してください。' }, { status: 400 });
  }

  let body: { name?: string };
  try {
    body = await req.json() as { name?: string };
  } catch {
    body = {};
  }

  const name = body.name?.trim() || 'Default';
  const result = await createApiKey(teamResult.team.id, user.id, name);

  return NextResponse.json({ success: true, key: result.key, id: result.id, prefix: result.prefix });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみ無効化できます。' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'idが必要です。' }, { status: 400 });

  await revokeApiKey(id, teamResult.team.id);
  return NextResponse.json({ success: true });
}
