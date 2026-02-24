import { createAdminClient } from '../supabase/admin';
import type { ApiKey } from '../types';

async function sha256hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateKey(): string {
  // msk_ + UUID（ハイフンなし）
  const raw = crypto.randomUUID().replace(/-/g, '');
  return `msk_${raw}`;
}

export async function createApiKey(
  teamId: string,
  userId: string,
  name: string,
): Promise<{ key: string; id: string; prefix: string }> {
  const admin = createAdminClient();
  const key = generateKey();
  const hash = await sha256hex(key);
  const prefix = key.slice(0, 12); // "msk_xxxxxxxx"

  const { data, error } = await admin
    .from('api_keys')
    .insert({ team_id: teamId, key_hash: hash, key_prefix: prefix, name, created_by: userId })
    .select('id')
    .single();

  if (error) throw new Error(`createApiKey failed: ${error.message}`);
  return { key, id: data.id as string, prefix };
}

export async function getApiKeys(teamId: string): Promise<ApiKey[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('api_keys')
    .select('id, team_id, key_prefix, name, created_by, last_used_at, created_at, revoked_at')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getApiKeys failed: ${error.message}`);
  return (data ?? []) as ApiKey[];
}

export async function revokeApiKey(id: string, teamId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)
    .eq('team_id', teamId);
  if (error) throw new Error(`revokeApiKey failed: ${error.message}`);
}

/** Bearer トークンからチームIDとキーIDを検証する */
export async function validateApiKey(
  bearerToken: string,
): Promise<{ teamId: string; keyId: string } | null> {
  if (!bearerToken.startsWith('msk_')) return null;

  const admin = createAdminClient();
  const hash = await sha256hex(bearerToken);

  const { data, error } = await admin
    .from('api_keys')
    .select('id, team_id, revoked_at')
    .eq('key_hash', hash)
    .single();

  if (error || !data) return null;
  if (data.revoked_at) return null; // 無効化済み

  // last_used_at を更新（非同期、失敗しても無視）
  void admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return { teamId: data.team_id as string, keyId: data.id as string };
}

/** API キーの日次利用数チェック（daily_usage テーブルを利用） */
export async function checkApiKeyRateLimit(
  keyId: string,
  dailyLimit = 1000,
): Promise<{ allowed: boolean; usage: number }> {
  const admin = createAdminClient();
  const today = new Date().toISOString().split('T')[0];
  const identifier = `api_key:${keyId}`;

  const { data } = await admin
    .from('daily_usage')
    .select('count')
    .eq('identifier', identifier)
    .eq('date', today)
    .single();

  const usage = (data?.count as number) ?? 0;
  if (usage >= dailyLimit) return { allowed: false, usage };

  // increment
  await admin.rpc('increment_usage', { p_identifier: identifier, p_date: today });
  return { allowed: true, usage: usage + 1 };
}
