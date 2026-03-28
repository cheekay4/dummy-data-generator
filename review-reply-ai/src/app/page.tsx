import Link from 'next/link'
import { blogPosts } from '@/lib/blog-posts'
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
        text: 'はい。ログインすれば1日5回まで完全無料です。性格診断・返信プロファイル作成（1件）・客層分析もすべて無料で使えます。ログイン不要でも1日3回までお試しいただけます。',
      },
    },
    {
      '@type': 'Question',
      name: '性格診断って何を聞かれるの？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '「友達に久しぶりに会ったら？」「旅行の話をどう伝える？」など、日常のちょっとした場面を10問聞くだけです。接客やお店の質問は一切ありません。過去のメールや返信文をお持ちなら「テキスト学習」もおすすめです。2〜3件コピペするだけで、より正確にあなたの文体を再現できます。',
      },
    },
    {
      '@type': 'Question',
      name: '返信プロファイルって何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '性格診断やテキスト学習をもとにAIが自動生成する「あなたの返信の人格」です。温かみ・社交性・丁寧さ・独自性の4つの軸であなたらしさを数値化し、返信のトーンを再現します。あとからスライダーで微調整もできます。Freeプランでは1件、Proプランでは最大5件まで作成できます。',
      },
    },
    {
      '@type': 'Question',
      name: '毎回同じ返信が出てきませんか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。生成のたびに返信の構成パターン（文頭・構成・締め・焦点）をランダムに組み合わせるので、同じ口コミを入れても毎回違う返信になります。Proプランなら過去90日分の返信履歴も参照して、さらに表現の重複を防ぎます。',
      },
    },
    {
      '@type': 'Question',
      name: 'ネガティブな口コミにも対応できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。星1の厳しい口コミにも、感情的にならない丁寧な返信を生成します。Proプランなら「クレーム対応モード」の補助スタイルで、謝罪・改善提案・再来店誘導まで含めたプロフェッショナルな返信を作れます。',
      },
    },
    {
      '@type': 'Question',
      name: '性格診断なしでも使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。性格診断をスキップしても、トーン（丁寧・フレンドリー・カジュアル）を選ぶだけで返信を生成できます。ただし、返信プロファイルを作成すると、あなた固有の文体がより正確に再現されるためおすすめです。',
      },
    },
    {
      '@type': 'Question',
      name: '補助スタイルって何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'クレーム対応・お祝い・常連さん向け・ビジネス・インバウンドの5種類から選べる、シーン別の調整モードです（Pro限定）。あなたの返信プロファイルはそのままに、状況に合わせた最適なトーン調整が加わります。',
      },
    },
    {
      '@type': 'Question',
      name: '客層分析って何がわかるの？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '口コミの文面から、推定年齢層・利用シーン・重視ポイント・リピート可能性などをAIが分析します。どんなお客様が多いかの傾向把握に役立ちます。Freeプランから利用できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'どの口コミサイトに対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Googleマップ・食べログ・ホットペッパー・Amazon・楽天・じゃらん・トリップアドバイザーなど、8つのプラットフォームに対応しています。プラットフォームごとの文化やトーンに合わせた返信を生成します。',
      },
    },
    {
      '@type': 'Question',
      name: '英語・中国語の口コミにも対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '外国語で書かれた口コミの読み取りは、全プランで対応しています。多言語での返信文の生成はPro限定です（日本語・英語・中国語・韓国語の4言語）。',
      },
    },
    {
      '@type': 'Question',
      name: 'テキスト学習って何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '過去に書いたメールや口コミ返信文を2〜3件コピペするだけで、AIがあなたの文体・トーンを分析し、返信プロファイルを作成する機能です。性格診断より正確にあなたらしさを再現できます。Freeプランから利用できます。',
      },
    },
    {
      '@type': 'Question',
      name: '生成された返信はそのまま使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '多くの場合そのまま使えます。ただし、お店の固有情報（メニュー名・スタッフ名など）は必要に応じて追記してください。生成後に「手直しアドバイス」も表示されるので、参考にしながら仕上げることができます。',
      },
    },
    {
      '@type': 'Question',
      name: '食べログやホットペッパーの口コミにも対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、対応しています。MyReplyToneはGoogle口コミ、食べログ、ホットペッパービューティー、じゃらん、一休.com、Retty、トリップアドバイザーなど、主要な口コミプラットフォームの返信文を生成できます。口コミのテキストを貼り付けるだけで、プラットフォームを問わずあなたのトーンに合った返信文を生成します。',
      },
    },
    {
      '@type': 'Question',
      name: '他のAIツール（ChatGPT等）との違いは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '最大の違いは「パーソナライズ」です。ChatGPTなどの汎用AIは毎回プロンプトで指示する必要がありますが、MyReplyToneは性格診断やテキスト学習であなたの返信スタイルを一度覚えると、それ以降は口コミを貼り付けるだけでテンプレ感のない返信を自動生成します。また、8業種の特性を学習しているため、医療広告ガイドラインや飲食店特有の表現など、業種ごとの注意点も自動で考慮します。',
      },
    },
    {
      '@type': 'Question',
      name: 'Proプランはいつでも解約できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。マイページからいつでも解約できます。解約後は次の課金日をもってFreeプランに移行します。返信プロファイルのデータは削除されずに残りますが、Freeプランではプロファイルの新規作成が1件までに制限されます。履歴データも削除はされませんが、Freeプランでは閲覧できなくなります（再度Proに戻ると閲覧可能です）。',
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

      {/* 口コミ対策ガイド */}
      <section className="py-16 px-4 bg-stone-50 border-y border-stone-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">口コミ対策ガイド</h2>
          <p className="text-sm text-stone-500 text-center mb-8">口コミ返信のノウハウを無料公開しています</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/guide/google-review-reply" className="border border-stone-200 bg-white rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
              <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">基本</span>
              <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors text-sm mt-2 mb-1">Google口コミ返信の書き方</p>
              <p className="text-xs text-stone-500">良い口コミ・悪い口コミ別の返信構成と例文</p>
            </Link>
            <Link href="/guide/negative-review" className="border border-stone-200 bg-white rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
              <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">対応</span>
              <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors text-sm mt-2 mb-1">悪い口コミへの対応方法</p>
              <p className="text-xs text-stone-500">炎上させずに誠実に返す4ステップ</p>
            </Link>
            <Link href="/guide/meo" className="border border-stone-200 bg-white rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
              <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">MEO</span>
              <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors text-sm mt-2 mb-1">MEO対策と口コミ管理</p>
              <p className="text-xs text-stone-500">Googleマップ上位表示のポイント</p>
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link href="/guide" className="text-sm text-amber-600 hover:text-amber-700 font-medium">全10本のガイドを見る →</Link>
          </div>
        </div>
      </section>

      {/* 最新のコラム */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">最新の記事</h2>
          <p className="text-sm text-stone-500 text-center mb-8">口コミ対策に役立つコラムをお届けします</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="border border-stone-100 rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
                <p className="text-xs text-stone-400 mb-2">{post.publishedAt}</p>
                <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors text-sm mb-2">{post.title}</p>
                <p className="text-xs text-stone-500 line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/blog" className="text-sm text-amber-600 hover:text-amber-700 font-medium">全記事を見る →</Link>
          </div>
        </div>
      </section>

      {/* AdSense rectangle before footer */}
      <div className="py-8 flex justify-center bg-white">
        <AdPlaceholder size="rectangle" />
      </div>
    </>
  )
}
