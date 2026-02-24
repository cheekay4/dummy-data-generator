import HeroSection from '@/components/landing/HeroSection'
import FeatureCards from '@/components/landing/FeatureCards'
import HowItWorks from '@/components/landing/HowItWorks'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import AdPlaceholder from '@/components/ui/AdPlaceholder'

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* AdSense leaderboard under hero */}
      <div className="py-4 bg-white border-b border-stone-100">
        <AdPlaceholder size="leaderboard" />
      </div>

      <FeatureCards />
      <HowItWorks />

      {/* CTA section — LP → /generator */}
      <section className="py-14 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-stone-600 mb-5 text-lg">
            まずは無料で試してみてください。登録不要、すぐに使えます。
          </p>
          <a
            href="/generator"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg"
          >
            無料で返信文を生成する →
          </a>
          <p className="text-stone-400 text-sm mt-3">1日3回まで無料 · クレジットカード不要</p>
        </div>
      </section>

      <PricingSection />
      <FAQSection />

      {/* AdSense rectangle before footer */}
      <div className="py-8 flex justify-center bg-white">
        <AdPlaceholder size="rectangle" />
      </div>
    </>
  )
}
