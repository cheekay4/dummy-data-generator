// ひらがな・カタカナ・CJK統合漢字の出現率でスコアリング
export function scoreJapanese(text: string): number {
  if (!text || text.length === 0) return 0;

  let japaneseCount = 0;
  let penaltyCount = 0;

  for (const char of text) {
    const code = char.charCodeAt(0);
    // ひらがな
    if (code >= 0x3041 && code <= 0x3096) {
      japaneseCount += 2;
    }
    // カタカナ
    else if (code >= 0x30A1 && code <= 0x30F6) {
      japaneseCount += 1.5;
    }
    // CJK統合漢字
    else if (code >= 0x4E00 && code <= 0x9FFF) {
      japaneseCount += 1;
    }
    // 制御文字（印刷不能）
    else if (code < 0x20 && code !== 0x09 && code !== 0x0A && code !== 0x0D) {
      penaltyCount += 3;
    }
    // 置換文字 U+FFFD
    else if (code === 0xFFFD) {
      penaltyCount += 5;
    }
  }

  const totalChars = text.length;
  const rawScore = (japaneseCount - penaltyCount) / totalChars;
  return Math.max(0, Math.min(1, rawScore));
}
