"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { diffLines, Change } from "diff";

export function JsonDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<Change[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = useCallback(() => {
    setError(null);
    try {
      const leftFormatted = left.trim() ? JSON.stringify(JSON.parse(left), null, 2) : "";
      const rightFormatted = right.trim() ? JSON.stringify(JSON.parse(right), null, 2) : "";
      setDiff(diffLines(leftFormatted, rightFormatted));
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSONパースエラー");
    }
  }, [left, right]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">JSON A</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full h-40 font-mono text-sm border rounded-md p-3 bg-background resize-none outline-none focus:ring-2 focus:ring-ring"
            placeholder='{"name": "old"}'
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">JSON B</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full h-40 font-mono text-sm border rounded-md p-3 bg-background resize-none outline-none focus:ring-2 focus:ring-ring"
            placeholder='{"name": "new"}'
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleCompare} className="w-32">比較する</Button>
      </div>

      {error && (
        <div className="text-sm text-destructive border border-destructive/30 rounded-md px-3 py-2">
          エラー: {error}
        </div>
      )}

      {diff && (
        <div className="border rounded-md overflow-auto">
          <div className="flex gap-4 px-3 py-1 bg-muted text-xs text-muted-foreground border-b">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded inline-block" /> 追加
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-200 dark:bg-red-900 rounded inline-block" /> 削除
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-muted-foreground/20 rounded inline-block" /> 変更なし
            </span>
          </div>
          <pre className="font-mono text-xs p-3 overflow-auto max-h-80">
            {diff.map((part, i) => {
              const bg = part.added
                ? "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                : part.removed
                ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 line-through"
                : "text-muted-foreground";
              return (
                <span key={i} className={bg}>
                  {part.value}
                </span>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
}
