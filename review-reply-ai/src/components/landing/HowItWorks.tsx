import { Brain, Star, Mail } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-12">
          たった3ステップで完成
        </h2>
        <div className="space-y-6">
          <div className="flex gap-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1">STEP 01</p>
              <h3 className="font-bold text-stone-800 mb-1">AIにあなたの性格を教える（2分）</h3>
              <p className="text-sm text-stone-500 mb-1">10問の性格診断に答えるだけ。日常の行動パターンからAIがあなたの返信スタイルを自動分析します。</p>
              <p className="text-xs text-amber-600">過去の返信文がある方は「テキスト学習」でさらに精度UP</p>
            </div>
          </div>

          <div className="flex gap-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1">STEP 02</p>
              <h3 className="font-bold text-stone-800 mb-1">クチコミを貼り付ける</h3>
              <p className="text-sm text-stone-500 mb-1">Google口コミ・食べログ・ホットペッパーなど、どのプラットフォームの口コミでもOK。</p>
              <p className="text-xs text-amber-600">星評価と業種を選ぶだけ</p>
            </div>
          </div>

          <div className="flex gap-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1">STEP 03</p>
              <h3 className="font-bold text-stone-800 mb-1">あなたらしい返信が2パターン届く</h3>
              <p className="text-sm text-stone-500 mb-1">テンプレ感ゼロの、あなたの人柄が伝わる返信が自動生成されます。</p>
              <Link href="/advice" className="text-xs text-amber-600 hover:underline">手直しのコツも無料で見られます →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
