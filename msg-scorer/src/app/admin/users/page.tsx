'use client';
import { useEffect, useState, useCallback } from 'react';

type Plan = 'free' | 'pro' | 'team_s' | 'team_m' | 'team_l' | 'team_pro';

interface AdminUser {
  id: string;
  email: string;
  plan: Plan;
  created_at: string;
  scoresToday: number;
  hasExtensionToken: boolean;
  stripe_subscription_id: string | null;
}

const PLAN_OPTIONS: { value: Plan | ''; label: string }[] = [
  { value: '', label: '全プラン' },
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team_s', label: 'Team S' },
  { value: 'team_m', label: 'Team M' },
  { value: 'team_l', label: 'Team L' },
  { value: 'team_pro', label: 'Team Pro' },
];

// profiles.plan は free/pro のみ許可（チームプランはチームテーブルで管理）
const PROFILE_PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];

const PLAN_BADGE: Record<Plan, string> = {
  free: 'bg-stone-100 text-stone-500',
  pro: 'bg-indigo-100 text-indigo-700',
  team_s: 'bg-emerald-100 text-emerald-700',
  team_m: 'bg-emerald-100 text-emerald-700',
  team_l: 'bg-emerald-100 text-emerald-700',
  team_pro: 'bg-purple-100 text-purple-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<Plan | ''>('');
  const [actionError, setActionError] = useState('');

  // ダミー作成モーダル
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPlan, setNewPlan] = useState<Plan>('free');
  const [creating, setCreating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (planFilter) params.set('plan', planFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, [search, planFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function changePlan(id: string, plan: Plan) {
    setActionError('');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    if (!res.ok) { const d = await res.json(); setActionError(d.error); return; }
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, plan } : u));
  }

  async function revokeToken(id: string) {
    setActionError('');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revokeExtToken: true }),
    });
    if (!res.ok) { const d = await res.json(); setActionError(d.error); return; }
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, hasExtensionToken: false } : u));
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`${email} を削除しますか？この操作は取り消せません。`)) return;
    setActionError('');
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); setActionError(d.error); return; }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function createDummy() {
    if (!newEmail || !newPassword) return;
    setCreating(true);
    setActionError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, password: newPassword, plan: newPlan }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setActionError(data.error); return; }
    setShowCreate(false);
    setNewEmail(''); setNewPassword(''); setNewPlan('free');
    fetchUsers();
  }

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="メールで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 w-64"
        />
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value as Plan | '')}
          className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none"
        >
          {PLAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={fetchUsers}
          className="px-3 py-2 bg-stone-100 text-stone-600 text-sm rounded-lg hover:bg-stone-200 transition-colors"
        >
          更新
        </button>
        <div className="ml-auto">
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + アカウントを作成
          </button>
        </div>
      </div>

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>
      )}

      {/* ユーザーテーブル */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <span className="text-sm font-medium text-stone-700">ユーザー一覧</span>
          <span className="text-xs text-stone-400">{users.length} 件</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-stone-400 text-sm">読み込み中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                <tr>
                  {['メール', 'プラン', '作成日', '本日のスコア', '拡張トークン', '操作'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-stone-700 max-w-[200px] truncate">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={['free', 'pro'].includes(u.plan) ? u.plan : 'free'}
                        onChange={(e) => changePlan(u.id, e.target.value as Plan)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${PLAN_BADGE[u.plan]}`}
                        title={['free', 'pro'].includes(u.plan) ? '' : 'チームプランはチーム管理から変更してください'}
                      >
                        {PROFILE_PLAN_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap">
                      {u.created_at.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-700 text-center">
                      {u.scoresToday}
                    </td>
                    <td className="px-4 py-3">
                      {u.hasExtensionToken ? (
                        <button
                          onClick={() => revokeToken(u.id)}
                          className="text-xs text-amber-600 hover:text-amber-800 underline"
                        >
                          ✓ 失効
                        </button>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-stone-400 text-sm">
                      該当するユーザーが見つかりません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ダミーアカウント作成モーダル */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="font-bold text-stone-900">アカウントを作成</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="dummy@example.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">パスワード</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="min 6 chars"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">初期プラン</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as Plan)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none"
                >
                  {PROFILE_PLAN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {actionError && <p className="text-xs text-red-600">{actionError}</p>}
            <div className="flex gap-2 pt-2">
              <button
                onClick={createDummy}
                disabled={creating || !newEmail || !newPassword}
                className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {creating ? '作成中...' : '作成'}
              </button>
              <button
                onClick={() => { setShowCreate(false); setActionError(''); }}
                className="flex-1 py-2 bg-stone-100 text-stone-600 text-sm rounded-lg hover:bg-stone-200 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
