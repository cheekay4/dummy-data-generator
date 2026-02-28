'use client'

import { useState } from 'react'
import TextSampleInput from './TextSampleInput'
import ProfileResult from './ProfileResult'
import type { AnalyzeWritingResult, AxisKey } from '@/lib/types'

interface Props {
  businessType?: string
  onSaved: () => void
  onBack: () => void
}

export default function TextLearningFlow({ businessType, onSaved, onBack }: Props) {
  const [samples, setSamples] = useState(['', ''])
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalyzeWritingResult | null>(null)

  const validSamples = samples.filter((s) => s.trim().length >= 30)
  const canAnalyze = validSamples.length >= 2

  async function handleAnalyze() {
    setAnalyzing(true)
    setError('')
    try {
      const res = await fetch('/api/analyze-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error ?? '分析に失敗しました')
        return
      }
      setResult(data.data)
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setAnalyzing(false)
    }
  }

  if (result) {
    const scores: Record<AxisKey, number> = {
      agreeableness: result.scores.agreeableness,
      extraversion: result.scores.extraversion,
      conscientiousness: result.scores.conscientiousness,
      openness: result.scores.openness,
    }
    return (
      <ProfileResult
        scores={scores}
        analysisData={result}
        businessType={businessType}
        creationMethod="text_learning"
        onSaved={onSaved}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="text-sm text-stone-400 hover:text-stone-600 mb-3">
          ← 戻る
        </button>
        <h2 className="text-xl font-bold text-stone-800 mb-1">あなたの文章をAIに学習させる</h2>
        <p className="text-sm text-stone-500">過去に書いた文章を貼り付けると、書き方のクセをAIが分析します</p>
      </div>

      <TextSampleInput samples={samples} onChange={setSamples} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || analyzing}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-md"
      >
        {analyzing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            AIが分析中...（20秒ほど）
          </span>
        ) : (
          'AIに分析してもらう →'
        )}
      </button>
    </div>
  )
}
