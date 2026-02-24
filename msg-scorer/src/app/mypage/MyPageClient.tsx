'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@supabase/supabase-js';
import { type HistoryRecord } from '@/lib/db/score-history';
import HistoryList from '@/components/history/HistoryList';
import ScoreTrend from '@/components/history/ScoreTrend';
import ExportCSVButton from '@/components/history/ExportCSVButton';
import ProfileSection from '@/components/settings/ProfileSection';
import PlanSection from '@/components/settings/PlanSection';
import NGWordsSection from '@/components/settings/NGWordsSection';
import ExtensionTokenSection from '@/components/settings/ExtensionTokenSection';
import AccountDeleteSection from '@/components/settings/AccountDeleteSection';
import CustomSegmentList from '@/components/scoring/CustomSegmentList';
import Link from 'next/link';

type Tab = 'history' | 'segments' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'history',  label: 'スコア履歴',   icon: '📋' },
  { id: 'segments', label: 'セグメント管理', icon: '🎯' },
  { id: 'settings', label: '設定',          icon: '⚙️' },
];

interface Props {
  user: User;
  profile: {
    id: string;
    email: string;
    plan: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    custom_ng_words: string[];
    extension_token_hash: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  history: HistoryRecord[];
  initialTab: string;
}

export default function MyPageClient({ user, profile, history, initialTab }: Props) {
  const router = useRouter();
  const validTab = (t: string): t is Tab => ['history', 'segments', 'settings'].includes(t);
  const [tab, setTab] = useState<Tab>(validTab(initialTab) ? initialTab : 'history');

  const handleTab = (t: Tab) => {
    setTab(t);
    router.replace(`/mypage?tab=${t}`, { scroll: false });
  };

  const isPro = profile?.plan === 'pro' || !!profile?.plan?.startsWith('team');

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-outfit font-bold text-2xl text-stone-900">マイページ</h1>
          <p className="text-stone-400 text-sm mt-0.5">{user.email}</p>
        </div>
        <Link
          href="/score"
          className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          + 新規スコアリング
        </Link>
      </div>

      {/* プラン・利用状況バッジ */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
          isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600'
        }`}>
          {isPro ? '✓ Proプラン' : 'Freeプラン'}
        </span>
        <span className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-stone-600">
          累計スコア: {history.length} 件
        </span>
        <span className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-stone-600">
          登録日: {profile?.created_at?.slice(0, 10) ?? '—'}
        </span>
      </div>

      {/* タブ */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              tab === id
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {tab === 'history' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <ExportCSVButton records={history} />
          </div>
          <ScoreTrend records={history} />
          <HistoryList records={history} />
        </div>
      )}

      {tab === 'segments' && (
        <div className="space-y-4">
          <p className="text-sm text-stone-500">
            保存したカスタムセグメントの確認・削除ができます。新しいセグメントはスコアリング画面から保存してください。
          </p>
          <CustomSegmentList refreshKey={0} />
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-5">
          <ProfileSection user={user} />
          <PlanSection isPro={isPro} />
          <ExtensionTokenSection hasToken={!!profile?.extension_token_hash} />
          <NGWordsSection initialWords={profile?.custom_ng_words ?? []} />
          <AccountDeleteSection />
        </div>
      )}
    </div>
  );
}
