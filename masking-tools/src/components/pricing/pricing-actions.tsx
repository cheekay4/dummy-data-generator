"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/common/checkout-button";
import { ManageSubscriptionButton } from "@/components/common/manage-subscription-button";

export function PricingActions() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(!!localStorage.getItem("masking_subscription_id"));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      {isPro ? (
        <>
          <ManageSubscriptionButton className="flex-1" />
          <Button asChild variant="outline" className="flex-1">
            <Link href="/personal-data-masking">ツールを使う →</Link>
          </Button>
        </>
      ) : (
        <>
          <CheckoutButton className="flex-1" />
          <Button asChild variant="outline" className="flex-1">
            <Link href="/personal-data-masking">無料で使い始める →</Link>
          </Button>
        </>
      )}
    </div>
  );
}
