import { fetchReplies } from './gmail.js';
import {
  getSentEmailsForMonitoring,
  getKnownReplyMessageIds,
  saveReply,
} from './lead-db.js';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { Reply } from '../types/index.js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

/**
 * 送信済みスレッドをスキャンし、新着返信を DB に保存する
 * @returns 新たに保存した返信の件数
 */
export async function monitorInbox(): Promise<{ saved: number; replies: Reply[] }> {
  const sentEmails = await getSentEmailsForMonitoring();
  if (sentEmails.length === 0) return { saved: 0, replies: [] };

  const inboxMessages = await fetchReplies(sentEmails);
  const knownIds = await getKnownReplyMessageIds();

  const saved: Reply[] = [];

  for (const { emailId, message } of inboxMessages) {
    if (knownIds.has(message.messageId)) continue;

    // email から lead_id を正しく取得する（空文字では UUID 型に挿入できないため）
    const { data: emailRow } = await supabase
      .from('sales_emails')
      .select('lead_id')
      .eq('id', emailId)
      .single();

    if (!emailRow?.lead_id) continue; // lead_id が取得できない場合はスキップ

    const reply = await saveReply({
      email_id: emailId,
      lead_id: emailRow.lead_id,
      gmail_message_id: message.messageId,
      intent: null,
      intent_confidence: null,
      reply_body: message.body,
      ai_draft_response: null,
      ai_research_notes: null,
    });

    saved.push(reply);
    knownIds.add(message.messageId);
  }

  return { saved: saved.length, replies: saved };
}
