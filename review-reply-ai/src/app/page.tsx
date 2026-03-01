import HeroSection from '@/components/landing/HeroSection'
import FeatureCards from '@/components/landing/FeatureCards'
import HowItWorks from '@/components/landing/HowItWorks'
import TextLearningDemo from '@/components/landing/TextLearningDemo'
import CustomerAnalysisDemo from '@/components/landing/CustomerAnalysisDemo'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import AdPlaceholder from '@/components/ui/AdPlaceholder'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '本当に無料ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。ログインすれば1日5回まで完全無料です。性格診断もプロファイル設定も無料。ログイン不要でも1回だけお試しいただけます。',
      },
    },
    {
      '@type': 'Question',
      name: '性格診断って何を聞かれるの？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '日常のちょっとした場面を10問聞くだけ。接客やお店の質問は一切ありません。過去のメールや返信文をお持ちなら「テキスト学習」がおすすめです。2〜3件コピペするだけです。',
      },
    },
    {
      '@type': 'Question',
      name: '毎回同じ返信が出てきませんか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。生成のたびに返信の構成パターン（文頭・構成・締め・焦点）をランダムに組み合わせるので、同じ口コミを入れても毎回違う返信になります。Proなら過去の返信履歴も参照して、さらに重複を防ぎます。',
      },
    },
    {
      '@type': 'Question',
      name: 'ネガティブな口コミにも対応できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。星1の厳しい口コミにも、感情的にならない丁寧な返信を生成します。Proなら「クレーム対応モード」の補助スタイルでさらに安心です。',
      },
    },
    {
      '@type': 'Question',
      name: '英語・中国語の口コミにも対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '多言語口コミの読み取りは全プランで対応しています。多言語での返信生成はPro限定です（日本語/英語/中国語/韓国語）。',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />

      {/* AdSense leaderboard under hero */}
      <div className="py-4 bg-white border-b border-stone-100">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* 悩みセクション */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-stone-400 text-center mb-2 tracking-wide">
            飲食店・美容室・クリニック・ホテルのオーナー様へ
          </p>
          <h2 className="text-xl font-bold text-stone-800 text-center mb-6">
            こんな悩み、ありませんか？
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: '😰', text: '口コミ返信、毎回何て書けばいいか悩む…' },
              { emoji: '🤖', text: 'AI返信って、テンプレ感がバレそう…' },
              { emoji: '😤', text: '低評価の口コミに、つい感情的になってしまう…' },
              { emoji: '⏰', text: '1件ずつ返信してたら、他の仕事が回らない…' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-3 bg-stone-50 rounded-xl p-4 border border-stone-100"
              >
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <p className="text-sm text-stone-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureCards />
      <HowItWorks />
      {/* 利用実績 */}
      <section className="py-8 px-4 bg-white border-y border-stone-100">
        <div className="max-w-md mx-auto flex justify-around text-center">
          {[
            { value: '8', label: '対応業種' },
            { value: '4', label: '対応言語' },
            { value: '5回/日', label: '無料で使える' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-stone-800">{item.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <TextLearningDemo />
      <CustomerAnalysisDemo />

      {/* CTA section */}
      <section className="py-14 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-stone-700 font-medium mb-2">まずは性格診断から。2分であなたのトーンをAIに覚えさせましょう。</p>
          <p className="text-stone-500 text-sm mb-6">登録不要・完全無料。診断後すぐに口コミ返信を生成できます。</p>
          <a
            href="/diagnosis"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg"
          >
            無料で性格診断してみる →
          </a>
          <div className="mt-4">
            <a
              href="/generator"
              className="text-sm text-stone-400 hover:text-amber-600 underline underline-offset-4 decoration-stone-300 transition-colors"
            >
              診断なしで今すぐ返信を生成する
            </a>
          </div>
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
