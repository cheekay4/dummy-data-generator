import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTeamByUserId, inviteMember } from '@/lib/db/teams';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  }

  const existing = await getTeamByUserId(user.id);
  if (!existing) {
    return NextResponse.json({ error: 'チームが見つかりません。先にTeamプランを購入してください。' }, { status: 403 });
  }
  if (existing.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみがチームを設定できます。' }, { status: 403 });
  }

  const { teamName, inviteEmails } = await req.json() as {
    teamName: string;
    inviteEmails: string[];
  };

  if (!teamName || teamName.trim().length < 2 || teamName.trim().length > 50) {
    return NextResponse.json({ error: 'チーム名は2〜50文字で入力してください。' }, { status: 400 });
  }

  const team = existing.team;
  const admin = createAdminClient();

  // チーム名を更新
  await admin.from('teams').update({ name: teamName.trim() }).eq('id', team.id);

  // メンバーを招待
  const invitedMembers = [];
  for (const email of inviteEmails.slice(0, team.max_seats - 1)) {
    if (!email.trim()) continue;
    try {
      const member = await inviteMember({ teamId: team.id, email: email.trim() });
      invitedMembers.push(member);
    } catch {
      // 既存メンバーは無視
    }
  }

  return NextResponse.json({ team: { ...team, name: teamName.trim() }, invitedMembers });
}
