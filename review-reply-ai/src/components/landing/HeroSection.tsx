export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-stone-50 pt-16 pb-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>✨</span>
          <span>1日3回まで完全無料</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight mb-5">
          口コミ返信、もう悩まない。<br />
          <span className="text-amber-500">AIが3秒で作成。</span>
        </h1>
        <p className="text-stone-600 text-lg md:text-xl mb-8 leading-relaxed">
          Google口コミ・食べログ・ホットペッパー。<br className="hidden sm:block" />
          ネガティブ対応も、丁寧な感謝も、お店の個性に合わせた返信をAIが提案。
        </p>
        <a
          href="/generator"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg"
        >
          無料で試す（1日3回）
        </a>
        <p className="text-stone-400 text-sm mt-4">登録不要 · クレジットカード不要</p>

        {/* Star rating preview */}
        <div className="mt-12 flex justify-center gap-4 flex-wrap">
          {[
            { stars: 1, label: 'ネガティブ対応' },
            { stars: 4, label: 'ポジティブ返信' },
            { stars: 3, label: 'ミックス対応' },
          ].map(({ stars, label }) => (
            <div key={stars} className="bg-white rounded-2xl shadow-sm border border-stone-200 px-5 py-3 text-sm">
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < stars ? 'text-amber-400' : 'text-stone-200'}>★</span>
                ))}
              </div>
              <p className="text-stone-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
