// JWT parser (decode only, no verification)

export interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface ParsedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Error('Base64デコードに失敗しました');
  }
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

export function parseJWT(token: string): ParsedJWT {
  const trimmed = token.trim();
  const parts = trimmed.split('.');

  if (parts.length !== 3) {
    throw new Error(
      `有効なJWTトークンではありません。JWTはheader.payload.signatureの3パートで構成されます（現在${parts.length}パート）`,
    );
  }

  let header: JWTHeader;
  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    throw new Error('JWTヘッダーのデコードに失敗しました');
  }

  let payload: JWTPayload;
  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error('JWTペイロードのデコードに失敗しました');
  }

  return {
    header,
    payload,
    signature: parts[2],
    raw: { header: parts[0], payload: parts[1], signature: parts[2] },
  };
}

/** Format a Unix timestamp as JST datetime string */
export function unixToJST(ts: number): string {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(ts * 1000)) + ' (JST)';
}

export type TokenStatus =
  | { status: 'valid'; remainingMs: number }
  | { status: 'expired'; expiredMsAgo: number }
  | { status: 'not-yet-valid'; validFromMs: number }
  | { status: 'no-expiry' };

/** Determine the validity status of a JWT based on exp/nbf fields */
export function getTokenStatus(payload: JWTPayload): TokenStatus {
  const now = Date.now();

  if (payload.nbf !== undefined && now < payload.nbf * 1000) {
    return { status: 'not-yet-valid', validFromMs: payload.nbf * 1000 };
  }

  if (payload.exp === undefined) {
    return { status: 'no-expiry' };
  }

  const expMs = payload.exp * 1000;
  if (now < expMs) {
    return { status: 'valid', remainingMs: expMs - now };
  } else {
    return { status: 'expired', expiredMsAgo: now - expMs };
  }
}

function msToHumanReadable(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}日${hours}時間`;
  if (hours > 0) return `${hours}時間${minutes}分`;
  return `${minutes}分`;
}

export function formatTokenStatus(status: TokenStatus): {
  label: string;
  color: 'green' | 'red' | 'yellow' | 'gray';
} {
  switch (status.status) {
    case 'valid':
      return { label: `有効（残り ${msToHumanReadable(status.remainingMs)}）`, color: 'green' };
    case 'expired':
      return {
        label: `期限切れ（${msToHumanReadable(status.expiredMsAgo)}前に失効）`,
        color: 'red',
      };
    case 'not-yet-valid':
      return { label: `まだ有効期間前`, color: 'yellow' };
    case 'no-expiry':
      return { label: `有効期限なし`, color: 'gray' };
  }
}
