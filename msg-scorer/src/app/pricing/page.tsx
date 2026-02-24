import type { Metadata } from 'next';
import PricingSection from '@/components/landing/PricingSection';

export const metadata: Metadata = {
  title: '料金プラン',
  description: 'MsgScore の料金プランをご確認ください。無料プランで今すぐお試しいただけます。',
  alternates: { canonical: 'https://msgscore.jp/pricing' },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-16">
      <PricingSection />
    </main>
  );
}
