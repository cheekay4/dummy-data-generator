import { scoreJapanese } from './scoring';
import { fixMojibake, type SupportedEncoding } from './convert';

export interface DetectionResult {
  from: SupportedEncoding;
  to: SupportedEncoding;
  confidence: 'high' | 'medium' | 'low';
  score: number;
  fixedText: string;
}

const ENCODINGS: SupportedEncoding[] = ['UTF8', 'SJIS', 'EUCJP', 'JIS'];

export function autoDetect(text: string): DetectionResult | null {
  if (!text || text.length < 4) return null;

  let best: { from: SupportedEncoding; to: SupportedEncoding; score: number; fixedText: string } | null = null;

  for (const from of ENCODINGS) {
    for (const to of ENCODINGS) {
      if (from === to) continue;
      try {
        const fixedText = fixMojibake(text, from, to);
        if (!fixedText || fixedText === text) continue;
        const score = scoreJapanese(fixedText);
        if (score > 0.05 && (!best || score > best.score)) {
          best = { from, to, score, fixedText };
        }
      } catch {
        // 変換失敗はスキップ
      }
    }
  }

  if (!best) return null;

  let confidence: 'high' | 'medium' | 'low';
  if (best.score >= 0.3) {
    confidence = 'high';
  } else if (best.score >= 0.1) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    from: best.from,
    to: best.to,
    confidence,
    score: best.score,
    fixedText: best.fixedText,
  };
}
