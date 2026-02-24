import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId, getTeamMembers, getTeamScoreHistory, getBrandVoice } from '@/lib/db/teams';
import { MemberStat, TeamStats } from '@/lib/types';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '30', 10);
  const prevDays = days * 2;

  const [history, members, brandVoice] = await Promise.all([
    getTeamScoreHistory(teamResult.team.id, days),
    getTeamMembers(teamResult.team.id),
    getBrandVoice(teamResult.team.id),
  ]);

  const prevHistory = await getTeamScoreHistory(teamResult.team.id, prevDays);
  const prevOnlyHistory = prevHistory.filter(h => {
    const date = new Date(h.createdAt);
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return date < cutoff;
  });

  const minThreshold = brandVoice?.min_score_threshold;
  const activeMembers = members.filter(m => m.status === 'active');

  // チーム全体統計
  const totalScores = history.length;
  const avgScore = totalScores > 0
    ? Math.round(history.reduce((s, h) => s + h.totalScore, 0) / totalScores)
    : 0;
  const prevAvg = prevOnlyHistory.length > 0
    ? Math.round(prevOnlyHistory.reduce((s, h) => s + h.totalScore, 0) / prevOnlyHistory.length)
    : 0;
  const belowThresholdCount = minThreshold
    ? history.filter(h => h.totalScore < minThreshold).length
    : 0;
  const belowThresholdRate = totalScores > 0
    ? Math.round((belowThresholdCount / totalScores) * 100)
    : 0;

  // メンバー別統計
  const memberStats: MemberStat[] = activeMembers.map(member => {
    if (!member.user_id) return null;
    const mHistory = history.filter(h => h.userId === member.user_id);
    const mPrevHistory = prevOnlyHistory.filter(h => h.userId === member.user_id);
    const scoreCount = mHistory.length;
    const mAvg = scoreCount > 0
      ? Math.round(mHistory.reduce((s, h) => s + h.totalScore, 0) / scoreCount)
      : 0;
    const mPrevAvg = mPrevHistory.length > 0
      ? Math.round(mPrevHistory.reduce((s, h) => s + h.totalScore, 0) / mPrevHistory.length)
      : 0;
    const mBelow = minThreshold
      ? Math.round((mHistory.filter(h => h.totalScore < minThreshold).length / Math.max(1, scoreCount)) * 100)
      : 0;

    // 5軸平均
    const axisNames = ['開封誘引力', '読了性', 'CTA強度', 'ターゲット適合度', '配信適正'];
    const axisAverages = axisNames.map(name => {
      const scores = mHistory.flatMap(h => h.axes.filter(a => a.name === name).map(a => a.score));
      const avg = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
      return { name, avg };
    });

    return {
      userId: member.user_id,
      email: member.invited_email,
      scoreCount,
      avgScore: mAvg,
      avgScorePrevMonth: mPrevAvg,
      belowThresholdRate: mBelow,
      axisAverages,
    } as MemberStat;
  }).filter(Boolean) as MemberStat[];

  // チーム平均 5軸
  const axisNames = ['開封誘引力', '読了性', 'CTA強度', 'ターゲット適合度', '配信適正'];
  const teamAxisAverages = axisNames.map(name => {
    const scores = history.flatMap(h => h.axes.filter(a => a.name === name).map(a => a.score));
    const avg = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
    return { name, avg };
  });

  const stats: TeamStats = {
    totalScores,
    avgScore,
    avgScorePrevMonth: prevAvg,
    belowThresholdRate,
    memberStats,
  };

  return NextResponse.json({ stats, teamAxisAverages, history, minThreshold });
}
