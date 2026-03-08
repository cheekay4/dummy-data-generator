import HeroSection from '@/components/landing/HeroSection'
import ProblemsSection from '@/components/landing/ProblemsSection'
import StepsSection from '@/components/landing/StepsSection'
import InputMethodsSection from '@/components/landing/InputMethodsSection'
import TemplateShowcase from '@/components/landing/TemplateShowcase'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import CTASection from '@/components/landing/CTASection'
import AuthTrigger from '@/components/landing/AuthTrigger'

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '本当に無料で使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。メールアドレスで登録するだけで、マニュアルを3件まで無料で作成できます。クレジットカードの登録は不要です。',
      },
    },
    {
      '@type': 'Question',
      name: 'どんな業種に対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '飲食店・美容院・士業事務所の専用ひな形に加え、どの業種でも使える汎用ひな形を用意しています。',
      },
    },
    {
      '@type': 'Question',
      name: 'マニュアルの作成にどのくらいかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AIとの対話は通常15〜30分ほどです。その後、AIがマニュアルを自動生成します。生成は1〜2分程度で完了します。',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AuthTrigger />
      <HeroSection />
      <ProblemsSection />
      <StepsSection />
      <InputMethodsSection />
      <TemplateShowcase />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
