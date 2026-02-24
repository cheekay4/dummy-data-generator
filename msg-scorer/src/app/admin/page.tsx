import { createAdminClient } from '@/lib/supabase/admin';

async function getStats() {
  const db = createAdminClient();

  // プラン別ユーザー数
  const { data: profiles } = await db.from('profiles').select('plan, created_at');
  const planCounts: Record<string, number> = {};
  let newUsersThisWeek = 0;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  (profiles ?? []).forEach((p) => {
    planCounts[p.plan] = (planCounts[p.plan] ?? 0) + 1;
    if (p.created_at > weekAgo) newUsersThisWeek++;
  });
  const totalUsers = profiles?.length ?? 0;

  // チーム数
  const { count: totalTeams } = await db.from('teams').select('*', { count: 'exact', head: true });

  // 本日のスコア数
  const today = new Date().toISOString().split('T')[0];
  const { data: usageRows } = await db.from('daily_usage').select('count').eq('date', today);
  const scoresToday = (usageRows ?? []).reduce((sum, r) => sum + (r.count as number), 0);

  // 今月のスコア数
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const { data: monthRows } = await db.from('daily_usage').select('count').gte('date', monthStart);
  const scoresThisMonth = (monthRows ?? []).reduce((sum, r) => sum + (r.count as number), 0);

  return { totalUsers, planCounts, totalTeams: totalTeams ?? 0, scoresToday, scoresThisMonth, newUsersThisWeek };
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free', pro: 'Pro',
  team_s: 'Team S', team_m: 'Team M', team_l: 'Team L', team_pro: 'Team Pro',
};
const PLAN_COLORS: Record<string, string> = {
  free: 'bg-stone-100 text-stone-600',
  pro: 'bg-indigo-100 text-indigo-700',
  team_s: 'bg-emerald-100 text-emerald-700',
  team_m: 'bg-emerald-100 text-emerald-700',
  team_l: 'bg-emerald-100 text-emerald-700',
  team_pro: 'bg-purple-100 text-purple-700',
};

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* KPI カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '総ユーザー数', value: stats.totalUsers, sub: `今週 +${stats.newUsersThisWeek}` },
          { label: '総チーム数',   value: stats.totalTeams, sub: '' },
          { label: '本日のスコア', value: stats.scoresToday, sub: '全ユーザー合計' },
          { label: '今月のスコア', value: stats.scoresThisMonth, sub: '全ユーザー合計' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-xs text-stone-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-stone-900 font-outfit">{value.toLocaleString()}</p>
            {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* プラン内訳 */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h2 className="font-semibold text-stone-800 mb-4">プラン内訳</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.planCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([plan, count]) => (
              <div key={plan} className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_COLORS[plan] ?? 'bg-stone-100 text-stone-600'}`}>
                  {PLAN_LABELS[plan] ?? plan}
                </span>
                <span className="text-sm font-bold text-stone-700">{count}</span>
                <span className="text-xs text-stone-400">
                  ({Math.round(count / stats.totalUsers * 100)}%)
                </span>
              </div>
            ))}
        </div>
        {/* プログレスバー */}
        <div className="mt-4 h-3 flex rounded-full overflow-hidden bg-stone-100">
          {Object.entries(stats.planCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([plan, count]) => {
              const colors: Record<string, string> = {
                free: '#e7e5e4', pro: '#6366f1',
                team_s: '#34d399', team_m: '#10b981', team_l: '#059669', team_pro: '#a855f7',
              };
              const width = (count / stats.totalUsers * 100).toFixed(1);
              return (
                <div
                  key={plan}
                  title={`${PLAN_LABELS[plan] ?? plan}: ${count}`}
                  style={{ width: `${width}%`, background: colors[plan] ?? '#9ca3af' }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
