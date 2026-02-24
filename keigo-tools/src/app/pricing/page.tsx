import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingTable } from '@/components/keigo/pricing-table';
import { PricingActions } from '@/components/pricing/pricing-actions';

export const metadata: Metadata = {
  title: '料金プラン',
  description: '敬語メールライターの料金プラン。無料で3回/日、Proプランで月額290円で無制限利用。',
  robots: { index: false },
};

export default function PricingPage() {
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">料金プラン</h1>
        <p className="text-muted-foreground text-sm">
          まずは無料でお試しいただけます
        </p>
      </div>

      <PricingTable />

      <PricingActions />

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>・お支払いはクレジットカードのみ（Stripe経由）</p>
        <p>・いつでも解約可能。日割り計算なし</p>
        <p>・解約後は即日Freeプランに切り替わります</p>
        <p>・Chrome拡張のライセンスキーを忘れた方は<Link href="/account" className="underline hover:text-foreground">こちら</Link></p>
      </div>
    </div>
  );
}
