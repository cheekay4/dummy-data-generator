import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import { getHistory } from '@/lib/db/score-history';
import MyPageClient from './MyPageClient';

export const metadata = { title: 'マイページ' };

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [profile, history, params] = await Promise.all([
    getProfile(user.id),
    getHistory(user.id),
    searchParams,
  ]);

  const tab = params.tab ?? 'history';

  return (
    <MyPageClient
      user={user}
      profile={profile}
      history={history}
      initialTab={tab}
    />
  );
}
