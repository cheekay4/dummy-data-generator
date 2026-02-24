import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';
import ProfileSection from '@/components/settings/ProfileSection';
import PlanSection from '@/components/settings/PlanSection';
import NGWordsSection from '@/components/settings/NGWordsSection';
import ExtensionTokenSection from '@/components/settings/ExtensionTokenSection';
import AccountDeleteSection from '@/components/settings/AccountDeleteSection';

export const metadata = { title: '設定' };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  const isPro = profile?.plan === 'pro';
  const params = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-5">
      <h1 className="font-outfit font-bold text-2xl text-stone-900">設定</h1>

      {params.upgraded && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
          🎉 Proプランへのアップグレードが完了しました！
        </div>
      )}

      <ProfileSection user={user} />
      <PlanSection isPro={isPro} />
      <ExtensionTokenSection hasToken={!!profile?.extension_token_hash} />
      <NGWordsSection initialWords={profile?.custom_ng_words ?? []} />
      <AccountDeleteSection />
    </div>
  );
}
