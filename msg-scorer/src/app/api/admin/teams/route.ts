import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { TEAM_PLAN_SEATS } from '@/lib/plan';
import type { TeamPlan } from '@/lib/types';

/** GET /api/admin/teams */
export async function GET() {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = createAdminClient();

  // チーム一覧＋メンバー数
  const { data: teams, error } = await db
    .from('teams')
    .select('id, name, plan, created_by, created_at, stripe_subscription_id')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // アクティブメンバー数を取得
  const teamIds = (teams ?? []).map((t) => t.id);
  const { data: memberCounts } = await db
    .from('team_members')
    .select('team_id')
    .in('team_id', teamIds)
    .eq('status', 'active');

  const countMap: Record<string, number> = {};
  (memberCounts ?? []).forEach((m) => {
    countMap[m.team_id] = (countMap[m.team_id] ?? 0) + 1;
  });

  // オーナーのメールアドレスを取得
  const ownerIds = [...new Set((teams ?? []).map((t) => t.created_by))];
  const { data: ownerProfiles } = await db
    .from('profiles')
    .select('id, email')
    .in('id', ownerIds);

  const emailMap: Record<string, string> = {};
  (ownerProfiles ?? []).forEach((p) => { emailMap[p.id] = p.email; });

  const enriched = (teams ?? []).map((t) => ({
    ...t,
    memberCount: countMap[t.id] ?? 0,
    ownerEmail: emailMap[t.created_by] ?? '—',
  }));

  return NextResponse.json({ teams: enriched });
}

/** POST /api/admin/teams — チームを手動作成 */
export async function POST(req: NextRequest) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { ownerEmail, teamName, plan } = await req.json() as {
    ownerEmail: string;
    teamName: string;
    plan: TeamPlan;
  };

  if (!ownerEmail || !teamName || !plan) {
    return NextResponse.json({ error: 'ownerEmail / teamName / plan は必須です' }, { status: 400 });
  }

  const validPlans: TeamPlan[] = ['team_s', 'team_m', 'team_l', 'team_pro'];
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: '無効なプランです' }, { status: 400 });
  }

  const db = createAdminClient();

  // オーナーのユーザーIDを取得
  const { data: ownerProfile } = await db
    .from('profiles')
    .select('id, email')
    .eq('email', ownerEmail)
    .single();

  if (!ownerProfile) {
    return NextResponse.json({ error: `メールアドレス「${ownerEmail}」のユーザーが見つかりません` }, { status: 404 });
  }

  const maxSeats = TEAM_PLAN_SEATS[plan] ?? 5;

  // チームを作成
  const { data: team, error: teamError } = await db
    .from('teams')
    .insert({
      name: teamName,
      created_by: ownerProfile.id,
      plan,
      max_seats: maxSeats,
    })
    .select()
    .single();

  if (teamError) return NextResponse.json({ error: teamError.message }, { status: 500 });

  // オーナーをチームメンバーに追加（active・owner）
  await db.from('team_members').insert({
    team_id: team.id,
    user_id: ownerProfile.id,
    role: 'owner',
    invited_email: ownerEmail,
    status: 'active',
  });

  return NextResponse.json({ ok: true, teamId: team.id });
}
