'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import SentimentBadge from './SentimentBadge'
import TipsBanner from './TipsBanner'
import ReplyCard from './ReplyCard'

export default function ReplyResults() {
  const { result, rating, setStep, resetForm } = useGeneratorStore()

  if (!result) return null

  function handleRegenerate() {
    setStep('form')
    // Small delay then re-submit via SubmitButton logic
    // We just go back to form; user can click generate again
  }

  return (
    <div className="space-y-6">
      {/* Analysis header */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">口コミ分析</p>
        <div className="flex flex-wrap items-center gap-3">
          <SentimentBadge sentiment={result.sentiment} rating={rating} />
        </div>
      </div>

      {/* Tips */}
      <TipsBanner tips={result.tips} />

      {/* Reply patterns */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.patterns.map((pattern, i) => (
          <ReplyCard key={i} pattern={pattern} index={i} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => setStep('form')}
          className="flex-1 flex items-center justify-center gap-2 border border-stone-300 hover:border-amber-400 hover:text-amber-600 text-stone-600 py-3 rounded-xl font-medium transition-all"
        >
          🔄 もう一度生成
        </button>
        <button
          onClick={resetForm}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          ✏️ 新しい口コミを入力
        </button>
      </div>
    </div>
  )
}
