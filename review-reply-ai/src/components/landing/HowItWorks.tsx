export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'あなたの文章をAIに学習させる（1分）',
      description: '過去の口コミ返信やメールを2〜3件コピペするだけ。AIがあなたの書き方のクセ・人柄を自動分析。',
      sub: '「文章がない？」→ 10問の性格診断でもOK',
      icon: '📝',
    },
    {
      step: '02',
      title: 'クチコミを貼り付ける',
      description: 'Google口コミ・食べログ・ホットペッパーなど、どのプラットフォームの口コミでもOK。',
      sub: '星評価と業種を選ぶだけ',
      icon: '⭐',
    },
    {
      step: '03',
      title: 'あなたらしい返信が2パターン届く',
      description: 'テンプレ感ゼロの、あなたの人柄が伝わる返信が自動生成されます。',
      sub: '手直しのコツも無料で見られます →',
      icon: '✉️',
    },
  ]

  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-12">
          たった3ステップで完成
        </h2>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-500 mb-1">STEP {step.step}</p>
                <h3 className="font-bold text-stone-800 mb-1">{step.title}</h3>
                <p className="text-sm text-stone-500 mb-1">{step.description}</p>
                <p className="text-xs text-amber-600">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
