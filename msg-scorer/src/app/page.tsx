import HeroSection from '@/components/landing/HeroSection';
import TargetPersonas from '@/components/landing/TargetPersonas';
import FeatureCards from '@/components/landing/FeatureCards';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MsgScore',
  url: 'https://msgscore.jp',
  description:
    '配信先セグメントと配信目的を設定して、メルマガ・LINE配信文の効果をAIが予測するスコアリングツール。',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'ja',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'JPY', name: 'Freeプラン' },
    { '@type': 'Offer', price: '980', priceCurrency: 'JPY', name: 'Proプラン', billingIncrement: 'P1M' },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <TargetPersonas />
      <FeatureCards />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
    </>
  );
}
