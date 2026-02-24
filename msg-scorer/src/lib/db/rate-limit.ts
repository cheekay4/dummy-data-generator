import { createAdminClient } from '@/lib/supabase/admin';

interface UsageRow { id: string; count: number; }

export async function checkAndIncrementUsage(
  userId: string | null,
  ip: string,
  dailyLimit: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (dailyLimit === -1) return { allowed: true, remaining: 999 };

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  let data: UsageRow | null = null;

  if (userId) {
    const res = await supabase
      .from('daily_usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('date', today)
      .is('ip', null)
      .maybeSingle();
    data = res.data as UsageRow | null;
  } else {
    const res = await supabase
      .from('daily_usage')
      .select('id, count')
      .eq('ip', ip)
      .eq('date', today)
      .is('user_id', null)
      .maybeSingle();
    data = res.data as UsageRow | null;
  }

  const currentCount = data?.count ?? 0;
  if (currentCount >= dailyLimit) return { allowed: false, remaining: 0 };

  if (data) {
    await supabase.from('daily_usage').update({ count: currentCount + 1 }).eq('id', data.id);
  } else {
    const row = userId
      ? { user_id: userId, date: today, count: 1 }
      : { ip, date: today, count: 1 };
    await supabase.from('daily_usage').insert(row);
  }

  return { allowed: true, remaining: dailyLimit - (currentCount + 1) };
}
