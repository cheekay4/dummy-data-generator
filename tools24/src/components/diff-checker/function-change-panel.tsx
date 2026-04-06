"use client";

import type { FunctionComparison } from "@/lib/diff-checker/function-extractor";

interface FunctionChangePanelProps {
  comparison: FunctionComparison;
}

export function FunctionChangePanel({ comparison }: FunctionChangePanelProps): React.ReactElement {
  const { added, removed, changed } = comparison;
  const hasChanges = added.length > 0 || removed.length > 0 || changed.length > 0;

  if (!hasChanges) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        関数の追加・削除・変更はありません
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">関数の変更検出</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 追加 */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            追加（{added.length}）
          </p>
          <div className="flex flex-wrap gap-1.5">
            {added.length === 0 ? (
              <span className="text-xs text-muted-foreground/60">なし</span>
            ) : (
              added.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-0.5 rounded-md bg-green-100 px-2 py-0.5 text-xs font-mono text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  <span>+</span>
                  {name}
                </span>
              ))
            )}
          </div>
        </div>

        {/* 削除 */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            削除（{removed.length}）
          </p>
          <div className="flex flex-wrap gap-1.5">
            {removed.length === 0 ? (
              <span className="text-xs text-muted-foreground/60">なし</span>
            ) : (
              removed.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-0.5 rounded-md bg-red-100 px-2 py-0.5 text-xs font-mono text-red-800 dark:bg-red-900/30 dark:text-red-400"
                >
                  <span>-</span>
                  {name}
                </span>
              ))
            )}
          </div>
        </div>

        {/* 変更 */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            変更（{changed.length}）
          </p>
          <div className="flex flex-wrap gap-1.5">
            {changed.length === 0 ? (
              <span className="text-xs text-muted-foreground/60">なし</span>
            ) : (
              changed.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-0.5 rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-mono text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                >
                  <span className="font-sans">{"\u25B3"}</span>
                  {name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
