import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getTeamByUserId,
  createRevisionRequest,
  getRevisionRequests,
  resolveRevisionRequest,
} from '@/lib/db/teams';

// 修正依頼一覧取得
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const revisions = await getRevisionRequests(
    teamResult.team.id,
    user.id,
    teamResult.myMember.role,
  );

  return NextResponse.json({ revisions });
}

// 修正依頼作成（Owner のみ）
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });
  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみが修正依頼を作成できます。' }, { status: 403 });
  }

  const { scoreHistoryId, assignedTo, comment } = await req.json() as {
    scoreHistoryId: string;
    assignedTo: string;
    comment: string;
  };

  if (!comment?.trim()) {
    return NextResponse.json({ error: 'コメントを入力してください。' }, { status: 400 });
  }

  const revision = await createRevisionRequest({
    scoreHistoryId,
    teamId: teamResult.team.id,
    requestedBy: user.id,
    assignedTo,
    comment: comment.trim(),
  });

  return NextResponse.json({ revision });
}

// 修正依頼を解決済みに更新
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { revisionId } = await req.json() as { revisionId: string };
  await resolveRevisionRequest(revisionId, teamResult.team.id);

  return NextResponse.json({ ok: true });
}
