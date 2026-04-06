import Encoding from 'encoding-japanese';

export type SupportedEncoding = 'UTF8' | 'SJIS' | 'EUCJP' | 'JIS' | 'UTF16LE' | 'UTF16BE';

export const ENCODING_LABELS: Record<SupportedEncoding, string> = {
  UTF8: 'UTF-8',
  SJIS: 'Shift_JIS',
  EUCJP: 'EUC-JP',
  JIS: 'ISO-2022-JP',
  UTF16LE: 'UTF-16LE',
  UTF16BE: 'UTF-16BE',
};

export function detectEncoding(text: string): SupportedEncoding | null {
  const codes = Encoding.stringToCode(text);
  const detected = Encoding.detect(codes);
  if (!detected || detected === 'BINARY' || detected === 'ASCII') {
    return null;
  }
  const map: Record<string, SupportedEncoding> = {
    UTF8: 'UTF8',
    SJIS: 'SJIS',
    EUCJP: 'EUCJP',
    JIS: 'JIS',
    UTF16LE: 'UTF16LE',
    UTF16BE: 'UTF16BE',
  };
  return map[detected] ?? null;
}

export function fixMojibake(text: string, from: SupportedEncoding, to: SupportedEncoding): string {
  try {
    // テキストを一旦 from エンコーディングのバイト列として解釈し、to に変換する
    const codes = Encoding.stringToCode(text);
    const converted = Encoding.convert(codes, {
      to: to,
      from: from,
    });
    return Encoding.codeToString(converted);
  } catch {
    return text;
  }
}
