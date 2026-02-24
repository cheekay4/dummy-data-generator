import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { Lead, LeadStatus, SentEmail, Reply, DailyStats, EmailDraft } from '../types/index.js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

// ──────────────────────────────────────────────────────────
// リード CRUD
// ──────────────────────────────────────────────────────────

/**
 * リードを一括 UPSERT する（email をキーとして重複防止）
 */
export async function upsertLeads(
  leads: Omit<Lead, 'id' | 'created_at' | 'updated_at'>[],
): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('sales_leads')
    .upsert(leads, { onConflict: 'email', ignoreDuplicates: true })
    .select();

  if (error) throw new Error(`リードの保存に失敗しました: ${error.message}`);
  return (data ?? []) as Lead[];
}

/**
 * 単一リードを作成する
 */
export async function createLead(
  lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>,
): Promise<Lead> {
  const { data, error } = await supabase.from('sales_leads').insert(lead).select().single();
  if (error) throw new Error(`リードの作成に失敗しました: ${error.message}`);
  return data as Lead;
}

/**
 * リードのステータスを更新する
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase
    .from('sales_leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) throw new Error(`ステータス更新に失敗しました: ${error.message}`);
}

/**
 * リードを ID で取得する
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await supabase.from('sales_leads').select('*').eq('id', id).single();
  if (error) return null;
  return data as Lead;
}

/**
 * ステータスでリードを絞り込んで取得する
 */
export async function getLeadsByStatus(status: LeadStatus, limit = 100): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('sales_leads')
    .select('*')
    .eq('status', status)
    .order('icp_score', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`リード取得に失敗しました: ${error.message}`);
  return (data ?? []) as Lead[];
}

/**
 * 既存のメールアドレス一覧を返す（重複チェック用）
 */
export async function getExistingEmails(): Promise<Set<string>> {
  const { data, error } = await supabase.from('sales_leads').select('email');
  if (error) throw new Error(`メールアドレス取得に失敗しました: ${error.message}`);
  return new Set((data ?? []).map((r: { email: string }) => r.email));
}

/**
 * リードの分析結果を更新する
 */
export async function updateLeadAnalysis(
  leadId: string,
  update: Pick<Lead, 'company_name' | 'industry' | 'industry_detail' | 'icp_score'>,
): Promise<void> {
  const { error } = await supabase
    .from('sales_leads')
    .update({ ...update, status: 'analyzed', updated_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) throw new Error(`分析結果の保存に失敗しました: ${error.message}`);
}

// ──────────────────────────────────────────────────────────
// 送信済みメール CRUD
// ──────────────────────────────────────────────────────────

/**
 * メールドラフトを保存する
 */
export async function saveDraft(draft: EmailDraft): Promise<SentEmail> {
  const { data, error } = await supabase
    .from('sales_emails')
    .insert({
      lead_id: draft.lead_id,
      subject: draft.subject,
      body_html: draft.body_html,
      body_text: draft.body_text,
      template_used: draft.template_used,
      status: 'draft',
      // Add-B フィールド
      variant: draft.variant ?? null,
      msgscore: draft.msgscore ?? null,
      msgscore_detail: draft.msgscore_detail ?? null,
      low_score: draft.low_score ?? false,
      generation_attempt: draft.generation_attempt ?? 1,
    })
    .select()
    .single();

  if (error) throw new Error(`ドラフト保存に失敗しました: ${error.message}`);
  return data as SentEmail;
}

/**
 * メールを承認済みに更新する
 */
export async function approveEmail(emailId: string): Promise<void> {
  const { error } = await supabase
    .from('sales_emails')
    .update({ status: 'approved' })
    .eq('id', emailId);

  if (error) throw new Error(`承認処理に失敗しました: ${error.message}`);
}

/**
 * 送信完了を記録する
 */
export async function markEmailSent(
  emailId: string,
  gmailMessageId: string,
  gmailThreadId: string,
): Promise<void> {
  const { error } = await supabase
    .from('sales_emails')
    .update({
      gmail_message_id: gmailMessageId,
      gmail_thread_id: gmailThreadId,
      sent_at: new Date().toISOString(),
      status: 'sent',
    })
    .eq('id', emailId);

  if (error) throw new Error(`送信記録に失敗しました: ${error.message}`);
}

/**
 * 承認済みメールのリストを取得する
 */
export async function getApprovedEmails(limit = SAFETY_BATCH): Promise<SentEmail[]> {
  const { data, error } = await supabase
    .from('sales_emails')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(`承認済みメール取得に失敗しました: ${error.message}`);
  return (data ?? []) as SentEmail[];
}

/**
 * 送信済みメール（スレッドID付き）を取得する — 返信監視用（Phase 2）
 */
export async function getSentEmailsForMonitoring(): Promise<
  Pick<SentEmail, 'id' | 'gmail_thread_id'>[]
> {
  const { data, error } = await supabase
    .from('sales_emails')
    .select('id, gmail_thread_id')
    .eq('status', 'sent')
    .not('gmail_thread_id', 'is', null);

  if (error) throw new Error(`送信済みメール取得に失敗しました: ${error.message}`);
  return (data ?? []) as Pick<SentEmail, 'id' | 'gmail_thread_id'>[];
}

const SAFETY_BATCH = 5;

// ──────────────────────────────────────────────────────────
// 返信 CRUD
// ──────────────────────────────────────────────────────────

/**
 * 受信した返信を保存する
 */
export async function saveReply(
  reply: Omit<Reply, 'id' | 'human_approved' | 'responded_at' | 'created_at'>,
): Promise<Reply> {
  const { data, error } = await supabase
    .from('sales_replies')
    .insert({ ...reply, human_approved: false })
    .select()
    .single();

  if (error) throw new Error(`返信保存に失敗しました: ${error.message}`);
  return data as Reply;
}

/**
 * 既知の返信 gmail_message_id 一覧（重複取り込み防止）
 */
export async function getKnownReplyMessageIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from('sales_replies').select('gmail_message_id');
  if (error) return new Set();
  return new Set((data ?? []).map((r: { gmail_message_id: string }) => r.gmail_message_id));
}

