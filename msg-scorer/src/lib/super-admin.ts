import { createClient } from '@/lib/supabase/server';

/** ログイン中のユーザーがスーパー管理者かを確認する */
export async function getSuperAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) return null;
  return user;
}

/** API ルート用：スーパー管理者でなければ 403 を返す */
export async function requireSuperAdminApi(): Promise<{ userId: string } | null> {
  const user = await getSuperAdminUser();
  if (!user) return null;
  return { userId: user.id };
}
