'use client'

import { Brain, PenLine } from 'lucide-react'

interface Props {
  onSelect: (method: 'text_learning' | 'diagnosis') => void
}

export default function ProfileMethodSelector({ onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Brain className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-stone-800 mb-1">返信スタイルをAIに覚えさせましょう</h2>
        <p className="text-sm text-stone-500">10問の診断でかんたんに作れます</p>
      </div>

      {/* 性格診断（メイン・おすすめ） */}
      <button
        onClick={() => onSelect('diagnosis')}
        className="w-full text-left border-2 border-amber-300 hover:border-amber-500 bg-amber-50 hover:bg-amber-100 rounded-2xl p-5 transition-all"
      >
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-stone-800">性格診断で作る（2分）</p>
              <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-medium">
                おすすめ
              </span>
            </div>
            <p className="text-sm text-stone-600">
              10問の質問に答えるだけ。
              日常の行動からあなたの返信スタイルをAIが分析します。
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">→ 過去の返信がなくてもすぐ作れます</p>
          </div>
        </div>
      </button>

      {/* テキスト学習（補助） */}
      <button
        onClick={() => onSelect('text_learning')}
        className="w-full text-left border-2 border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-2xl p-5 transition-all"
      >
        <div className="flex items-start gap-3">
          <PenLine className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-stone-800 mb-1">あなたの文章から学習する（1分）</p>
            <p className="text-sm text-stone-600">
              過去の口コミ返信やメールを2〜3件貼り付けるだけ。
              AIがあなたの書き方を分析してプロファイルを作ります。
            </p>
            <p className="text-xs text-stone-400 mt-2">→ 過去の返信文がある方はこちらがより精度が高くなります</p>
          </div>
        </div>
      </button>
    </div>
  )
}
