"use client";

import { useState, useMemo } from "react";
import type { LineDiff } from "@/lib/diff-checker/diff-engine";
import { computeWordDiff } from "@/lib/diff-checker/diff-engine";

interface DiffViewerProps {
  lineDiffs: LineDiff[];
  textA: string;
  textB: string;
}

type ViewMode = "unified" | "side-by-side";

interface SideBySideLine {
  leftNum: number | null;
  leftContent: string | null;
  leftType: "added" | "removed" | "unchanged";
  rightNum: number | null;
  rightContent: string | null;
  rightType: "added" | "removed" | "unchanged";
}

export function DiffViewer({ lineDiffs, textA, textB }: DiffViewerProps): React.ReactElement {
  const [viewMode, setViewMode] = useState<ViewMode>("unified");
  const [changesOnly, setChangesOnly] = useState(false);

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode("unified")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "unified"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted"
            }`}
          >
            統合ビュー
          </button>
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "side-by-side"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted"
            }`}
          >
            並列ビュー
          </button>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={changesOnly}
            onChange={(e) => setChangesOnly(e.target.checked)}
            className="rounded"
          />
          変更行のみ
        </label>
      </div>

      {/* Diff content */}
      <div className="overflow-x-auto">
        {viewMode === "unified" ? (
          <UnifiedView lineDiffs={lineDiffs} changesOnly={changesOnly} />
        ) : (
          <SideBySideView textA={textA} textB={textB} lineDiffs={lineDiffs} changesOnly={changesOnly} />
        )}
      </div>
    </div>
  );
}

/* ============================
   統合ビュー
   ============================ */

