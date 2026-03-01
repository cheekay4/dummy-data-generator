export default function TextLearningDemo() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">
          あなたの文章から、返信DNAを作ります
        </h2>
        <p className="text-stone-500 text-center mb-8 text-sm">
          過去に書いた口コミ返信・メール・LINEメッセージを貼り付けるだけ
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <div className="mb-4">
            <p className="text-xs font-medium text-stone-500 mb-2">📝 過去に書いた文章を貼り付けるだけ</p>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-sm text-stone-600">
              ご来店ありがとうございます。パスタを気に入っていただけて嬉しいです！
              当店自慢の自家製麺、ぜひ次回は別のソースもお試しくださいね。
            </div>
          </div>

          <div className="text-center text-stone-400 text-sm my-3">↓ AIが分析すると…</div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-medium text-amber-700 mb-2">🔍 あなたの返信の特徴:</p>
            <ul className="space-y-1 text-sm text-stone-600">
              <li>・「嬉しいです」等の感情表現が豊か</li>
              <li>・具体的なメニュー名に言及する傾向</li>
              <li>・次回提案で再来店を自然に促す</li>
            </ul>
          </div>

          <div className="mt-5 text-center">
            <a
              href="/profile/create"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
            >
              あなたの文章でやってみる →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
