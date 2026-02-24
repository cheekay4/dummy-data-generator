'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTeam } from '@/hooks/useTeam';
import { TeamStats, RevisionRequest } from '@/lib/types';
import dynamic from 'next/dynamic';

const TeamScoreTrend = dynamic(() => import('@/components/team/TeamScoreTrend'), { ssr: false });
const PersonalVsTeamRadar = dynamic(() => import('@/components/team/PersonalVsTeamRadar'), { ssr: false });
const FeedbackTrend = dynamic(() => import('@/components/team/FeedbackTrend'), { ssr: false });

type Period = 7 | 30 | 90;

interface AxisAvg { name: string; avg: number }
interface HistoryPoint { userId: string; totalScore: number; axes: { name: string; score: number }[]; createdAt: string }

export default function TeamDashboardPage() {
  const { team, myMember, isOwner, loading } = useTeam();
  const [period, setPeriod] = useState<Period>(30);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [teamAxisAverages, setTeamAxisAverages] = useState<AxisAvg[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [minThreshold, setMinThreshold] = useState<number | undefined>();
  const [revisions, setRevisions] = useState<RevisionRequest[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'members' | 'brand' | 'settings' | 'feedback'>('stats');

  useEffect(() => {
    if (!team) return;
    setStatsLoading(true);
    Promise.all([
      fetch(`/api/team/stats?days=${period}`).then(r => r.json()),
      fetch('/api/team/revision').then(r => r.json()),
    ]).then(([statsData, revData]) => {
      setStats(statsData.stats);
      setTeamAxisAverages(statsData.teamAxisAverages ?? []);
      setHistory(statsData.history ?? []);
      setMinThreshold(statsData.minThreshold);
      setRevisions(revData.revisions ?? []);
    }).finally(() => setStatsLoading(false));
  }, [team, period]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">読み込み中...</p>
      </div>
    );
  }

  if (!team || !myMember) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-stone-600 mb-4">チームに所属していません</p>
          <Link href="/pricing" className="text-indigo-600 hover:underline text-sm">
            Teamプランを確認する
          </Link>
        </div>
      </div>
    );
  }

  // チームスコア推移グラフ用データ変換
  const memberEmails = stats?.memberStats.map(m => m.email) ?? [];
  type TrendPoint = { date: string; [key: string]: string | number };
  const trendData: TrendPoint[] = (() => {
    const byDate: Record<string, Record<string, number[]>> = {};
    history.forEach(h => {
      const date = h.createdAt.slice(0, 10);
      if (!byDate[date]) byDate[date] = {};
      const memberStat = stats?.memberStats.find(m => m.userId === h.userId);
      const email = memberStat?.email ?? h.userId;
      if (!byDate[date][email]) byDate[date][email] = [];
      byDate[date][email].push(h.totalScore);
    });
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, members]) => {
      const point: TrendPoint = { date: date.slice(5) };
      let teamTotal = 0;
      let teamCount = 0;
      Object.entries(members).forEach(([email, scores]) => {
        const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
        point[email] = avg;
        teamTotal += avg;
        teamCount++;
      });
      if (teamCount > 0) point['チーム平均'] = Math.round(teamTotal / teamCount);
      return point;
    });
  })();

  // 個人 vs チーム平均レーダーデータ
  const myUserId = myMember.user_id;
  const myStat = stats?.memberStats.find(m => m.userId === myUserId);
  const radarData = teamAxisAverages.map(ta => ({
    name: ta.name,
    personal: myStat?.axisAverages.find(a => a.name === ta.name)?.avg ?? 0,
    team: ta.avg,
  }));

  const openRevisions = revisions.filter(r => r.status === 'open');

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              ◆ {team.name}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${team.plan === 'team_pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {team.plan === 'team_s' ? 'Team S' : team.plan === 'team_m' ? 'Team M' : team.plan === 'team_l' ? 'Team L' : 'Team Pro'} ({team.max_seats}席)
              </span>
            </h1>
            {openRevisions.length > 0 && (
              <p className="text-sm text-amber-600 mt-1">🔔 {openRevisions.length}件の修正依頼</p>
            )}
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit flex-wrap">
          {(isOwner
            ? [['stats', '📊 統計'], ['members', '👥 メンバー'], ['brand', '🎨 ブランド設定'], ['settings', '⚙️ 設定']]
            : [['stats', '📊 自分のスコア'], ['brand', '📋 共有プリセット']]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {label}
            </button>
          ))}
          {isOwner && team.plan === 'team_pro' && (
            <>
              <Link
                href="/team/import"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-stone-500 hover:text-stone-700 hover:bg-white/60"
              >
                📥 インポート
              </Link>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'feedback' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                💬 フィードバック
              </button>
            </>
          )}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 期間選択 */}
            <div className="flex gap-2">
              {([7, 30, 90] as Period[]).map(d => (
                <button
                  key={d}
                  onClick={() => setPeriod(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    period === d ? 'bg-indigo-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-indigo-300'
                  }`}
                >
                  直近{d}日
                </button>
              ))}
            </div>

            {statsLoading ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-sm">
                データを読み込み中...
              </div>
            ) : (
              <>
                {/* サマリーカード */}
                {isOwner && stats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-stone-200 p-5">
                      <p className="text-xs text-stone-400 mb-1">スコアリング実行数</p>
                      <p className="text-2xl font-bold text-stone-900">{stats.totalScores}<span className="text-sm text-stone-400 ml-1">回</span></p>
                    </div>
                    <div className="bg-white rounded-2xl border border-stone-200 p-5">
                      <p className="text-xs text-stone-400 mb-1">チーム平均スコア</p>
                      <p className="text-2xl font-bold text-stone-900">
                        {stats.avgScore}
                        {stats.avgScorePrevMonth > 0 && (
                          <span className={`text-sm ml-1 ${stats.avgScore >= stats.avgScorePrevMonth ? 'text-emerald-600' : 'text-red-500'}`}>
                            {stats.avgScore >= stats.avgScorePrevMonth ? '+' : ''}{stats.avgScore - stats.avgScorePrevMonth} 先月比
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-stone-200 p-5">
                      <p className="text-xs text-stone-400 mb-1">最低ライン未達率</p>
                      <p className="text-2xl font-bold text-stone-900">{stats.belowThresholdRate}<span className="text-sm text-stone-400 ml-1">%</span></p>
                    </div>
                  </div>
                )}

                {/* メンバー別（管理者） */}
                {isOwner && stats && stats.memberStats.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-sm font-semibold text-stone-700 mb-4">メンバー別</h2>
                    <div className="space-y-3">
                      {stats.memberStats.map(m => (
                        <div key={m.userId} className="flex items-center gap-4">
                          <span className="text-stone-600 text-sm w-32 truncate">{m.email.split('@')[0]}</span>
                          <span className="text-xs text-stone-400 w-12">{m.scoreCount}回</span>
                          <span className="text-xs font-medium text-stone-700 w-16">平均{m.avgScore}</span>
                          <div className="flex-1 bg-stone-100 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${(m.avgScore / 100) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* スコア推移グラフ */}
                {trendData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-sm font-semibold text-stone-700 mb-4">
                      {isOwner ? 'スコア推移（チーム）' : 'スコア推移'}
                    </h2>
                    <TeamScoreTrend data={trendData} memberEmails={memberEmails} minThreshold={minThreshold} />
                  </div>
                )}

                {/* 個人 vs チーム平均（メンバー） */}
                {!isOwner && radarData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-sm font-semibold text-stone-700 mb-4">自分 vs チーム平均</h2>
                    {myStat && (
                      <div className="flex gap-6 text-sm mb-4">
                        <span className="text-stone-500">今月: <span className="font-medium text-stone-800">{myStat.scoreCount}回</span></span>
                        <span className="text-stone-500">平均スコア: <span className="font-medium text-stone-800">{myStat.avgScore}</span></span>
                        <span className="text-stone-500">チーム平均: <span className="font-medium text-stone-800">{stats?.avgScore}</span></span>
                      </div>
                    )}
                    <PersonalVsTeamRadar data={radarData} />
                  </div>
                )}

                {/* 修正依頼 */}
                {openRevisions.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-sm font-semibold text-stone-700 mb-4">修正依頼</h2>
                    <div className="space-y-3">
                      {revisions.slice(0, 5).map(r => (
                        <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl ${r.status === 'open' ? 'bg-amber-50' : 'bg-stone-50'}`}>
                          <span>{r.status === 'open' ? '⚠️' : '✅'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-stone-700">{r.comment}</p>
                            {r.score_history && (
                              <p className="text-xs text-stone-400 mt-0.5">
                                スコア {r.score_history.result.totalScore} / {r.score_history.channel}
                              </p>
                            )}
                          </div>
                          {r.status === 'open' && r.assigned_to === myUserId && (
                            <RevisionResolveButton revisionId={r.id} onResolved={() => {
                              setRevisions(prev => prev.map(rv => rv.id === r.id ? { ...rv, status: 'resolved' as const } : rv));
                            }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Members Tab (Owner only) */}
        {activeTab === 'members' && isOwner && (
          <MembersTab teamId={team.id} maxSeats={team.max_seats} />
        )}

        {/* Brand Tab */}
        {activeTab === 'brand' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-700">ブランドボイス設定</h2>
              {isOwner && (
                <Link href="/team/brand" className="text-sm text-indigo-600 hover:underline">
                  編集する →
                </Link>
              )}
            </div>
            <p className="text-sm text-stone-500">
              {isOwner
                ? 'スコアリング時に自動適用されるブランドガイドラインを設定します。'
                : '管理者が設定したブランドガイドラインがスコアリングに反映されています。'}
            </p>
          </div>
        )}

        {/* Feedback Tab (Team Pro・Owner only) */}
        {activeTab === 'feedback' && isOwner && team.plan === 'team_pro' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-stone-800">フィードバック傾向</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  メンバーがスコアリング結果に送ったフィードバックの集計です。
                </p>
              </div>
            </div>
            <FeedbackTrend />
          </div>
        )}

        {/* Settings Tab (Owner only) */}
        {activeTab === 'settings' && isOwner && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">チーム設定</h2>
              <div className="space-y-3">
                <Link href="/team/brand" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <span className="text-sm text-stone-700">🎨 ブランドボイス設定</span>
                  <span className="text-stone-400 text-sm">→</span>
                </Link>
                <Link href="/team/members" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <span className="text-sm text-stone-700">👥 メンバー管理</span>
                  <span className="text-stone-400 text-sm">→</span>
                </Link>
                <Link href="/team/settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <span className="text-sm text-stone-700">💳 プラン・請求書</span>
                  <span className="text-stone-400 text-sm">→</span>
                </Link>
                {team.plan === 'team_pro' && (
                  <>
                    <Link href="/team/settings/slack" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <span className="text-sm text-stone-700">🔔 Slack連携設定</span>
                      <span className="text-stone-400 text-sm">→</span>
                    </Link>
                    <Link href="/team/settings/api" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <span className="text-sm text-stone-700">🔑 APIキー管理</span>
                      <span className="text-stone-400 text-sm">→</span>
                    </Link>
                    <Link href="/team/import/history" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <span className="text-sm text-stone-700">📥 インポート履歴</span>
                      <span className="text-stone-400 text-sm">→</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RevisionResolveButton({ revisionId, onResolved }: { revisionId: string; onResolved: () => void }) {
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    await fetch('/api/team/revision', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisionId }),
    });
    setLoading(false);
    onResolved();
  }
  return (
    <button
      onClick={handle}
      disabled={loading}
      className="shrink-0 text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1.5 rounded-lg transition-colors"
    >
      対応済みにする
    </button>
  );
}

function MembersTab({ teamId, maxSeats }: { teamId: string; maxSeats: number }) {
  const [members, setMembers] = useState<import('@/lib/types').TeamMember[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team/members')
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, [teamId]);

  const activeCount = members.filter(m => m.status !== 'removed').length;

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
      const newMember = data.member as import('@/lib/types').TeamMember;
      setMembers(prev => [...prev, newMember]);

      // 招待URL取得
      const urlRes = await fetch('/api/team/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: newMember.id }),
      });
      if (urlRes.ok) {
        const urlData = await urlRes.json();
        setInviteUrl(urlData.inviteUrl);
        setInviteEmail(newEmail);
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
        const data = await res.json();
        const urlRes = await fetch('/api/team/members/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberId }),
        });
        if (urlRes.ok) {
          const urlData = await urlRes.json();
          setInviteUrl(urlData.inviteUrl);
          setInviteEmail(data.member?.invited_email ?? '');
        }
      }
    }
  }

  if (loading) return <div className="text-center text-stone-400 text-sm py-8">読み込み中...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">
          👥 メンバー管理 — {activeCount}/{maxSeats}席 使用中
        </h2>

        {/* アクティブメンバー */}
        <div className="space-y-2 mb-4">
          {members.filter(m => m.status === 'active').map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-stone-600">👤</span>
                <div>
                  <p className="text-sm text-stone-800">{m.invited_email}</p>
                  <p className="text-xs text-stone-400">{m.role === 'owner' ? 'オーナー' : 'メンバー'}</p>
                </div>
              </div>
              {m.role !== 'owner' && (
                <button
                  onClick={() => handleAction(m.id, 'remove')}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 招待中 */}
        {members.some(m => m.status === 'pending') && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">招待中</p>
            {members.filter(m => m.status === 'pending').map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 border border-dashed border-stone-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <p className="text-sm text-stone-600">{m.invited_email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(m.id, 'resend')} className="text-xs text-indigo-600 hover:underline">再送</button>
                  <button onClick={() => handleAction(m.id, 'cancel')} className="text-xs text-red-500 hover:underline">取消</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 招待フォーム */}
        {activeCount < maxSeats && (
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
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {inviting ? '招待中...' : '招待する'}
            </button>
          </form>
        )}
        {error && <p className="text-xs text-red-600 mt-2">⚠️ {error}</p>}

        {/* 招待URL表示 */}
        {inviteUrl && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <p className="text-xs text-indigo-700 mb-2">
              📧 {inviteEmail} への招待リンクをコピーして共有してください:
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={inviteUrl}
                className="flex-1 text-xs border border-indigo-200 rounded-lg px-3 py-1.5 bg-white"
              />
              <button
                onClick={() => { navigator.clipboard.writeText(inviteUrl); setInviteUrl(null); }}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                コピー
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
