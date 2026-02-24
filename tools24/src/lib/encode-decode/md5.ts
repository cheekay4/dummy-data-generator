// MD5 pure TypeScript implementation (RFC 1321 compliant)
// Accepts a UTF-8 string or raw Uint8Array bytes

function toU32(n: number): number {
  return n >>> 0;
}

function leftRotate(x: number, n: number): number {
  return toU32((x << n) | (x >>> (32 - n)));
}

// Per-round shift amounts
const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

// Precomputed constants: T[i] = floor(abs(sin(i+1)) * 2^32)
const T: number[] = Array.from({ length: 64 }, (_, i) =>
  toU32(Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)),
);

export function md5(input: string | Uint8Array): string {
  const bytes: Uint8Array =
    typeof input === 'string' ? new TextEncoder().encode(input) : input;

  const len = bytes.length;
  const bitLen = len * 8;

  // Padding: append 0x80 then zeros until length ≡ 56 (mod 64), then 8-byte LE bit length
  let paddedLen = len + 1;
  while (paddedLen % 64 !== 56) paddedLen++;
  paddedLen += 8;

  const msg = new Uint8Array(paddedLen);
  msg.set(bytes);
  msg[len] = 0x80;

  // Append original bit length as 64-bit little-endian
  const dv = new DataView(msg.buffer);
  dv.setUint32(paddedLen - 8, bitLen & 0xffffffff, true);
  dv.setUint32(paddedLen - 4, Math.floor(bitLen / 0x100000000) & 0xffffffff, true);

  // Initial hash values
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  // Process 512-bit (64-byte) chunks
  for (let offset = 0; offset < paddedLen; offset += 64) {
    const M = Array.from({ length: 16 }, (_, j) =>
      dv.getUint32(offset + j * 4, true),
    );

    let A = a, B = b, C = c, D = d;

    for (let j = 0; j < 64; j++) {
      let F: number, g: number;
      if (j < 16) {
        F = (B & C) | (~B & D);
        g = j;
      } else if (j < 32) {
        F = (D & B) | (~D & C);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        F = B ^ C ^ D;
        g = (3 * j + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * j) % 16;
      }
      const tmp = D;
      D = C;
      C = B;
      B = toU32(B + leftRotate(toU32(A + F + T[j] + M[g]), S[j]));
      A = tmp;
    }

    a = toU32(a + A);
    b = toU32(b + B);
    c = toU32(c + C);
    d = toU32(d + D);
  }

  // Output as hex (little-endian per 32-bit word)
  return [a, b, c, d]
    .map((v) => {
      let hex = '';
      for (let i = 0; i < 4; i++) hex += ((v >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
      return hex;
    })
    .join('');
}
