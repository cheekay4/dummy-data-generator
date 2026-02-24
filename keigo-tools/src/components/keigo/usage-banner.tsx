'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FREE_DAILY_LIMIT } from '@/lib/keigo/usage';

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
          本日の無料枠（{FREE_DAILY_LIMIT}回）を使い切りました
        </p>
        <p className="text-amber-700 dark:text-amber-400 text-xs">明日またご利用いただけます</p>
        <Button asChild size="sm" className="mt-1">
          <Link href="/pricing">Proプランにアップグレード（月額290円）</Link>
        </Button>
      </div>
    );
  }

  if (remaining <= 1) {
    return (
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300">
        本日の残り利用回数: あと{remaining}回（無料プラン）
        <Link href="/pricing" className="ml-2 underline">
          Proで無制限に
        </Link>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
      本日の残り利用回数: あと{remaining}回（無料プラン）
    </div>
  );
}
