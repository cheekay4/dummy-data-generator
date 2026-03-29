import { toRomaji } from "wanakana";
import type { IpadicFeatures } from "@/lib/furigana-converter/tokenizer";

export type ConversionMode = "hiragana" | "katakana" | "romaji" | "furigana";

export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function hasKanji(str: string): boolean {
  return /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/.test(str);
}

export function convertTokens(
  tokens: IpadicFeatures[],
  mode: ConversionMode,
  kanjiOnly: boolean
): string {
  const parts: string[] = [];

  for (const token of tokens) {
    const surface = token.surface_form;
    const reading = token.reading || surface;

    if (kanjiOnly && !hasKanji(surface)) {
      parts.push(surface);
      continue;
    }

    switch (mode) {
      case "hiragana":
        parts.push(katakanaToHiragana(reading));
        break;
      case "katakana":
        parts.push(reading);
        break;
      case "romaji":
        parts.push(toRomaji(katakanaToHiragana(reading)));
        break;
      case "furigana":
        if (hasKanji(surface)) {
          parts.push(`${surface}（${katakanaToHiragana(reading)}）`);
        } else {
          parts.push(surface);
        }
        break;
    }
  }

  return parts.join("");
}
