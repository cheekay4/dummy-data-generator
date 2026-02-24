'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CheckoutButton({ children, className, variant = 'default', size = 'default' }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className={className} variant={variant} size={size}>
      {loading ? (
        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />処理中...</>
      ) : (
        children ?? 'Proプランに申し込む — 月額490円'
      )}
    </Button>
  );
}
