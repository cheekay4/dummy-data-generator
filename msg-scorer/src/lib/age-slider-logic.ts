export type AgeKey = 'under20' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixtiesPlus';

export type AgeDist = Record<AgeKey, number>;

const ALL_KEYS: AgeKey[] = ['under20', 'twenties', 'thirties', 'forties', 'fifties', 'sixtiesPlus'];

/** 合計% を小数点1桁で返す */
export function calcTotal(dist: AgeDist): number {
  return parseFloat(Object.values(dist).reduce((a, b) => a + b, 0).toFixed(1));
}

/** 合計人数を返す（各年代を Math.round して合算） */
export function calcTotalPersonCount(dist: AgeDist, totalRecipients: number): number {
  return ALL_KEYS.reduce(
    (sum, key) => sum + Math.round((dist[key] / 100) * totalRecipients),
    0
  );
}

/**
 * スライダー操作: key を val% に変更する。
 *
 * 増加時: 新合計が 100% を超える場合のみ、超過分を他年代から盗んで 100% に収める。
 *         100% 以内なら他年代に影響を与えない（total が増える）。
 * 減少時: 現在の合計が 100% 以上の場合のみ、他年代を増やして合計を維持する。
 *         100% 未満なら他年代に影響を与えない（total が下がる）。
 */
export function updateBySlider(dist: AgeDist, key: AgeKey, val: number): AgeDist {
  const old = dist[key];
  const diff = val - old;
  if (diff === 0) return dist;

  const total = calcTotal(dist);
  const newTotal = parseFloat((total + diff).toFixed(1));

  if (diff > 0) {
    // ── 増加 ──
    if (newTotal > 100) {
      // 超過分だけ他年代から盗む
      const excess = parseFloat((newTotal - 100).toFixed(1));
      const otherTotal = parseFloat((total - old).toFixed(1));
      if (otherTotal < excess) return dist; // 盗めない → ブロック

      const newDist = { ...dist, [key]: val };
      let remaining = excess;
      const toReduce = ALL_KEYS.filter((k) => k !== key && newDist[k] > 0);
      for (let i = toReduce.length - 1; i >= 0 && remaining > 0; i--) {
        const k = toReduce[i];
        const change = Math.min(remaining, newDist[k]);
        newDist[k] = parseFloat((newDist[k] - change).toFixed(1));
        remaining = parseFloat((remaining - change).toFixed(1));
      }
      return newDist;
    }
    // 100% 以内: そのまま設定（他年代に影響なし）
    return { ...dist, [key]: val };
  } else {
    // ── 減少 ──
    if (total >= 100) {
      // 合計 100% 以上のとき: 他年代を増やして合計を維持
      const newDist = { ...dist, [key]: val };
      let remaining = diff; // 負数 (e.g. -15)
      const toFill = ALL_KEYS.filter((k) => k !== key && newDist[k] > 0);
      for (let i = toFill.length - 1; i >= 0 && remaining !== 0; i--) {
        const k = toFill[i];
        const change = Math.min(Math.abs(remaining), newDist[k]);
        newDist[k] = parseFloat((newDist[k] + change).toFixed(1));
        remaining = parseFloat((remaining + change).toFixed(1)); // -15+5=-10 → 0 に近づく
      }
      return newDist;
    }
    // 合計 100% 未満: そのまま設定（合計が下がることを許容）
    return { ...dist, [key]: val };
  }
}

/**
 * 直接入力（%フィールド）: この年代だけ更新、他年代は一切変更しない。
 */
export function updateDirect(dist: AgeDist, key: AgeKey, pct: number): AgeDist {
  return { ...dist, [key]: parseFloat(pct.toFixed(1)) };
}

/**
 * 人数フィールド直接入力: 人数 → % に変換して updateDirect 相当の処理を行う。
 * totalRecipients が 0 の場合は何もしない。
 */
export function updateByPersonCount(
  dist: AgeDist,
  key: AgeKey,
  count: number,
  totalRecipients: number
): AgeDist {
  if (totalRecipients <= 0) return dist;
  const pct = parseFloat(((count / totalRecipients) * 100).toFixed(1));
  return updateDirect(dist, key, pct);
}
