// 全角⇔半角変換（U+FF01-FF5E ↔ U+0021-007E のオフセット変換）
const FULLWIDTH_OFFSET = 0xFEE0; // 0xFF01 - 0x0021

export function fullwidthToHalfwidth(char: string): string {
  const code = char.charCodeAt(0);
  // 全角スペース
  if (code === 0x3000) return '\u0020';
  // 全角記号・英数字（FF01-FF5E）
  if (code >= 0xFF01 && code <= 0xFF5E) {
    return String.fromCharCode(code - FULLWIDTH_OFFSET);
  }
  return char;
}

export function halfwidthToFullwidth(char: string): string {
  const code = char.charCodeAt(0);
  // 半角スペース
  if (code === 0x0020) return '\u3000';
  // 半角ASCII記号・英数字（0021-007E）
  if (code >= 0x0021 && code <= 0x007E) {
    return String.fromCharCode(code + FULLWIDTH_OFFSET);
  }
  return char;
}
