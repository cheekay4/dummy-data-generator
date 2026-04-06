"use client";

import type { DiffStats } from "@/lib/diff-checker/diff-engine";

interface DiffStatsBarProps {
  stats: DiffStats;
}

export function DiffStatsBar({ stats }: DiffStatsBarProps): React.ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2.5 text-sm">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="text-muted-foreground">変更</span>
        <span className="font-semibold">{"\u25B3"}{stats.changed}行</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-muted-foreground">追加</span>
        <span className="font-semibold text-green-700 dark:text-green-400">+{stats.added}行</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="text-muted-foreground">削除</span>
        <span className="font-semibold text-red-700 dark:text-red-400">-{stats.removed}行</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
        <span className="text-muted-foreground">変更なし</span>
        <span className="font-semibold">{stats.unchanged}行</span>
      </span>
    </div>
  );
}
