import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getTeamByUserId,
  getTeamMembers,
  inviteMember,
  removeMember,
  cancelInvite,
  resendInvite,
  getActiveTeamMemberCount,
} from '@/lib/db/teams';

// メンバー一覧取得
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const members = await getTeamMembers(teamResult.team.id);
  return NextResponse.json({ members, team: teamResult.team });
}

// メンバー招待
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });
  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみがメンバーを招待できます。' }, { status: 403 });
  }

  const { email } = await req.json() as { email: string };
  if (!email?.trim()) return NextResponse.json({ error: 'メールアドレスを入力してください。' }, { status: 400 });

  const currentCount = await getActiveTeamMemberCount(teamResult.team.id);
  if (currentCount >= teamResult.team.max_seats) {
    return NextResponse.json({ error: '席数の上限に達しています。' }, { status: 400 });
  }

  const member = await inviteMember({ teamId: teamResult.team.id, email: email.trim() });
  return NextResponse.json({ member });
}

// メンバー削除 / 招待キャンセル / 再送
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });
  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみが操作できます。' }, { status: 403 });
  }

  const { memberId, action } = await req.json() as {
    memberId: string;
    action: 'remove' | 'cancel' | 'resend';
  };

  const teamId = teamResult.team.id;

  if (action === 'remove') {
    await removeMember(memberId, teamId);
  } else if (action === 'cancel') {
    await cancelInvite(memberId, teamId);
  } else if (action === 'resend') {
    const updated = await resendInvite(memberId);
    return NextResponse.json({ member: updated });
  }

  return NextResponse.json({ ok: true });
}
