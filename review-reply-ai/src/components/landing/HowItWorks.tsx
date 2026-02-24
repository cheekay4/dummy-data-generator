const STEPS = [
  { num: '01', title: '口コミを貼り付け', desc: 'Google・食べログ等から口コミをコピーして貼り付け。星評価も選択。' },
  { num: '02', title: '業種とトーンを選択', desc: '飲食・美容・クリニックなど8業種から選び、返信のトーンを設定。' },
  { num: '03', title: 'AIが返信案を2パターン提案', desc: '感謝重視・再来店促進など2種類の返信文が数秒で生成されます。' },
]

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-10">
          3ステップで完了
        </h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm h-full">
                <div className="font-mono text-3xl font-bold text-amber-300 mb-3">{step.num}</div>
                <h3 className="font-bold text-stone-800 mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-3 z-10 text-stone-300 text-xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
