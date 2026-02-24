const FEATURES = [
  {
    icon: '💬',
    title: '口コミを貼るだけ',
    desc: '星評価と本文をコピペするだけで3秒で返信案が2パターン届きます。',
  },
  {
    icon: '🏪',
    title: '業種別に最適化',
    desc: '飲食・美容・クリニックなど8業種のトーンと表現を自動調整。',
  },
  {
    icon: '😤',
    title: 'ネガティブ対応も安心',
    desc: '感情的にならない、プロフェッショナルな謝罪・改善・再来店誘導の返信を提案。',
  },
]

export default function FeatureCards() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-10">
          選ばれる3つの理由
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-stone-800 mb-2">{f.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
