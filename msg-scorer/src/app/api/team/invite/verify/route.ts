import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'トークンが必要です。' }, { status: 400 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from('team_members')
    .select('invited_email, status, teams(name)')
    .eq('invite_token', token)
    .single();

  if (!member || member.status !== 'pending') {
    return NextResponse.json({ error: '招待が見つかりません。' }, { status: 404 });
  }

  const teams = member.teams as unknown as { name: string } | null;
  return NextResponse.json({
    teamName: teams?.name ?? 'チーム',
    invitedEmail: member.invited_email,
  });
}
