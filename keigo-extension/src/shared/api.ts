import type { GenerateRequest, GenerateResponse } from './types';

// TODO: 将来はChrome Extension IDに絞ってCORSを制限する
const API_BASE = 'https://keigo-tools.vercel.app';
const TIMEOUT_MS = 30_000;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function generateKeigo(
  req: GenerateRequest,
  licenseKey?: string
): Promise<GenerateResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (licenseKey) {
    headers['X-License-Key'] = licenseKey;
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req),
    });

    const data = await res.json();
    if (!res.ok) {
      return { result: '', error: data.error ?? '生成に失敗しました' };
    }
    return { result: data.result ?? '' };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { result: '', error: 'タイムアウト（30秒）しました。再度お試しください' };
    }
    return { result: '', error: '通信エラーが発生しました' };
  }
}

export async function verifyLicense(licenseKey: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/verify-license`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey }),
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}
