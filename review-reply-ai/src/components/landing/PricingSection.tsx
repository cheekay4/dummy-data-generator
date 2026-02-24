export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">
          シンプルな料金プラン
        </h2>
        <p className="text-stone-500 text-center mb-10">いつでも解約可能</p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <p className="text-stone-500 text-sm font-medium mb-2">無料プラン</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-stone-800">¥0</span>
              <span className="text-stone-400">/月</span>
            </div>
            <ul className="space-y-3 text-sm text-stone-600 mb-8">
              {['1日3回まで利用可能', '2パターンの返信生成', '全プラットフォーム対応', '全業種対応'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#generator"
              className="block text-center border border-amber-500 text-amber-600 hover:bg-amber-50 font-medium py-3 rounded-xl transition-colors"
            >
              無料で試す
            </a>
          </div>
          {/* Pro */}
          <div className="bg-amber-500 rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
              おすすめ
            </div>
            <p className="text-amber-100 text-sm font-medium mb-2">Proプラン</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">¥390</span>
              <span className="text-amber-200">/月</span>
            </div>
            <ul className="space-y-3 text-sm text-amber-50 mb-8">
              {[
                '無制限で利用可能',
                '2パターンの返信生成',
                '全プラットフォーム対応',
                '全業種対応',
                '返信履歴の保存',
                'お店プロフィール保存（3件）',
                '広告非表示',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-white">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="block w-full text-center bg-white text-amber-600 font-bold py-3 rounded-xl opacity-70 cursor-not-allowed"
            >
              近日公開予定
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
