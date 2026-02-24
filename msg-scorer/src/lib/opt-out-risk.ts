/**
 * 配信停止（オプトアウト）を誘発しやすいパターンを検知する。
 * テキスト単体で判定できる「過剰な表現」にフォーカス。
 * 配信頻度・リスト品質は含めない（テキストから判定不可のため）。
 */

export type OptOutRiskLevel = 'low' | 'medium' | 'high';

export interface OptOutRiskResult {
  level: OptOutRiskLevel;
  reasons: string[];
  score: number; // 0-100 リスクスコア（高いほどリスク大）
}

interface RiskRule {
  label: string;
  weight: number; // リスクポイント
  test: (text: string) => boolean;
}

const RULES: RiskRule[] = [
  // ── 過剰な絵文字 ──────────────────────────────────────────────────
  {
    label: '同じ絵文字が3回以上連続しています（受信者に圧迫感を与えやすい）',
    weight: 20,
    test: (t) => /(.)\1{2,}/u.test([...t].filter(c => /\p{Emoji}/u.test(c)).join('')),
  },
  {
    label: '絵文字が10個以上含まれています（過剰装飾はスパム判定のリスクあり）',
    weight: 15,
    test: (t) => ([...t].filter(c => /\p{Emoji}/u.test(c)).length >= 10),
  },
  // ── 過剰な記号・感嘆符 ───────────────────────────────────────────
  {
    label: '感嘆符（!・！）が5回以上あります（過剰な煽りは解除を誘発しやすい）',
    weight: 15,
    test: (t) => (t.match(/[!！]/g)?.length ?? 0) >= 5,
  },
  {
    label: '「？」「！」の多用（3連続以上）が見られます',
    weight: 10,
    test: (t) => /[!！?？]{3,}/.test(t),
  },
  // ── 過剰な緊急性訴求 ─────────────────────────────────────────────
  {
    label: '「今すぐ」「今だけ」「今すぐ」が3回以上繰り返されています（強引な印象を与えます）',
    weight: 20,
    test: (t) => {
      const count = (t.match(/今すぐ|今だけ|今のうち/g)?.length ?? 0);
      return count >= 3;
    },
  },
  {
    label: '「限定」「期間限定」が4回以上繰り返されています',
    weight: 15,
    test: (t) => (t.match(/限定/g)?.length ?? 0) >= 4,
  },
  // ── 煽り・スパム表現 ─────────────────────────────────────────────
  {
    label: '「無視しないで」「見逃さないで」「放置厳禁」などの強制的な表現が含まれています',
    weight: 25,
    test: (t) => /無視しないで|見逃さないで|放置厳禁|開封必須|必ず読んで/.test(t),
  },
  {
    label: '「当選」「当選確率」「プレゼント当選」などの過剰な景品訴求が含まれています',
    weight: 20,
    test: (t) => /当選確率|当選しました|当選おめでとう|プレゼントが当たる/.test(t),
  },
  {
    label: '全角大文字が10文字以上連続しています（可読性低下・圧迫感）',
    weight: 10,
    test: (t) => /[Ａ-Ｚ]{10,}|[ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ]{5,}/.test(t),
  },
  // ── 件名/本文のアンバランス（長すぎる件名） ─────────────────────
  {
    label: '件名が40文字を超えています（多くのメールクライアントで末尾が切れてしまいます）',
    weight: 10,
    test: (t) => false, // 件名は別途チェック（subject専用ルールで対応）
  },
];

// 件名専用ルール
const SUBJECT_RULES: RiskRule[] = [
  {
    label: '件名が40文字を超えています（多くのメールクライアントで末尾が切れてしまいます）',
    weight: 10,
    test: (s) => s.length > 40,
  },
  {
    label: '件名が50文字を超えています（スマートフォンでほぼ確実に切れます）',
    weight: 20,
    test: (s) => s.length > 50,
  },
];

export function detectOptOutRisk(
  text: string,
  subject?: string,
): OptOutRiskResult {
  const reasons: string[] = [];
  let score = 0;

  // 本文チェック（件名専用ルールは除外）
  for (const rule of RULES.filter(r => r.weight > 0)) {
    if (rule.test(text)) {
      reasons.push(rule.label);
      score += rule.weight;
    }
  }

  // 件名チェック
  if (subject) {
    for (const rule of SUBJECT_RULES) {
      if (rule.test(subject)) {
        reasons.push(rule.label);
        score += rule.weight;
      }
    }
  }

  const clamped = Math.min(100, score);
  const level: OptOutRiskLevel =
    clamped >= 40 ? 'high' :
    clamped >= 20 ? 'medium' : 'low';

  return { level, reasons, score: clamped };
}
