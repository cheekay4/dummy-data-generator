import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTeamByUserId } from '@/lib/db/teams';

// 招待リンクをUIで表示（メール送信なし）または将来の実装用
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult || teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '権限がありません。' }, { status: 403 });
  }

  const { memberId } = await req.json() as { memberId: string };
  const admin = createAdminClient();

  const { data: member } = await admin
    .from('team_members')
    .select('invite_token, invited_email')
    .eq('id', memberId)
    .eq('team_id', teamResult.team.id)
    .single();

  if (!member) return NextResponse.json({ error: 'メンバーが見つかりません。' }, { status: 404 });

  const origin = req.headers.get('origin') ?? 'https://msgscore.jp';
  const inviteUrl = `${origin}/team/invite/${member.invite_token}`;

  return NextResponse.json({
    inviteUrl,
    email: member.invited_email,
  });
}
