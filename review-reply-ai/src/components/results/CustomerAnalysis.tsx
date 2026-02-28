'use client'

import type { CustomerAnalysis as CustomerAnalysisType } from '@/lib/types'

interface Props {
  analysis: CustomerAnalysisType
  isLoggedIn: boolean
}

export default function CustomerAnalysis({ analysis, isLoggedIn }: Props) {
  if (!isLoggedIn) {
    return (
      <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/70 flex flex-col items-center justify-center z-10 rounded-2xl">
          <p className="text-stone-700 font-medium mb-3">📊 客層分析はログイン後に確認できます</p>
          <a
            href="/#auth"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            無料でログイン →
          </a>
        </div>
        {/* ぼかし用ダミー */}
        <div className="space-y-2 opacity-30 pointer-events-none select-none">
          <p className="text-sm font-medium text-stone-700">📊 この口コミの客層分析</p>
          <p className="text-sm">👤 推定客層: ██████████████</p>
          <p className="text-sm">🎯 重視点: ████████、██████</p>
          <p className="text-sm">💡 来店動機: ████████████████</p>
          <p className="text-sm">⭐ リピート可能性: ★★★★☆</p>
        </div>
      </div>
    )
  }

  const stars = '★'.repeat(analysis.repeatLikelihood) + '☆'.repeat(5 - analysis.repeatLikelihood)

  return (
    <div className="border border-stone-200 rounded-2xl p-5 bg-white">
      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">📊 客層分析</p>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <span className="text-base">👤</span>
          <div>
            <p className="text-xs text-stone-400">推定客層</p>
            <p className="text-sm font-medium text-stone-800">{analysis.estimatedDemographic}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-base">🎯</span>
          <div>
            <p className="text-xs text-stone-400">重視点</p>
            <p className="text-sm text-stone-700">{analysis.priorities.join('、')}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-base">💡</span>
          <div>
            <p className="text-xs text-stone-400">来店動機</p>
            <p className="text-sm text-stone-700">{analysis.visitMotivation}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-base">⭐</span>
          <div>
            <p className="text-xs text-stone-400">リピート可能性</p>
            <p className="text-sm text-amber-500 font-medium">{stars}</p>
          </div>
        </div>
        {analysis.insight && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-500 bg-amber-50 rounded-lg px-3 py-2">
              💬 {analysis.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
