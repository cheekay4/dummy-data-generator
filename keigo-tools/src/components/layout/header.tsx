'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function Header() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(!!localStorage.getItem('keigo_subscription_id'));
  }, []);

  return (
    <header className="border-b bg-background">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            敬語メールライター
          </Link>
          {isPro && (
            <Badge variant="default" className="text-xs">
              Pro
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            料金
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
