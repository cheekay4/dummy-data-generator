import { google } from 'googleapis';
import { env } from '../config/env.js';
import { SAFETY } from '../config/constants.js';
import type { SentEmail } from '../types/index.js';

const oauth2Client = new google.auth.OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET,
  env.GMAIL_REDIRECT_URI,
);

/**
 * OAuth2 認証URLを生成する（初回セットアップ用）
 */
export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
    prompt: 'consent',
  });
}

/**
 * 認証コードをリフレッシュトークンに交換する
 */
export async function exchangeCode(code: string): Promise<string> {
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error('リフレッシュトークンが取得できませんでした。アカウントを再認証してください。');
  }
  return tokens.refresh_token;
}

/**
 * リフレッシュトークンを使って認証済みクライアントを返す
 */
function getAuthenticatedClient() {
  if (!env.GMAIL_REFRESH_TOKEN) {
    throw new Error(
      'GMAIL_REFRESH_TOKEN が未設定です。node dist/index.js auth を実行してください。',
    );
  }
  oauth2Client.setCredentials({ refresh_token: env.GMAIL_REFRESH_TOKEN });
  return oauth2Client;
}

/**
 * RFC 2822 MIME メッセージを構築する
 */
function buildMimeMessage(params: {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  senderName: string;
  senderEmail: string;
  unsubscribeEmail: string;
}): string {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const date = new Date().toUTCString();

  const lines = [
    `From: ${params.senderName} <${params.senderEmail}>`,
    `To: ${params.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(params.subject).toString('base64')}?=`,
    `Date: ${date}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `List-Unsubscribe: <mailto:${params.unsubscribeEmail}?subject=unsubscribe>`,
    `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(params.bodyText).toString('base64'),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(params.bodyHtml).toString('base64'),
    ``,
    `--${boundary}--`,
  ];

  return lines.join('\r\n');
}

/**
 * 本日の送信数を Gmail API で確認する（ラベルで簡易カウント）
 * ※ Supabase の daily_stats を使う方が正確
 */
export async function getDailySentCount(): Promise<number> {
  const auth = getAuthenticatedClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const today = new Date().toISOString().split('T')[0]!.replace(/-/g, '/');
  const query = `in:sent after:${today}`;

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 500,
  });

  return res.data.resultSizeEstimate ?? 0;
}

let lastSentAt: number | null = null;

/**
 * メールを送信する
 * - 日次送信上限チェック
 * - 60秒最小インターバル
 * - RFC 2822 + List-Unsubscribe ヘッダー付き
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  dailySentToday: number;
}): Promise<{ messageId: string; threadId: string }> {
  // 日次送信上限チェック
  const limit = env.DAILY_SEND_LIMIT ?? SAFETY.DAILY_SEND_LIMIT;
  if (params.dailySentToday >= limit) {
    throw new Error(`日次送信上限（${limit}通）に達しました。明日再実行してください。`);
  }

  // 最小インターバルチェック
  if (lastSentAt !== null) {
    const elapsed = (Date.now() - lastSentAt) / 1000;
    if (elapsed < SAFETY.MIN_SEND_INTERVAL_SEC) {
      const wait = Math.ceil(SAFETY.MIN_SEND_INTERVAL_SEC - elapsed);
      throw new Error(`送信間隔が短すぎます。あと ${wait} 秒待ってください。`);
    }
  }

  const auth = getAuthenticatedClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const unsubscribeEmail = env.SENDER_EMAIL;
  const mime = buildMimeMessage({
    to: params.to,
    subject: params.subject,
    bodyText: params.bodyText,
    bodyHtml: params.bodyHtml,
    senderName: env.SENDER_NAME,
    senderEmail: env.SENDER_EMAIL,
    unsubscribeEmail,
  });

  const raw = Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });

  lastSentAt = Date.now();

  return {
    messageId: res.data.id ?? '',
    threadId: res.data.threadId ?? '',
  };
}

export interface InboxMessage {
  messageId: string;
  threadId: string;
  from: string;
  subject: string;
  body: string;
  receivedAt: Date;
}

/**
 * 受信トレイを監視し、未処理の返信を取得する（Phase 2）
 * sentEmails: 送信済みメールのスレッドIDリスト
 */
export async function fetchReplies(sentEmails: Pick<SentEmail, 'gmail_thread_id' | 'id'>[]): Promise<
  Array<{ emailId: string; message: InboxMessage }>
> {
  const auth = getAuthenticatedClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const results: Array<{ emailId: string; message: InboxMessage }> = [];

  for (const sent of sentEmails) {
    if (!sent.gmail_thread_id) continue;

    const thread = await gmail.users.threads.get({
      userId: 'me',
      id: sent.gmail_thread_id,
    });

    const messages = thread.data.messages ?? [];
    // 最初のメッセージは送信元なので、2番目以降が返信
    for (const msg of messages.slice(1)) {
      const headers = msg.payload?.headers ?? [];
      const from = headers.find((h) => h.name === 'From')?.value ?? '';
      const subject = headers.find((h) => h.name === 'Subject')?.value ?? '';
      const dateStr = headers.find((h) => h.name === 'Date')?.value ?? '';

      // 本文を取得（text/plain 優先）
      let body = '';
      const parts = msg.payload?.parts ?? [];
      const textPart = parts.find((p) => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      } else if (msg.payload?.body?.data) {
        body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8');
      }

      results.push({
        emailId: sent.id,
        message: {
          messageId: msg.id ?? '',
          threadId: sent.gmail_thread_id,
          from,
          subject,
          body: body.slice(0, 3000),
          receivedAt: new Date(dateStr),
        },
      });
    }
  }

  return results;
}

/**
 * 返信メールをスレッドに送信する（Phase 2）
 */
export async function sendReply(params: {
  to: string;
  subject: string;
  bodyText: string;
  threadId: string;
}): Promise<{ messageId: string }> {
  const auth = getAuthenticatedClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const reSubject = params.subject.startsWith('Re:') ? params.subject : `Re: ${params.subject}`;
  const mime = buildMimeMessage({
    to: params.to,
    subject: reSubject,
    bodyText: params.bodyText,
    bodyHtml: `<p>${params.bodyText.replace(/\n/g, '<br>')}</p>`,
    senderName: env.SENDER_NAME,
    senderEmail: env.SENDER_EMAIL,
    unsubscribeEmail: env.SENDER_EMAIL,
  });

  const raw = Buffer.from(mime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw, threadId: params.threadId },
  });

  return { messageId: res.data.id ?? '' };
}
