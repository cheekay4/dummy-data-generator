'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DiagnosisFlow from '@/components/profile-creation/DiagnosisFlow'
import type { Metadata } from 'next'

export default function DiagnosisPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 block mb-6">
            ← ホームに戻る
          </Link>

          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm text-center">
            <p className="text-4xl mb-4">🧠</p>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">返信スタイル診断</h1>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              10問の質問に答えるだけ。<br />
              あなたの日常の行動パターンから、<br />
              <span className="font-medium text-stone-700">あなたらしい口コミ返信スタイル</span>を分析します。
            </p>

            <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-500">✓</span>
                所要時間：約2分
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-500">✓</span>
                登録不要・完全無料
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-500">✓</span>
                接客・お店に関する質問は一切なし
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-500">✓</span>
                結果はあなたの「返信DNA」として保存できます
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-md"
            >
              診断スタート →
            </button>

            <p className="text-xs text-stone-400 mt-3">
              診断後に無料アカウントを作ると、実際の口コミ返信に使えます
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setStarted(false)}
            className="text-sm text-stone-400 hover:text-stone-600"
          >
            ← 最初に戻る
          </button>
          <h1 className="text-2xl font-bold text-stone-800 mt-2">返信スタイル診断</h1>
          <p className="text-sm text-stone-500">日常のちょっとした場面を想像しながら答えてください</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <DiagnosisFlow
            isAnonymous={true}
            onSaved={() => router.push('/generator')}
            onBack={() => setStarted(false)}
          />
        </div>
      </div>
    </div>
  )
}
