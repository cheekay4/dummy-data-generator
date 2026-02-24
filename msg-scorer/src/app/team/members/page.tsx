'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeam } from '@/hooks/useTeam';
import { TeamMember } from '@/lib/types';

export default function MembersPage() {
  const { team, myMember, isOwner, loading } = useTeam();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!myMember || !isOwner)) {
      router.replace('/team');
    }
  }, [loading, myMember, isOwner, router]);

  if (loading || !team || !myMember) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 transition-colors">←</button>
          <h1 className="text-lg font-bold text-stone-900">👥 メンバー管理</h1>
        </div>
        <MembersManager teamId={team.id} maxSeats={team.max_seats} />
      </div>
    </div>
  );
}

function MembersManager({ teamId, maxSeats }: { teamId: string; maxSeats: number }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<{ url: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/team/members')
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, [teamId]);

  const activeCount = members.filter(m => ['active', 'pending'].includes(m.status)).length;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setInviting(true);
    setError('');
    setInviteUrl(null);
    const res = await fetch('/api/team/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'エラーが発生しました。');
    } else {
      const newMember = data.member as TeamMember;
      setMembers(prev => [...prev, newMember]);
      const urlRes = await fetch('/api/team/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: newMember.id }),
      });
      if (urlRes.ok) {
        const urlData = await urlRes.json();
        setInviteUrl({ url: urlData.inviteUrl, email: newEmail });
      }
      setNewEmail('');
    }
    setInviting(false);
  }

  async function handleAction(memberId: string, action: 'remove' | 'cancel' | 'resend') {
    const res = await fetch('/api/team/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, action }),
    });
    if (res.ok) {
      if (action === 'remove') {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'removed' as const } : m));
      } else if (action === 'cancel') {
        setMembers(prev => prev.filter(m => m.id !== memberId));
      } else if (action === 'resend') {
        const urlRes = await fetch('/api/team/members/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberId }),
        });
        if (urlRes.ok) {
          const urlData = await urlRes.json();
          setInviteUrl({ url: urlData.inviteUrl, email: '' });
        }
      }
    }
  }

  if (loading) return <div className="text-center text-stone-400 py-8">読み込み中...</div>;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
      <p className="text-sm text-stone-400 font-medium">{activeCount}/{maxSeats}席 使用中</p>

      {/* アクティブメンバー */}
      {members.filter(m => m.status === 'active').length > 0 && (
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wider font-medium mb-2">アクティブメンバー</p>
          <div className="space-y-2">
            {members.filter(m => m.status === 'active').map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span>👤</span>
                  <div>
                    <p className="text-sm text-stone-800">{m.invited_email}</p>
                    <p className="text-xs text-stone-400">{m.role === 'owner' ? 'オーナー' : 'メンバー'}</p>
                  </div>
                </div>
                {m.role !== 'owner' && (
                  <button onClick={() => handleAction(m.id, 'remove')} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 招待中 */}
      {members.some(m => m.status === 'pending') && (
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wider font-medium mb-2">招待中</p>
          <div className="space-y-2">
            {members.filter(m => m.status === 'pending').map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 border border-dashed border-stone-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <p className="text-sm text-stone-600">{m.invited_email}</p>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">招待中</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleAction(m.id, 'resend')} className="text-xs text-indigo-600 hover:underline">再送</button>
                  <button onClick={() => handleAction(m.id, 'cancel')} className="text-xs text-red-500 hover:underline">取消</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 招待フォーム */}
      {activeCount < maxSeats ? (
        <div>
          <p className="text-xs text-stone-400 mb-2">メンバーを招待（残り{maxSeats - activeCount}席）</p>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="member@example.com"
              className="flex-1 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              disabled={inviting}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {inviting ? '招待中...' : '招待する'}
            </button>
          </form>
          {error && <p className="text-xs text-red-600 mt-2">⚠️ {error}</p>}
        </div>
      ) : (
        <p className="text-sm text-stone-400 text-center py-2">席数の上限に達しています</p>
      )}

      {/* 招待URL */}
      {inviteUrl && (
        <div className="p-4 bg-indigo-50 rounded-xl">
          <p className="text-xs text-indigo-700 mb-2">招待リンクをコピーして共有してください:</p>
          <div className="flex gap-2">
            <input readOnly value={inviteUrl.url} className="flex-1 text-xs border border-indigo-200 rounded-lg px-3 py-1.5 bg-white" />
            <button
              onClick={() => { navigator.clipboard.writeText(inviteUrl.url); setInviteUrl(null); }}
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              コピー
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
