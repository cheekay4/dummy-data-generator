export interface CountResult {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  words: number;
  lines: number;
  bytes: number;
  twitterRemaining: number;
  manuscriptPages: number;
  breakdown: {
    hiragana: number;
    katakana: number;
    kanji: number;
    alphanumeric: number;
    symbols: number;
  };
}

export function countText(text: string): CountResult {
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;

  const words =
    text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/[\s\u3000]+/)
          .filter((w) => w.length > 0).length;

  const lines = text === "" ? 0 : text.split("\n").length;

  const bytes = new TextEncoder().encode(text).length;

  // Twitter: 日本語等は1文字=2、英数は1文字=1としてカウント
  let twitterLen = 0;
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (
      (code >= 0x0000 && code <= 0x10ff) ||
      (code >= 0x2000 && code <= 0x200d) ||
      (code >= 0x2010 && code <= 0x201f) ||
      (code >= 0x2032 && code <= 0x2037)
    ) {
      twitterLen += 1;
    } else {
      twitterLen += 2;
    }
  }
  const twitterRemaining = 280 - twitterLen;

  const manuscriptPages = Math.ceil(charsWithoutSpaces / 400) || 0;

  // 文字種別カウント
  let hiragana = 0;
  let katakana = 0;
  let kanji = 0;
  let alphanumeric = 0;
  let symbols = 0;

  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code >= 0x3040 && code <= 0x309f) {
      hiragana++;
    } else if (code >= 0x30a0 && code <= 0x30ff) {
      katakana++;
    } else if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0xf900 && code <= 0xfaff)
    ) {
      kanji++;
    } else if (
      (code >= 0x30 && code <= 0x39) ||
      (code >= 0x41 && code <= 0x5a) ||
      (code >= 0x61 && code <= 0x7a) ||
      (code >= 0xff10 && code <= 0xff19) ||
      (code >= 0xff21 && code <= 0xff3a) ||
      (code >= 0xff41 && code <= 0xff5a)
    ) {
      alphanumeric++;
    } else if (!/\s/.test(char)) {
      symbols++;
    }
  }

  return {
    charsWithSpaces,
    charsWithoutSpaces,
    words,
    lines,
    bytes,
    twitterRemaining,
    manuscriptPages,
    breakdown: { hiragana, katakana, kanji, alphanumeric, symbols },
  };
}
