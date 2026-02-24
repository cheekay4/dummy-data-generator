import { createAdminClient } from '@/lib/supabase/admin';
import { Team, TeamMember, TeamPreset, BrandVoice, RevisionRequest, AudienceSegment, TeamPlan } from '@/lib/types';
import { TEAM_PLAN_SEATS } from '@/lib/plan';

// ──────────────────────────────────────
// チーム取得
// ──────────────────────────────────────

export async function getTeamByUserId(userId: string): Promise<{
  team: Team;
  myMember: TeamMember;
} | null> {
  const supabase = createAdminClient();
  const { data: member } = await supabase
    .from('team_members')
    .select('*, teams(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!member) return null;
  return {
    team: member.teams as unknown as Team,
    myMember: member as unknown as TeamMember,
  };
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('teams').select('*').eq('id', teamId).single();
  return data as Team | null;
}

// ──────────────────────────────────────
// チーム作成（Webhookから呼ぶ）
// ──────────────────────────────────────

export async function createTeamFromWebhook(params: {
  userId: string;
  ownerEmail: string;
  teamPlan: TeamPlan;
  stripeSubscriptionId: string;
}): Promise<Team> {
  const supabase = createAdminClient();
  const maxSeats = TEAM_PLAN_SEATS[params.teamPlan];

  const { data: team } = await supabase
    .from('teams')
    .insert({
      name: `${params.ownerEmail} のチーム`,
      created_by: params.userId,
      plan: params.teamPlan,
      max_seats: maxSeats,
      stripe_subscription_id: params.stripeSubscriptionId,
    })
    .select()
    .single();

  if (!team) throw new Error('Failed to create team');

  // Owner を team_members に追加
  await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: params.userId,
    role: 'owner',
    invited_email: params.ownerEmail,
    status: 'active',
    joined_at: new Date().toISOString(),
  });

  // brand_voice をデフォルト値で作成
  await supabase.from('brand_voice').insert({
    team_id: team.id,
    ng_words: [],
    required_checks: ['配信停止リンク', '問い合わせ先', 'ブランド名'],
    min_score_threshold: 65,
    min_score_action: 'warn',
  });

  return team as Team;
}

export async function updateTeamName(teamId: string, name: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from('teams').update({ name }).eq('id', teamId);
}

// ──────────────────────────────────────
// メンバー管理
// ──────────────────────────────────────

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .neq('status', 'removed')
    .order('created_at', { ascending: true });
  return (data ?? []) as TeamMember[];
}

export async function getActiveTeamMemberCount(teamId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .in('status', ['active', 'pending']);
  return count ?? 0;
}

export async function inviteMember(params: {
  teamId: string;
  email: string;
}): Promise<TeamMember> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_members')
    .insert({
      team_id: params.teamId,
      invited_email: params.email,
      role: 'member',
      status: 'pending',
    })
    .select()
    .single();
  if (!data) throw new Error('Failed to invite member');
  return data as TeamMember;
}

export async function acceptInvite(inviteToken: string, userId: string, userEmail: string): Promise<TeamMember | null> {
  const supabase = createAdminClient();
  const { data: member } = await supabase
    .from('team_members')
    .select('*')
    .eq('invite_token', inviteToken)
    .eq('status', 'pending')
    .single();

  if (!member) return null;

  const { data: updated } = await supabase
    .from('team_members')
    .update({
      user_id: userId,
      invited_email: userEmail,
      status: 'active',
      joined_at: new Date().toISOString(),
    })
    .eq('id', member.id)
    .select()
    .single();

  return updated as TeamMember | null;
}

export async function removeMember(memberId: string, teamId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('team_members')
    .update({ status: 'removed' })
    .eq('id', memberId)
    .eq('team_id', teamId);
}

export async function cancelInvite(memberId: string, teamId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
    .eq('team_id', teamId)
    .eq('status', 'pending');
}

export async function resendInvite(memberId: string): Promise<TeamMember | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_members')
    .update({ invite_token: crypto.randomUUID() })
    .eq('id', memberId)
    .select()
    .single();
  return data as TeamMember | null;
}

export async function getMemberByUserId(teamId: string, userId: string): Promise<TeamMember | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  return data as TeamMember | null;
}

// ──────────────────────────────────────
// 共有セグメントプリセット
// ──────────────────────────────────────

export async function getTeamPresets(teamId: string): Promise<TeamPreset[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_presets')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  return (data ?? []) as TeamPreset[];
}

export async function saveTeamPreset(params: {
  teamId: string;
  name: string;
  segment: AudienceSegment;
  createdBy: string;
}): Promise<TeamPreset> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('team_presets')
    .insert({
      team_id: params.teamId,
      name: params.name,
      segment: params.segment,
      created_by: params.createdBy,
    })
    .select()
    .single();
  if (!data) throw new Error('Failed to save team preset');
  return data as TeamPreset;
}

export async function deleteTeamPreset(id: string, teamId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from('team_presets').delete().eq('id', id).eq('team_id', teamId);
}

// ──────────────────────────────────────
// ブランドボイス
// ──────────────────────────────────────

export async function getBrandVoice(teamId: string): Promise<BrandVoice | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('brand_voice')
    .select('*')
    .eq('team_id', teamId)
    .single();
  return data as BrandVoice | null;
}

export async function upsertBrandVoice(
  teamId: string,
  updatedBy: string,
  values: Partial<Omit<BrandVoice, 'id' | 'team_id' | 'updated_by' | 'updated_at'>>,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('brand_voice')
    .upsert({
      team_id: teamId,
      ...values,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'team_id' });
}

// ──────────────────────────────────────
// チーム統計
// ──────────────────────────────────────

export async function getTeamScoreHistory(
  teamId: string,
  days: number,
): Promise<{ userId: string; totalScore: number; axes: { name: string; score: number }[]; createdAt: string }[]> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('score_history')
    .select('user_id, result, created_at')
    .eq('team_id', teamId)
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  return (data ?? []).map((row) => {
    const result = row.result as { totalScore: number; axes: { name: string; score: number }[] };
    return {
      userId: row.user_id as string,
      totalScore: result?.totalScore ?? 0,
      axes: result?.axes ?? [],
      createdAt: row.created_at as string,
    };
  });
}

// ──────────────────────────────────────
// 修正依頼
// ──────────────────────────────────────

export async function createRevisionRequest(params: {
  scoreHistoryId: string;
  teamId: string;
  requestedBy: string;
  assignedTo: string;
  comment: string;
}): Promise<RevisionRequest> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('revision_requests')
    .insert({
      score_history_id: params.scoreHistoryId,
      team_id: params.teamId,
      requested_by: params.requestedBy,
      assigned_to: params.assignedTo,
      comment: params.comment,
    })
    .select()
    .single();
  if (!data) throw new Error('Failed to create revision request');
  return data as RevisionRequest;
}

export async function getRevisionRequests(
  teamId: string,
  userId: string,
  role: 'owner' | 'member',
): Promise<RevisionRequest[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('revision_requests')
    .select('*, score_history(channel, input_text, result, created_at)')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (role === 'member') {
    query = query.eq('assigned_to', userId);
  }

  const { data } = await query;
  return (data ?? []) as unknown as RevisionRequest[];
}

export async function resolveRevisionRequest(id: string, teamId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('revision_requests')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', id)
    .eq('team_id', teamId);
}
