import dns from 'dns/promises';
import { GENERIC_EMAIL_PREFIXES } from '../config/constants.js';
import type { ValidatedEmail } from '../types/index.js';

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

/**
 * テキストからメールアドレスを抽出する
 */
export function extractEmailsFromText(text: string): string[] {
  return [...new Set(text.match(EMAIL_REGEX) ?? [])];
}

/**
 * 汎用メールアドレスを除外する（info@, support@ 等）
 */
function isGenericEmail(email: string): boolean {
  const local = email.split('@')[0]?.toLowerCase() ?? '';
  return GENERIC_EMAIL_PREFIXES.some((prefix) => local === prefix || local.startsWith(prefix + '.'));
}

/**
 * MXレコードでドメインの実在を確認する
 */
async function hasMxRecord(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) return false;
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

/**
 * メールアドレスのリストをバリデーションする
 * - 汎用プレフィックス除外（info@, support@ 等は除く）
 * - フリーメール（gmail, yahoo 等）は個人事業主の可能性があるため保持
 * - MXレコード検証
 */
export async function validateEmails(
  emails: string[],
  sourceUrl: string,
  existingEmails: Set<string> = new Set(),
): Promise<ValidatedEmail[]> {
  const results: ValidatedEmail[] = [];

  for (const email of emails) {
    const normalized = email.toLowerCase().trim();

    // DB重複チェック
    if (existingEmails.has(normalized)) continue;
    // 汎用メール除外
    if (isGenericEmail(normalized)) continue;

    const mxValid = await hasMxRecord(normalized);
    results.push({ address: normalized, source: sourceUrl, mxValid });
  }

  return results;
}
