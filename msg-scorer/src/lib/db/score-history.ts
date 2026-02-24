import { createAdminClient } from '@/lib/supabase/admin';
import { type Channel, type AudienceSegment, type ScoreResponse } from '@/lib/types';

export interface HistoryRecord {
  id: string;
  user_id: string;
  team_id?: string | null;
  channel: Channel;
  input_text: string;
  subject: string | null;
  audience: AudienceSegment;
  result: ScoreResponse;
  share_token: string;
  actual_open_rate: number | null;
  actual_ctr: number | null;
  actual_conversion_rate: number | null;
  actual_conversion_count: number | null;
  actual_note: string | null;
  created_at: string;
}

export async function saveScore(params: {
  userId: string;
  teamId?: string | null;
  channel: Channel;
  text: string;
  subject?: string;
  audience: AudienceSegment;
  result: ScoreResponse;
}): Promise<HistoryRecord | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('score_history')
    .insert({
      user_id:    params.userId,
      team_id:    params.teamId ?? null,
      channel:    params.channel,
      input_text: params.text,
      subject:    params.subject ?? null,
      audience:   params.audience,
      result:     params.result,
    })
    .select()
    .single();
  return data as HistoryRecord | null;
}

export async function getHistory(userId: string, limit = 50): Promise<HistoryRecord[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('score_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as HistoryRecord[];
}

export async function getHistoryById(id: string, userId: string): Promise<HistoryRecord | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('score_history')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  return data as HistoryRecord | null;
}

export async function getByShareToken(token: string): Promise<HistoryRecord | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('score_history')
    .select('*')
    .eq('share_token', token)
    .single();
  return data as HistoryRecord | null;
}

export async function updateActualResults(
  id: string,
  userId: string,
  actuals: {
    actual_open_rate?: number;
    actual_ctr?: number;
    actual_conversion_rate?: number;
    actual_conversion_count?: number;
    actual_note?: string;
  },
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('score_history')
    .update(actuals)
    .eq('id', id)
    .eq('user_id', userId);
}
