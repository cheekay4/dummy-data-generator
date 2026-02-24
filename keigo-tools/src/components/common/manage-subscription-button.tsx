'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ManageSubscriptionButtonProps {
  className?: string;
}

export function ManageSubscriptionButton({ className }: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const customerId =
      typeof window !== 'undefined' ? localStorage.getItem('keigo_customer_id') : null;

    if (!customerId) {
      alert('顧客情報が見つかりません。サポートまでお問い合わせください。');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Portal error:', data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Portal error:', err);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline" className={className}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          処理中...
        </>
      ) : (
        'サブスクリプション管理'
      )}
    </Button>
  );
}
