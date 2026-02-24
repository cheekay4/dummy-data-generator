import type { Channel, AudienceSegment, ScoreResult } from './types';

const API_BASE = 'https://msg-scorer.vercel.app';

export interface ScoreOptions {
  channel: Channel;
  text: string;
  subject?: string;
  audience: AudienceSegment;
  extensionToken?: string;
}

export async function scoreText(opts: ScoreOptions): Promise<{ result?: ScoreResult; error?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (opts.extensionToken) {
    headers['X-Extension-Token'] = opts.extensionToken;
  }

  try {
    const res = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channel: opts.channel,
        text: opts.text,
        subject: opts.subject,
        audience: opts.audience,
        source: 'chrome-extension',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.error ?? 'スコアリングに失敗しました' };
    }
    return { result: data as ScoreResult };
  } catch {
    return { error: '通信エラーが発生しました' };
  }
}

export async function verifyToken(token: string): Promise<{ valid: boolean; plan: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/extension/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return { valid: false, plan: null };
    return await res.json();
  } catch {
    return { valid: false, plan: null };
  }
}
