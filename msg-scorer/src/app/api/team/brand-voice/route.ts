import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId, getBrandVoice, upsertBrandVoice } from '@/lib/db/teams';

// ブランドボイス取得
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const brandVoice = await getBrandVoice(teamResult.team.id);
  return NextResponse.json({ brandVoice });
}

// ブランドボイス更新（Owner のみ）
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });
  if (teamResult.myMember.role !== 'owner') {
    return NextResponse.json({ error: '管理者のみが更新できます。' }, { status: 403 });
  }

  const body = await req.json();
  await upsertBrandVoice(teamResult.team.id, user.id, {
    tone: body.tone ?? undefined,
    ng_words: Array.isArray(body.ng_words) ? body.ng_words : [],
    required_checks: Array.isArray(body.required_checks) ? body.required_checks : [],
    subject_rules: body.subject_rules ?? undefined,
    min_score_threshold: body.min_score_threshold ? Number(body.min_score_threshold) : undefined,
    min_score_action: body.min_score_action === 'badge' ? 'badge' : 'warn',
  });

  return NextResponse.json({ ok: true });
}
