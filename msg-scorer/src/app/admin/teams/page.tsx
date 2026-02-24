'use client';
import { useEffect, useState } from 'react';

type TeamPlan = 'team_s' | 'team_m' | 'team_l' | 'team_pro';

interface AdminTeam {
  id: string;
  name: string;
  plan: TeamPlan;
  ownerEmail: string;
  memberCount: number;
  created_at: string;
  stripe_subscription_id: string | null;
}

const PLAN_OPTS: { value: TeamPlan; label: string }[] = [
  { value: 'team_s',   label: 'Team S（5席）' },
  { value: 'team_m',   label: 'Team M（10席）' },
  { value: 'team_l',   label: 'Team L（30席）' },
  { value: 'team_pro', label: 'Team Pro（30席）' },
];

const PLAN_BADGE: Record<TeamPlan, string> = {
  team_s:   'bg-emerald-100 text-emerald-700',
  team_m:   'bg-emerald-100 text-emerald-700',
  team_l:   'bg-teal-100 text-teal-700',
  team_pro: 'bg-purple-100 text-purple-700',
};

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  // チーム作成モーダル
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName]     = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newPlan, setNewPlan]             = useState<TeamPlan>('team_s');
  const [creating, setCreating]           = useState(false);

  async function fetchTeams() {
    setLoading(true);
    const res = await fetch('/api/admin/teams');
    const data = await res.json();
    setTeams(data.teams ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchTeams(); }, []);

  async function changePlan(id: string, plan: TeamPlan) {
    setActionError('');
    const res = await fetch(`/api/admin/teams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    if (!res.ok) { const d = await res.json(); setActionError(d.error); return; }
    setTeams((prev) => prev.map((t) => t.id === id ? { ...t, plan } : t));
  }

  async function deleteTeam(id: string, name: string) {
    if (!confirm(`チーム「${name}」を削除しますか？メンバーのチーム所属も解除されます。`)) return;
    setActionError('');
    const res = await fetch(`/api/admin/teams/${id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); setActionError(d.error); return; }
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }

  async function createTeam() {
    if (!newTeamName || !newOwnerEmail) return;
    setCreating(true);
    setActionError('');
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerEmail: newOwnerEmail, teamName: newTeamName, plan: newPlan }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setActionError(data.error); return; }
    setShowCreate(false);
    setNewTeamName(''); setNewOwnerEmail(''); setNewPlan('team_s');
    fetchTeams();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-500">{teams.length} チーム</span>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTeams}
            className="px-3 py-2 bg-stone-100 text-stone-600 text-sm rounded-lg hover:bg-stone-200 transition-colors"
          >
            更新
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            + チームを作成
          </button>
        </div>
      </div>

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-400 text-sm">読み込み中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                <tr>
                  {['チーム名', 'プラン', 'オーナー', 'メンバー数', '作成日', 'Stripe', '操作'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-800">{t.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={t.plan}
                        onChange={(e) => changePlan(t.id, e.target.value as TeamPlan)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${PLAN_BADGE[t.plan]}`}
                      >
                        {PLAN_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 max-w-[160px] truncate">{t.ownerEmail}</td>
                    <td className="px-4 py-3 text-xs text-center text-stone-700">{t.memberCount}</td>
                    <td className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap">{t.created_at.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-xs">
                      {t.stripe_subscription_id ? (
                        <span className="text-emerald-600 font-medium">✓ サブスク</span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteTeam(t.id, t.name)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">
                      チームがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* チーム作成モーダル */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div>
              <h2 className="font-bold text-stone-900">チームを作成</h2>
              <p className="text-xs text-stone-400 mt-1">
                オーナーは事前に「ユーザー管理」でアカウントを作成しておいてください。
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">チーム名</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="例: 株式会社サンプル"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">オーナーのメールアドレス</label>
                <input
                  type="email"
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">プラン</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as TeamPlan)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none"
                >
                  {PLAN_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {actionError && <p className="text-xs text-red-600">{actionError}</p>}
            <div className="flex gap-2 pt-2">
              <button
                onClick={createTeam}
                disabled={creating || !newTeamName || !newOwnerEmail}
                className="flex-1 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
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
