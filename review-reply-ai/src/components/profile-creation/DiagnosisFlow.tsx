'use client'

import { useState } from 'react'
import DiagnosisCard from './DiagnosisCard'
import ProfileResult from './ProfileResult'
import { DIAGNOSIS_QUESTIONS, MAX_POSSIBLE_SCORES } from './diagnosisQuestions'
import type { AxisKey } from '@/lib/types'

type Scores = Record<AxisKey, number>

interface Props {
  businessType?: string
  onSaved: () => void
  onBack: () => void
  isAnonymous?: boolean
}

const ZERO_SCORES: Scores = {
  agreeableness: 0,
  extraversion: 0,
  conscientiousness: 0,
  openness: 0,
}

export default function DiagnosisFlow({ businessType, onSaved, onBack, isAnonymous = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answersHistory, setAnswersHistory] = useState<Partial<Scores>[]>([])
  const [done, setDone] = useState(false)
  const [finalScores, setFinalScores] = useState<Scores | null>(null)

  function handleAnswer(scores: Partial<Scores>) {
    const newHistory = [...answersHistory, scores]
    setAnswersHistory(newHistory)

    if (currentIndex + 1 >= DIAGNOSIS_QUESTIONS.length) {
      // 全問終了: 累積→正規化
      const accumulated = { ...ZERO_SCORES }
      for (const answer of newHistory) {
        for (const [axis, value] of Object.entries(answer)) {
          accumulated[axis as AxisKey] += value as number
        }
      }
      const normalized: Scores = {} as Scores
      for (const axis of Object.keys(accumulated) as AxisKey[]) {
        const raw = (accumulated[axis] / MAX_POSSIBLE_SCORES[axis]) * 5
        normalized[axis] = Math.round(raw * 2) / 2 // 0.5刻み
      }
      setFinalScores(normalized)
      setDone(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function handleBack() {
    if (currentIndex <= 0) return
    const newHistory = answersHistory.slice(0, -1)
    setAnswersHistory(newHistory)
    setCurrentIndex(currentIndex - 1)
  }

  if (done && finalScores) {
    return (
      <ProfileResult
        scores={finalScores}
        analysisData={null}
        businessType={businessType}
        creationMethod="diagnosis"
        onSaved={onSaved}
        isAnonymous={isAnonymous}
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
        onBack={currentIndex > 0 ? handleBack : undefined}
      />
    </div>
  )
}
