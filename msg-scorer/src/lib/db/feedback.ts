import { createAdminClient } from '@/lib/supabase/admin';
import type { Feedback, FeedbackWithContext, TeamFeedbackStats, Channel } from '@/lib/types';

export async function submitFeedback(data: {
  scoreHistoryId: string;
  userId: string;
  teamId?: string;
  rating: 1 | -1;
  comment?: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('feedback').upsert(
    {
      score_history_id: data.scoreHistoryId,
      user_id: data.userId,
      team_id: data.teamId ?? null,
      rating: data.rating,
      comment: data.comment ?? null,
    },
    { onConflict: 'score_history_id,user_id' },
  );
  if (error) throw new Error(error.message);
}

export async function getMyFeedback(scoreHistoryId: string, userId: string): Promise<Feedback | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('feedback')
    .select('*')
    .eq('score_history_id', scoreHistoryId)
    .eq('user_id', userId)
    .maybeSingle();
  return data as Feedback | null;
}

export async function getTeamFeedbackStats(teamId: string): Promise<TeamFeedbackStats> {
  const admin = createAdminClient();

  const { data: feedbacks } = await admin
    .from('feedback')
    .select(`
      id, score_history_id, user_id, team_id, rating, comment, created_at,
      score_history:score_history_id ( result, channel ),
      profiles:user_id ( email )
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (!feedbacks || feedbacks.length === 0) {
    return { total: 0, positive: 0, positiveRate: 0, recent: [], weeklyTrend: [] };
  }

  const total = feedbacks.length;
  const positive = feedbacks.filter(f => f.rating === 1).length;
  const positiveRate = Math.round((positive / total) * 100);

  const recent: FeedbackWithContext[] = feedbacks.slice(0, 20).map(f => {
    const history = f.score_history as { result?: { totalScore?: number }; channel?: string } | null;
    const profile = f.profiles as { email?: string } | null;
    return {
      id: f.id,
      score_history_id: f.score_history_id,
      user_id: f.user_id,
      team_id: f.team_id ?? undefined,
      rating: f.rating as 1 | -1,
      comment: f.comment ?? undefined,
      created_at: f.created_at,
      member_email: profile?.email,
      total_score: history?.result?.totalScore,
      channel: history?.channel as Channel | undefined,
    };
  });

  // 週次トレンド（直近8週）
  const weekMap: Record<string, { count: number; positive: number }> = {};
  feedbacks.forEach(f => {
    const d = new Date(f.created_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!weekMap[key]) weekMap[key] = { count: 0, positive: 0 };
    weekMap[key].count++;
    if (f.rating === 1) weekMap[key].positive++;
  });

  const weeklyTrend = Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, { count, positive: pos }]) => ({
      week: week.slice(5),
      positiveRate: count > 0 ? Math.round((pos / count) * 100) : 0,
      count,
    }));

  return { total, positive, positiveRate, recent, weeklyTrend };
}
