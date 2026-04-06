// 文字種判定ユーティリティ
export function isFullwidthAlpha(code: number): boolean {
  return (code >= 0xFF21 && code <= 0xFF3A) || (code >= 0xFF41 && code <= 0xFF5A);
}
export function isFullwidthDigit(code: number): boolean {
  return code >= 0xFF10 && code <= 0xFF19;
}
export function isFullwidthSymbol(code: number): boolean {
  return (code >= 0xFF01 && code <= 0xFF0F) ||
    (code >= 0xFF1A && code <= 0xFF20) ||
    (code >= 0xFF3B && code <= 0xFF40) ||
    (code >= 0xFF5B && code <= 0xFF5E);
}
export function isHalfwidthAlpha(code: number): boolean {
  return (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A);
}
export function isHalfwidthDigit(code: number): boolean {
  return code >= 0x30 && code <= 0x39;
}
export function isHalfwidthSymbol(code: number): boolean {
  return (code >= 0x21 && code <= 0x2F) ||
    (code >= 0x3A && code <= 0x40) ||
    (code >= 0x5B && code <= 0x60) ||
    (code >= 0x7B && code <= 0x7E);
}
export function isHiragana(code: number): boolean {
  return code >= 0x3041 && code <= 0x3096;
}
export function isZenkakuKatakana(code: number): boolean {
  return code >= 0x30A1 && code <= 0x30F6;
}
