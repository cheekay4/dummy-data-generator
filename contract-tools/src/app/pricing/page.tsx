import type { Metadata } from 'next';
import { PricingTable } from '@/components/contract/pricing-table';
import { PricingActions } from '@/components/pricing/pricing-actions';

export const metadata: Metadata = {
  title: '料金プラン',
  description: '契約書チェッカーの料金プラン。無料で2件/月、Proプランで月額490円で無制限利用。',
  robots: { index: false },
};

export default function PricingPage() {
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">料金プラン</h1>
        <p className="text-muted-foreground text-sm">まずは無料でお試しいただけます（2件/月）</p>
      </div>
      <PricingTable />
      <PricingActions />
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>・お支払いはクレジットカードのみ（Stripe経由）</p>
        <p>・いつでも解約可能。日割り計算なし</p>
        <p>・解約後は即日Freeプランに切り替わります</p>
      </div>
    </div>
  );
}
