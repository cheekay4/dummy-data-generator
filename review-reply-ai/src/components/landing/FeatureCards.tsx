import { Brain, Building2, ShieldCheck } from 'lucide-react'

export default function FeatureCards() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-10">
          選ばれる3つの理由
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-stone-800 mb-2">あなたのトーンを再現</h3>
            <p className="text-stone-600 text-sm leading-relaxed">2分の性格診断でAIがあなたの文体を学習。テンプレ感ゼロの返信を自動生成します。</p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-stone-800 mb-2">業種別に最適化</h3>
            <p className="text-stone-600 text-sm leading-relaxed">飲食・美容・クリニックなど8業種のトーンと表現を自動調整。</p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-stone-800 mb-2">ネガティブ対応も安心</h3>
            <p className="text-stone-600 text-sm leading-relaxed">感情的にならない、プロフェッショナルな謝罪・改善・再来店誘導の返信を提案。</p>
          </div>
        </div>
      </div>
    </section>
  )
}
