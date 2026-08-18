import type { FmaId } from "../types/anatomy.js";

/** identification フェーズの決定論的採点（仕様 §5.3 / §6.1 L1）: FMA ID の集合比較 */
export interface IdentificationResult {
  correct: FmaId[];
  missed: FmaId[];
  extra: FmaId[];
  /** 正解集合に対する F1（0〜1）。同一入力に対して常に同一 */
  score: number;
}

export function scoreIdentification(
  selected: readonly FmaId[],
  truth: readonly FmaId[]
): IdentificationResult {
  const selectedSet = new Set(selected);
  const truthSet = new Set(truth);
  const correct = [...truthSet].filter((id) => selectedSet.has(id)).sort();
  const missed = [...truthSet].filter((id) => !selectedSet.has(id)).sort();
  const extra = [...selectedSet].filter((id) => !truthSet.has(id)).sort();

  const precision = selectedSet.size === 0 ? 0 : correct.length / selectedSet.size;
  const recall = truthSet.size === 0 ? 0 : correct.length / truthSet.size;
  const score =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return { correct, missed, extra, score };
}
