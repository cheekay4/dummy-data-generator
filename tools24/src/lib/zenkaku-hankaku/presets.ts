import type { ConvertOptions } from './converter';

export interface Preset {
  label: string;
  description: string;
  options: ConvertOptions;
}

export const PRESETS: Preset[] = [
  {
    label: '住所正規化',
    description: '数字→半角、カタカナ→全角、スペース→半角',
    options: {
      direction: 'toHalf',
      convertAlpha: false,
      convertDigit: true,
      convertSymbol: false,
      convertSpace: true,
      convertKatakana: false,
      hiraganaToKata: false,
      kataToHiragana: false,
      toUpper: false,
      toLower: false,
    },
  },
  {
    label: 'データ入力統一',
    description: '英数字・記号・スペースを全て半角に統一',
    options: {
      direction: 'toHalf',
      convertAlpha: true,
      convertDigit: true,
      convertSymbol: true,
      convertSpace: true,
      convertKatakana: false,
      hiraganaToKata: false,
      kataToHiragana: false,
      toUpper: false,
      toLower: false,
    },
  },
  {
    label: 'Web制作用',
    description: '英数字・記号を半角、カタカナを全角、小文字化',
    options: {
      direction: 'toHalf',
      convertAlpha: true,
      convertDigit: true,
      convertSymbol: true,
      convertSpace: true,
      convertKatakana: false,
      hiraganaToKata: false,
      kataToHiragana: false,
      toUpper: false,
      toLower: true,
    },
  },
  {
    label: '印刷用',
    description: '全ての文字を全角に統一',
    options: {
      direction: 'toFull',
      convertAlpha: true,
      convertDigit: true,
      convertSymbol: true,
      convertSpace: true,
      convertKatakana: true,
      hiraganaToKata: false,
      kataToHiragana: false,
      toUpper: false,
      toLower: false,
    },
  },
];
