import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TeamPlan } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/teams/[id] — プラン変更 */
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { plan?: TeamPlan };
  if (!body.plan) return NextResponse.json({ error: 'plan が必要です' }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from('teams').update({ plan: body.plan }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/teams/[id] — チーム削除 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const db = createAdminClient();

  // 関連レコードを先に削除
  await db.from('team_members').delete().eq('team_id', id);
  await db.from('brand_voice').delete().eq('team_id', id);
  await db.from('team_presets').delete().eq('team_id', id);

  const { error } = await db.from('teams').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
