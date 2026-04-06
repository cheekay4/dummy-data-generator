// ひらがな⇔カタカナ変換（offset 0x60）
const HIRAGANA_START = 0x3041;
const KATAKANA_START = 0x30A1;
const OFFSET = KATAKANA_START - HIRAGANA_START; // 0x60

export function hiraganaToKatakana(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= HIRAGANA_START && code <= 0x3096) {
      result += String.fromCharCode(code + OFFSET);
    } else {
      result += char;
    }
  }
  return result;
}

export function katakanaToHiragana(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= KATAKANA_START && code <= 0x30F6) {
      result += String.fromCharCode(code - OFFSET);
    } else {
      result += char;
    }
  }
  return result;
}