/**
 * 未対応の返信（AI ドラフト生成済み、人間未承認）を取得する
 */
export async function getPendingReplies(): Promise<Reply[]> {
  const { data, error } = await supabase
    .from('sales_replies')
    .select('*')
    .eq('human_approved', false)
    .not('ai_draft_response', 'is', null)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`未対応返信取得に失敗しました: ${error.message}`);
  return (data ?? []) as Reply[];
}

/**
 * 返信の AI ドラフトを更新する
 */
export async function updateReplyDraft(
  replyId: string,
  update: Pick<Reply, 'intent' | 'intent_confidence' | 'ai_draft_response' | 'ai_research_notes'>,
): Promise<void> {
  const { error } = await supabase.from('sales_replies').update(update).eq('id', replyId);
  if (error) throw new Error(`返信ドラフト更新に失敗しました: ${error.message}`);
}

/**
 * 返信を承認済みとしてマークする
 */
export async function approveReply(replyId: string): Promise<void> {
  const { error } = await supabase
    .from('sales_replies')
    .update({ human_approved: true, responded_at: new Date().toISOString() })
    .eq('id', replyId);

  if (error) throw new Error(`返信承認に失敗しました: ${error.message}`);
}

// ──────────────────────────────────────────────────────────
// 日次統計
// ──────────────────────────────────────────────────────────

/**
 * 本日の送信数を取得する
 */
export async function getTodaySentCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('sales_daily_stats')
    .select('emails_sent')
    .eq('date', today)
    .single();

  if (error) return 0;
  return (data as DailyStats | null)?.emails_sent ?? 0;
}

/**
 * 本日の送信数をインクリメントする
 */
export async function incrementDailySentCount(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase.rpc('increment_daily_sent', { p_date: today });

  if (error) {
    // RPC がない場合は直接 UPSERT
    await supabase.from('sales_daily_stats').upsert(
      { date: today, emails_sent: 1 },
      { onConflict: 'date' },
    );
  }
}

/**
 * 直近 N 日間の統計を取得する
 */
export async function getRecentStats(days = 7): Promise<DailyStats[]> {
  const { data, error } = await supabase
    .from('sales_daily_stats')
    .select('*')
    .order('date', { ascending: false })
    .limit(days);

  if (error) throw new Error(`統計取得に失敗しました: ${error.message}`);
  return (data ?? []) as DailyStats[];
}
