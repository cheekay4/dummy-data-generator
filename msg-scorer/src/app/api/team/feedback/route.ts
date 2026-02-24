import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';
import { getTeamFeedbackStats } from '@/lib/db/feedback';
import { getPlanLimits } from '@/lib/plan';
import type { Plan } from '@/lib/plan';

// GET /api/team/feedback — チームフィードバック統計（Team Pro・オーナーのみ）
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '未認証' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult?.team || teamResult?.myMember?.role !== 'owner') {
    return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
  }

  const limits = getPlanLimits(teamResult.team.plan as Plan);
  if (!limits.teamProFeatures) {
    return NextResponse.json({ error: 'Team Proプランが必要です' }, { status: 403 });
  }

  const stats = await getTeamFeedbackStats(teamResult.team.id);
  return NextResponse.json({ stats });
}
