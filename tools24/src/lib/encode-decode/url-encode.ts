// URL encode / decode utilities

export function encodeComponent(str: string): string {
  return encodeURIComponent(str);
}

export function decodeComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    throw new Error('デコードに失敗しました（不正なパーセントエンコードが含まれています）');
  }
}

export function encodeFullURI(str: string): string {
  return encodeURI(str);
}

/** Returns true if the string already contains percent-encoded sequences */
export function isEncoded(str: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(str);
}

/** Returns true if the string appears to be double-encoded (%25XX pattern) */
export function isDoubleEncoded(str: string): boolean {
  return /%25[0-9A-Fa-f]{2}/i.test(str);
}

/** Build a mapping of percent-encoded sequences to Unicode code points */
export function buildEncodingTable(
  original: string,
  encoded: string,
): { seq: string; char: string; codePoint: string }[] {
  const table: { seq: string; char: string; codePoint: string }[] = [];
  const seqPattern = /%[0-9A-Fa-f]{2}/g;
  const percentSeqs = encoded.match(seqPattern) ?? [];

  // Decode byte sequences back to characters for display
  // Find unique multi-byte percent sequences (UTF-8 encoded chars)
  const seen = new Set<string>();
  const charToSeqs = new Map<string, string>();
  let i = 0;
  while (i < original.length) {
    const cp = original.codePointAt(i) ?? 0;
    if (cp > 127) {
      const char = String.fromCodePoint(cp);
      if (!charToSeqs.has(char)) {
        const enc = encodeURIComponent(char);
        charToSeqs.set(char, enc);
        table.push({
          char,
          seq: enc,
          codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
        });
      }
      i += char.length;
    } else {
      i++;
    }
  }

  void percentSeqs;
  void seen;
  return table;
}
