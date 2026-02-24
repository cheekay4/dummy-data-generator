import { createAdminClient } from '../supabase/admin';

async function sha256hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const raw = crypto.randomUUID().replace(/-/g, '');
  return `mse_${raw}`;
}

/** 新しい拡張トークンを生成し、ハッシュを profiles に保存。平文トークンを返す */
export async function generateExtensionToken(userId: string): Promise<string> {
  const admin = createAdminClient();
  const token = generateToken();
  const hash = await sha256hex(token);

  const { error } = await admin
    .from('profiles')
    .update({ extension_token_hash: hash })
    .eq('id', userId);

  if (error) throw new Error(`generateExtensionToken failed: ${error.message}`);
  return token;
}

/** トークンを検証し、対応する userId を返す（無効なら null） */
export async function validateExtensionToken(token: string): Promise<string | null> {
  if (!token.startsWith('mse_')) return null;

  const admin = createAdminClient();
  const hash = await sha256hex(token);

  const { data, error } = await admin
    .from('profiles')
    .select('id')
    .eq('extension_token_hash', hash)
    .single();

  if (error || !data) return null;
  return data.id as string;
}

/** トークンを無効化する */
export async function revokeExtensionToken(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ extension_token_hash: null })
    .eq('id', userId);

  if (error) throw new Error(`revokeExtensionToken failed: ${error.message}`);
}
