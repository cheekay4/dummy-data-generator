/**
 * diff エンジン — diff npm パッケージのラッパー
 * 行レベル・単語レベルの差分計算、統一diff生成、統計情報を提供
 */

import { diffLines, diffWords, createPatch, type Change } from "diff";

export interface LineDiff {
  value: string;
  added: boolean;
  removed: boolean;
}

export interface WordDiff {
  value: string;
  added: boolean;
  removed: boolean;
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

export interface DiffResult {
  lineDiffs: LineDiff[];
  stats: DiffStats;
}

/**
 * 行レベルの差分を計算する
 */
export function computeLineDiff(textA: string, textB: string): DiffResult {
  const changes: Change[] = diffLines(textA, textB);
  const lineDiffs: LineDiff[] = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const change of changes) {
    const lines = change.value.split("\n");
    // 末尾の空文字列を除去（split の結果）
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.pop();
    }

    for (const line of lines) {
      if (change.added) {
        lineDiffs.push({ value: line, added: true, removed: false });
        added++;
      } else if (change.removed) {
        lineDiffs.push({ value: line, added: false, removed: true });
        removed++;
      } else {
        lineDiffs.push({ value: line, added: false, removed: false });
        unchanged++;
      }
    }
  }

  // changed = 追加行と削除行の最小値（ペアで変更とみなす）
  const changed = Math.min(added, removed);

  return {
    lineDiffs,
    stats: {
      added: added - changed,
      removed: removed - changed,
      changed,
      unchanged,
    },
  };
}

/**
 * 単語レベルのインライン差分を計算する
 */
export function computeWordDiff(lineA: string, lineB: string): WordDiff[] {
  const changes: Change[] = diffWords(lineA, lineB);
  return changes.map((change) => ({
    value: change.value,
    added: change.added ?? false,
    removed: change.removed ?? false,
  }));
}

/**
 * 統一diff形式の文字列を生成する
 */
export function generateUnifiedPatch(
  textA: string,
  textB: string,
  filename: string = "file"
): string {
  return createPatch(
    filename,
    textA,
    textB,
    "変更前",
    "変更後",
    { context: 3 }
  );
}
