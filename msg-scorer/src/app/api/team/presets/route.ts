import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId, getTeamPresets, saveTeamPreset, deleteTeamPreset, getTeamMembers } from '@/lib/db/teams';
import { AudienceSegment } from '@/lib/types';

const MAX_TEAM_PRESETS = 20;

// プリセット一覧
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const presets = await getTeamPresets(teamResult.team.id);
  return NextResponse.json({ presets });
}

// プリセット保存
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const existing = await getTeamPresets(teamResult.team.id);
  if (existing.length >= MAX_TEAM_PRESETS) {
    return NextResponse.json({ error: 'プリセットの上限（20個）に達しています。' }, { status: 400 });
  }

  const { name, segment } = await req.json() as { name: string; segment: AudienceSegment };
  if (!name?.trim()) return NextResponse.json({ error: 'プリセット名を入力してください。' }, { status: 400 });

  const preset = await saveTeamPreset({
    teamId: teamResult.team.id,
    name: name.trim(),
    segment,
    createdBy: user.id,
  });

  return NextResponse.json({ preset });
}

// プリセット削除
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const presetId = searchParams.get('id');
  if (!presetId) return NextResponse.json({ error: 'IDが必要です。' }, { status: 400 });

  // 管理者 or 作成者のみ削除可能
  const presets = await getTeamPresets(teamResult.team.id);
  const target = presets.find(p => p.id === presetId);
  if (!target) return NextResponse.json({ error: 'プリセットが見つかりません。' }, { status: 404 });
  if (teamResult.myMember.role !== 'owner' && target.created_by !== user.id) {
    return NextResponse.json({ error: '削除権限がありません。' }, { status: 403 });
  }

  await deleteTeamPreset(presetId, teamResult.team.id);
  return NextResponse.json({ ok: true });
}
