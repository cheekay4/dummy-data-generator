'use client'

import { useState } from 'react'
import DiagnosisCard from './DiagnosisCard'
import ProfileResult from './ProfileResult'
import { DIAGNOSIS_QUESTIONS, MAX_POSSIBLE_SCORES } from './diagnosisQuestions'
import type { AxisKey } from '@/lib/types'

interface Props {
  businessType?: string
  onSaved: () => void
  onBack: () => void
}

export default function DiagnosisFlow({ businessType, onSaved, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [accumulated, setAccumulated] = useState<Record<AxisKey, number>>({
    agreeableness: 0,
    extraversion: 0,
    conscientiousness: 0,
    openness: 0,
  })
  const [done, setDone] = useState(false)
  const [finalScores, setFinalScores] = useState<Record<AxisKey, number> | null>(null)

  function handleAnswer(scores: Partial<Record<AxisKey, number>>) {
    const next = { ...accumulated }
    for (const [axis, value] of Object.entries(scores)) {
      next[axis as AxisKey] += value as number
    }
    setAccumulated(next)

    if (currentIndex + 1 >= DIAGNOSIS_QUESTIONS.length) {
      // 全問終了: 0-5に正規化
      const normalized: Record<AxisKey, number> = {} as Record<AxisKey, number>
      for (const axis of Object.keys(next) as AxisKey[]) {
        const raw = (next[axis] / MAX_POSSIBLE_SCORES[axis]) * 5
        normalized[axis] = Math.round(raw * 2) / 2 // 0.5刻み
      }
      setFinalScores(normalized)
      setDone(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (done && finalScores) {
    return (
      <ProfileResult
        scores={finalScores}
        analysisData={null}
        businessType={businessType}
        creationMethod="diagnosis"
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
        <h2 className="text-xl font-bold text-stone-800 mb-1">性格診断（10問）</h2>
        <p className="text-sm text-stone-500">日常のちょっとした場面を想像しながら答えてください</p>
      </div>

      <DiagnosisCard
        question={DIAGNOSIS_QUESTIONS[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={DIAGNOSIS_QUESTIONS.length}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
