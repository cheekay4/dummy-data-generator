import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SuccessContent } from '@/components/success/success-content';

export const metadata: Metadata = {
  title: '登録完了',
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">読み込み中...</span>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
