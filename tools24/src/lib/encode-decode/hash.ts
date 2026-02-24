import { md5 } from './md5';

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  'MD5',
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
];

async function webCryptoHash(data: ArrayBuffer, algo: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateHash(
  input: string | ArrayBuffer,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm === 'MD5') {
    if (typeof input === 'string') {
      return md5(input);
    } else {
      return md5(new Uint8Array(input));
    }
  }
  const data =
    typeof input === 'string' ? new TextEncoder().encode(input).buffer : input;
  return webCryptoHash(data as ArrayBuffer, algorithm);
}

export async function generateAllHashes(
  input: string | ArrayBuffer,
): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algo) => [algo, await generateHash(input, algo)] as const),
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
