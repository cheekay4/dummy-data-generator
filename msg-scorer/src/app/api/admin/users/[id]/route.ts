import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Plan } from '@/lib/plan';

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/users/[id] — プラン変更・トークン失効など */
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { plan?: Plan; revokeExtToken?: boolean };
  const db = createAdminClient();
  const updates: Record<string, unknown> = {};

  if (body.plan) {
    if (!['free', 'pro'].includes(body.plan)) {
      return NextResponse.json({ error: 'プロフィールに設定できるプランは free か pro のみです。チームプランはチーム管理から変更してください。' }, { status: 400 });
    }
    updates.plan = body.plan;
  }
  if (body.revokeExtToken) updates.extension_token_hash = null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '更新フィールドがありません' }, { status: 400 });
  }

  const { error } = await db.from('profiles').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/users/[id] — ユーザー削除 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const db = createAdminClient();

  // Auth ユーザー削除（profiles は cascade で消える想定、なければ個別削除）
  const { error } = await db.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // profiles を明示的に削除（cascade がない場合の保険）
  await db.from('profiles').delete().eq('id', id);

  return NextResponse.json({ ok: true });
}
