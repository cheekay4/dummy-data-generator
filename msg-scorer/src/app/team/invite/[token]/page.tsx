'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [inviteInfo, setInviteInfo] = useState<{ teamName: string; invitedEmail: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      // 招待情報を取得
      const res = await fetch(`/api/team/invite/verify?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setInviteInfo(data);
      } else {
        setError('招待リンクが無効か、既に使用済みです。');
      }
      setLoading(false);
    }
    init();
  }, [token]);

  async function handleJoin() {
    setJoining(true);
    setError('');
    try {
      const res = await fetch('/api/team/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました。');
        return;
      }
      router.push('/team');
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 max-w-md w-full text-center">
          <p className="text-2xl mb-4">⚠️</p>
          <p className="text-stone-700">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            トップページへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 max-w-md w-full text-center">
        <span className="text-indigo-600 text-2xl font-bold font-outfit">◆</span>
        <h1 className="text-xl font-bold text-stone-900 mt-3 mb-2">チームへの招待</h1>
        {inviteInfo && (
          <p className="text-stone-600 mb-6">
            <span className="font-semibold text-stone-900">{inviteInfo.teamName}</span> チームに招待されています
          </p>
        )}

        {!isLoggedIn ? (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">参加するにはログインが必要です</p>
            <Link
              href={`/login?redirect=/team/invite/${token}`}
              className="block w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              ログインして参加する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {joining ? '参加中...' : 'チームに参加する'}
            </button>
            {error && <p className="text-sm text-red-600">⚠️ {error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
