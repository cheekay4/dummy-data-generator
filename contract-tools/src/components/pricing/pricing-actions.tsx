'use client';

import { useEffect, useState } from 'react';
import { CheckoutButton } from '@/components/common/checkout-button';
import { ManageSubscriptionButton } from '@/components/common/manage-subscription-button';

export function PricingActions() {
  const [isPro, setIsPro] = useState(false);
  useEffect(() => { setIsPro(!!localStorage.getItem('contract_subscription_id')); }, []);

  if (isPro) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">✓ 現在Proプランをご利用中です</p>
        <ManageSubscriptionButton />
      </div>
    );
  }

  return (
    <div className="text-center">
      <CheckoutButton size="lg" className="w-full sm:w-auto">
        Proプランに申し込む — 月額490円
      </CheckoutButton>
      <p className="text-xs text-muted-foreground mt-2">いつでも解約可能</p>
    </div>
  );
}
