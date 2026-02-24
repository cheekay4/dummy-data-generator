"use client";
import { Progress } from "@/components/ui/progress";
import { FREE_DAILY_LIMIT } from "@/lib/usage";

interface UsageBarProps {
  count: number;
}

export function UsageBar({ count }: UsageBarProps) {
  const remaining = Math.max(0, FREE_DAILY_LIMIT - count);
  const pct = (count / FREE_DAILY_LIMIT) * 100;
  return (
    <div className="mb-4 p-3 rounded-lg border bg-muted/30">
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <span className="text-muted-foreground">本日の残り回数</span>
        <span className={remaining === 0 ? "text-red-500 font-medium" : "font-medium"}>
          {remaining} / {FREE_DAILY_LIMIT} 回
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
