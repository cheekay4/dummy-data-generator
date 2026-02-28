export default function CustomerAnalysisDemo() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">
            クチコミから客層もわかる
          </h2>
          <p className="text-stone-500 text-sm">返信生成と同時に、AIがお客様の傾向を分析します（無料ログイン後）</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-lg mx-auto shadow-sm">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-4">📊 客層分析（サンプル）</p>
          <div className="space-y-4">
            {[
              { icon: '👤', label: '推定客層', value: '30代女性・友人とのランチ利用' },
              { icon: '🎯', label: '重視点', value: 'メニューの豊富さ、雰囲気' },
              { icon: '💡', label: '来店動機', value: 'SNSで見て気になった' },
              { icon: '⭐', label: 'リピート可能性', value: '★★★★☆（高い）', highlight: true },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-xs text-stone-400">{item.label}</p>
                  <p className={`text-sm font-medium ${item.highlight ? 'text-amber-500' : 'text-stone-800'}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-500 bg-amber-50 rounded-lg px-3 py-2">
                💬 SNS経由の客層には、メニューのこだわりに触れた返信が効果的です。
              </p>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-stone-400 mb-2">ログインすると、すべての口コミで客層分析が見られます</p>
            <a
              href="/#auth"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              無料ではじめる →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
