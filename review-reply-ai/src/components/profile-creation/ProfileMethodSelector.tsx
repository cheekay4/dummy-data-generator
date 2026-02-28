'use client'

interface Props {
  onSelect: (method: 'text_learning' | 'diagnosis') => void
}

export default function ProfileMethodSelector({ onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-2xl mb-2">📊</p>
        <h2 className="text-xl font-bold text-stone-800 mb-1">プロファイルの作り方を選んでください</h2>
        <p className="text-sm text-stone-500">あなたの返信スタイルをAIに学習させましょう</p>
      </div>

      {/* テキスト学習 */}
      <button
        onClick={() => onSelect('text_learning')}
        className="w-full text-left border-2 border-amber-300 hover:border-amber-500 bg-amber-50 hover:bg-amber-100 rounded-2xl p-5 transition-all group"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-stone-800">あなたの文章から学習する（1分）</p>
              <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-medium">
                おすすめ
              </span>
            </div>
            <p className="text-sm text-stone-600">
              過去の口コミ返信やメールを2〜3件貼り付けるだけ。
              AIがあなたの書き方を分析してプロファイルを作ります。
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">→ より精度の高いプロファイルができます</p>
          </div>
        </div>
      </button>

      {/* 性格診断 */}
      <button
        onClick={() => onSelect('diagnosis')}
        className="w-full text-left border-2 border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-2xl p-5 transition-all"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <p className="font-bold text-stone-800 mb-1">性格診断で作る（2分）</p>
            <p className="text-sm text-stone-600">
              10問の質問に答えるだけ。
              日常の行動からあなたの返信スタイルを推定します。
            </p>
            <p className="text-xs text-stone-400 mt-2">→ 口コミ返信の経験がない方におすすめ</p>
          </div>
        </div>
      </button>
    </div>
  )
}
