'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FREE_MONTHLY_LIMIT } from '@/lib/contract/usage';

interface UsageBannerProps {
  remaining: number;
  isPro: boolean;
}

export function UsageBanner({ remaining, isPro }: UsageBannerProps) {
  if (isPro) return null;

  if (remaining <= 0) {
    return (
      <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg text-sm space-y-2">
        <p className="font-medium text-amber-800 dark:text-amber-300">
          今月の無料枠（{FREE_MONTHLY_LIMIT}件）を使い切りました
        </p>
        <p className="text-amber-700 dark:text-amber-400 text-xs">来月1日にリセットされます</p>
        <Button asChild size="sm" className="mt-1">
          <Link href="/pricing">Proプランにアップグレード（月額490円）</Link>
        </Button>
      </div>
    );
  }

  if (remaining <= 1) {
    return (
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300">
        今月の残り分析回数: あと{remaining}件（無料プラン）
        <Link href="/pricing" className="ml-2 underline">Proで無制限に</Link>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
      今月の残り分析回数: あと{remaining}件（無料プラン）
    </div>
  );
}
