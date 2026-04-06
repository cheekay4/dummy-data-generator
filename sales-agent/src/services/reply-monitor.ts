import { fetchReplies } from './gmail.js';
import {
  getSentEmailsForMonitoring,
  getKnownReplyMessageIds,
  saveReply,
  updateLeadStatus,
} from './lead-db.js';
import type { Reply } from '../types/index.js';

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

    const reply = await saveReply({
      email_id: emailId,
      lead_id: '', // lead_id は email_id から JOIN で取得するため後工程で補完
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
