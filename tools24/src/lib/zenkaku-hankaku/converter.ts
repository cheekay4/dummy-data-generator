import { isFullwidthAlpha, isFullwidthDigit, isFullwidthSymbol, isHalfwidthAlpha, isHalfwidthDigit, isHalfwidthSymbol, isHiragana, isZenkakuKatakana } from './char-utils';
import { fullwidthToHalfwidth, halfwidthToFullwidth } from './fullwidth-halfwidth';
import { zenkakuKatakanaToHankaku, hankakuKatakanaToZenkaku } from './katakana';
import { hiraganaToKatakana, katakanaToHiragana } from './hiragana-katakana';

export interface ConvertOptions {
  direction: 'toHalf' | 'toFull';
  convertAlpha: boolean;
  convertDigit: boolean;
  convertSymbol: boolean;
  convertSpace: boolean;
  convertKatakana: boolean;
  hiraganaToKata: boolean;
  kataToHiragana: boolean;
  toUpper: boolean;
  toLower: boolean;
}

export function convert(text: string, options: ConvertOptions): { result: string; changedCount: number } {
  // ひらがな⇔カタカナ変換（方向に依存しない）
  let working = text;
  if (options.hiraganaToKata) {
    working = hiraganaToKatakana(working);
  }
  if (options.kataToHiragana) {
    working = katakanaToHiragana(working);
  }

  let result = '';
  let changedCount = 0;
  let i = 0;

  if (options.direction === 'toHalf') {
    // 全角カタカナ → 半角カタカナ
    if (options.convertKatakana) {
      working = zenkakuKatakanaToHankaku(working);
    }
    while (i < working.length) {
      const char = working[i];
      const code = char.charCodeAt(0);
      let converted = char;

      // 全角スペース → 半角スペース
      if (options.convertSpace && code === 0x3000) {
        converted = ' ';
      }
      // 全角英字
      else if (options.convertAlpha && isFullwidthAlpha(code)) {
        converted = fullwidthToHalfwidth(char);
      }
      // 全角数字
      else if (options.convertDigit && isFullwidthDigit(code)) {
        converted = fullwidthToHalfwidth(char);
      }
      // 全角記号
      else if (options.convertSymbol && isFullwidthSymbol(code)) {
        converted = fullwidthToHalfwidth(char);
      }

      if (converted !== char) changedCount++;
      result += converted;
      i++;
    }
  } else {
    // 半角カタカナ → 全角カタカナ（2文字結合を処理）
    if (options.convertKatakana) {
      working = hankakuKatakanaToZenkaku(working);
    }
    while (i < working.length) {
      const char = working[i];
      const code = char.charCodeAt(0);
      let converted = char;

      // 半角スペース → 全角スペース
      if (options.convertSpace && code === 0x0020) {
        converted = '\u3000';
      }
      // 半角英字
      else if (options.convertAlpha && isHalfwidthAlpha(code)) {
        converted = halfwidthToFullwidth(char);
      }
      // 半角数字
      else if (options.convertDigit && isHalfwidthDigit(code)) {
        converted = halfwidthToFullwidth(char);
      }
      // 半角記号
      else if (options.convertSymbol && isHalfwidthSymbol(code)) {
        converted = halfwidthToFullwidth(char);
      }

      if (converted !== char) changedCount++;
      result += converted;
      i++;
    }
  }

  // 大文字・小文字変換
  if (options.toUpper) {
    result = result.toUpperCase();
  }
  if (options.toLower) {
    result = result.toLowerCase();
  }

  // ひらがな変換後の変更カウントを補正
  if (options.hiraganaToKata || options.kataToHiragana) {
    let extraCount = 0;
    for (let j = 0; j < text.length; j++) {
      const original = text[j];
      const originalCode = original.charCodeAt(0);
      if (options.hiraganaToKata && isHiragana(originalCode)) extraCount++;
      if (options.kataToHiragana && isZenkakuKatakana(originalCode)) extraCount++;
    }
    changedCount += extraCount;
  }

  return { result, changedCount };
}
