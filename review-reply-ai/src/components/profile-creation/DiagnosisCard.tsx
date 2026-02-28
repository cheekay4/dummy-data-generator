'use client'

import { useEffect, useState } from 'react'
import type { Question, QuestionOption } from './diagnosisQuestions'

interface Props {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (scores: QuestionOption['scores']) => void
}

export default function DiagnosisCard({ question, questionNumber, totalQuestions, onAnswer }: Props) {
  const [shuffledOptions, setShuffledOptions] = useState<QuestionOption[]>([])
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    // 選択肢シャッフル（選択バイアス防止）
    const shuffled = [...question.options].sort(() => Math.random() - 0.5)
    setShuffledOptions(shuffled)
    setSelected(null)
  }, [question])

  function handleSelect(index: number) {
    if (selected !== null) return
    setSelected(index)
    // 0.5秒後に次の問へ
    setTimeout(() => {
      onAnswer(shuffledOptions[index].scores)
    }, 500)
  }

  return (
    <div className="space-y-5">
      {/* プログレスバー */}
      <div>
        <div className="flex justify-between text-xs text-stone-400 mb-1.5">
          <span>Q{questionNumber}/{totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2">
          <div
            className="bg-amber-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 質問文 */}
      <div className="bg-stone-50 rounded-2xl p-5">
        <p className="text-base font-medium text-stone-800">{question.text}</p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2.5">
        {shuffledOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full text-left border-2 rounded-xl p-4 text-sm transition-all ${
              selected === i
                ? 'border-amber-500 bg-amber-50 text-stone-800'
                : selected !== null
                ? 'border-stone-100 bg-stone-50 text-stone-400'
                : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-stone-700'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
