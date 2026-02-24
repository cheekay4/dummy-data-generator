import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Plan } from '@/lib/plan';

/** GET /api/admin/users?search=&plan= */
export async function GET(req: NextRequest) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const planFilter = searchParams.get('plan') ?? '';

  const db = createAdminClient();
  let query = db
    .from('profiles')
    .select('id, email, plan, created_at, custom_ng_words, extension_token_hash, stripe_subscription_id')
    .order('created_at', { ascending: false })
    .limit(200);

  if (planFilter) query = query.eq('plan', planFilter);
  if (search) query = query.ilike('email', `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 日次スコア数を別途取得してマージ
  const today = new Date().toISOString().split('T')[0];
  const ids = (data ?? []).map((u) => u.id);
  const { data: usages } = await db
    .from('daily_usage')
    .select('user_id, count')
    .eq('date', today)
    .in('user_id', ids);

  const usageMap: Record<string, number> = {};
  (usages ?? []).forEach((u) => {
    if (u.user_id) usageMap[u.user_id as string] = u.count as number;
  });

  const users = (data ?? []).map((u) => ({
    ...u,
    scoresToday: usageMap[u.id] ?? 0,
    hasExtensionToken: !!u.extension_token_hash,
    extension_token_hash: undefined, // ハッシュは返さない
  }));

  return NextResponse.json({ users });
}

/** POST /api/admin/users — ダミーアカウント作成 */
export async function POST(req: NextRequest) {
  if (!await requireSuperAdminApi()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password, plan } = await req.json() as { email: string; password: string; plan: Plan };
  if (!email || !password) {
    return NextResponse.json({ error: 'email と password は必須です' }, { status: 400 });
  }

  const db = createAdminClient();

  // Supabase Auth にユーザー作成（メール確認スキップ）
  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  const userId = authData.user.id;

  // profiles に upsert（trigger がなかった場合の保険）
  await db.from('profiles').upsert({
    id: userId,
    email,
    plan: plan ?? 'free',
    custom_ng_words: [],
  });

  return NextResponse.json({ ok: true, userId });
}