function UnifiedView({
  lineDiffs,
  changesOnly,
}: {
  lineDiffs: LineDiff[];
  changesOnly: boolean;
}): React.ReactElement {
  // 行番号を計算（A側・B側）
  const numberedLines = useMemo(() => {
    let lineA = 0;
    let lineB = 0;
    return lineDiffs.map((diff) => {
      if (diff.removed) {
        lineA++;
        return { ...diff, numA: lineA, numB: null };
      } else if (diff.added) {
        lineB++;
        return { ...diff, numA: null, numB: lineB };
      } else {
        lineA++;
        lineB++;
        return { ...diff, numA: lineA, numB: lineB };
      }
    });
  }, [lineDiffs]);

  // 変更行のみペアリングして word diff
  const wordDiffPairs = useMemo(() => {
    const pairs = new Map<number, number>();
    let i = 0;
    while (i < numberedLines.length) {
      if (numberedLines[i].removed) {
        // 連続する removed の後に added が来るかチェック
        const removeStart = i;
        while (i < numberedLines.length && numberedLines[i].removed) i++;
        const addStart = i;
        while (i < numberedLines.length && numberedLines[i].added) i++;
        const addEnd = i;
        // ペアリング
        const removeCount = addStart - removeStart;
        const addCount = addEnd - addStart;
        const pairCount = Math.min(removeCount, addCount);
        for (let p = 0; p < pairCount; p++) {
          pairs.set(removeStart + p, addStart + p);
        }
      } else {
        i++;
      }
    }
    return pairs;
  }, [numberedLines]);

  const filtered = changesOnly
    ? numberedLines.filter((l) => l.added || l.removed)
    : numberedLines;

  return (
    <table className="w-full text-xs font-mono">
      <tbody>
        {filtered.map((line, idx) => {
          const bgClass = line.added
            ? "bg-green-50 dark:bg-green-950/30"
            : line.removed
              ? "bg-red-50 dark:bg-red-950/30"
              : "";
          const prefix = line.added ? "+" : line.removed ? "-" : " ";
          const prefixColor = line.added
            ? "text-green-700 dark:text-green-400"
            : line.removed
              ? "text-red-700 dark:text-red-400"
              : "text-muted-foreground/40";

          // word diff rendering
          const originalIdx = numberedLines.indexOf(line);
          const pairIdx = wordDiffPairs.get(originalIdx);
          let contentNode: React.ReactNode;

          if (line.removed && pairIdx !== undefined) {
            const pairedLine = numberedLines[pairIdx];
            const wordDiffs = computeWordDiff(line.value, pairedLine.value);
            contentNode = wordDiffs
              .filter((w) => !w.added)
              .map((w, wi) =>
                w.removed ? (
                  <span key={wi} className="bg-red-200 dark:bg-red-800/60 rounded-sm px-px">
                    {w.value}
                  </span>
                ) : (
                  <span key={wi}>{w.value}</span>
                )
              );
          } else if (line.added && Array.from(wordDiffPairs.values()).includes(originalIdx)) {
            const removeIdx = Array.from(wordDiffPairs.entries()).find(
              ([, v]) => v === originalIdx
            )?.[0];
            if (removeIdx !== undefined) {
              const removedLine = numberedLines[removeIdx];
              const wordDiffs = computeWordDiff(removedLine.value, line.value);
              contentNode = wordDiffs
                .filter((w) => !w.removed)
                .map((w, wi) =>
                  w.added ? (
                    <span key={wi} className="bg-green-200 dark:bg-green-800/60 rounded-sm px-px">
                      {w.value}
                    </span>
                  ) : (
                    <span key={wi}>{w.value}</span>
                  )
                );
            } else {
              contentNode = line.value;
            }
          } else {
            contentNode = line.value;
          }

          return (
            <tr key={idx} className={bgClass}>
              <td className="w-10 select-none text-right pr-1 text-muted-foreground/50 border-r">
                {line.numA ?? ""}
              </td>
              <td className="w-10 select-none text-right pr-1 text-muted-foreground/50 border-r">
                {line.numB ?? ""}
              </td>
              <td className={`w-4 select-none text-center ${prefixColor}`}>
                {prefix}
              </td>
              <td className="pl-1 pr-4 py-px whitespace-pre">{contentNode}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ============================
   並列ビュー
   ============================ */

function SideBySideView({
  textA,
  textB,
  lineDiffs,
  changesOnly,
}: {
  textA: string;
  textB: string;
  lineDiffs: LineDiff[];
  changesOnly: boolean;
}): React.ReactElement {
  const rows = useMemo((): SideBySideLine[] => {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const result: SideBySideLine[] = [];
    let idxA = 0;
    let idxB = 0;

    for (const diff of lineDiffs) {
      if (diff.removed) {
        result.push({
          leftNum: idxA + 1,
          leftContent: linesA[idxA] ?? diff.value,
          leftType: "removed",
          rightNum: null,
          rightContent: null,
          rightType: "unchanged",
        });
        idxA++;
      } else if (diff.added) {
        result.push({
          leftNum: null,
          leftContent: null,
          leftType: "unchanged",
          rightNum: idxB + 1,
          rightContent: linesB[idxB] ?? diff.value,
          rightType: "added",
        });
        idxB++;
      } else {
        result.push({
          leftNum: idxA + 1,
          leftContent: linesA[idxA] ?? diff.value,
          leftType: "unchanged",
          rightNum: idxB + 1,
          rightContent: linesB[idxB] ?? diff.value,
          rightType: "unchanged",
        });
        idxA++;
        idxB++;
      }
    }

    return result;
  }, [textA, textB, lineDiffs]);

  // removed/added のペアをマージして word-diff できるようにする
  const mergedRows = useMemo((): SideBySideLine[] => {
    const merged: SideBySideLine[] = [];
    let i = 0;

    while (i < rows.length) {
      const row = rows[i];
      if (row.leftType === "removed" && i + 1 < rows.length && rows[i + 1].rightType === "added") {
        merged.push({
          leftNum: row.leftNum,
          leftContent: row.leftContent,
          leftType: "removed",
          rightNum: rows[i + 1].rightNum,
          rightContent: rows[i + 1].rightContent,
          rightType: "added",
        });
        i += 2;
      } else {
        merged.push(row);
        i++;
      }
    }

    return merged;
  }, [rows]);

  const filtered = changesOnly
    ? mergedRows.filter(
        (r) => r.leftType !== "unchanged" || r.rightType !== "unchanged"
      )
    : mergedRows;

  return (
    <table className="w-full text-xs font-mono table-fixed">
      <tbody>
        {filtered.map((row, idx) => {
          const leftBg =
            row.leftType === "removed"
              ? "bg-red-50 dark:bg-red-950/30"
              : "";
          const rightBg =
            row.rightType === "added"
              ? "bg-green-50 dark:bg-green-950/30"
              : "";

          // word-level diff if both sides present and changed
          let leftNode: React.ReactNode = row.leftContent ?? "";
          let rightNode: React.ReactNode = row.rightContent ?? "";

          if (
            row.leftType === "removed" &&
            row.rightType === "added" &&
            row.leftContent !== null &&
            row.rightContent !== null
          ) {
            const wordDiffs = computeWordDiff(row.leftContent, row.rightContent);
            leftNode = wordDiffs
              .filter((w) => !w.added)
              .map((w, wi) =>
                w.removed ? (
                  <span key={wi} className="bg-red-200 dark:bg-red-800/60 rounded-sm px-px">
                    {w.value}
                  </span>
                ) : (
                  <span key={wi}>{w.value}</span>
                )
              );
            rightNode = wordDiffs
              .filter((w) => !w.removed)
              .map((w, wi) =>
                w.added ? (
                  <span key={wi} className="bg-green-200 dark:bg-green-800/60 rounded-sm px-px">
                    {w.value}
                  </span>
                ) : (
                  <span key={wi}>{w.value}</span>
                )
              );
          }

          return (
            <tr key={idx}>
              {/* Left side */}
              <td className={`w-8 select-none text-right pr-1 text-muted-foreground/50 border-r ${leftBg}`}>
                {row.leftNum ?? ""}
              </td>
              <td className={`w-[calc(50%-1rem)] pl-2 pr-2 py-px whitespace-pre overflow-hidden text-ellipsis border-r ${leftBg}`}>
                {leftNode}
              </td>
              {/* Right side */}
              <td className={`w-8 select-none text-right pr-1 text-muted-foreground/50 border-r ${rightBg}`}>
                {row.rightNum ?? ""}
              </td>
              <td className={`w-[calc(50%-1rem)] pl-2 pr-2 py-px whitespace-pre overflow-hidden text-ellipsis ${rightBg}`}>
                {rightNode}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
