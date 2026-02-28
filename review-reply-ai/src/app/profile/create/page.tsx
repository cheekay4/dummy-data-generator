'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import ProfileMethodSelector from '@/components/profile-creation/ProfileMethodSelector'
import TextLearningFlow from '@/components/profile-creation/TextLearningFlow'
import DiagnosisFlow from '@/components/profile-creation/DiagnosisFlow'
import ProfileResult from '@/components/profile-creation/ProfileResult'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AxisKey } from '@/lib/types'

const PENDING_DIAGNOSIS_KEY = 'rr_pending_diagnosis'

function ProfileCreateInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [method, setMethod] = useState<'text_learning' | 'diagnosis' | null>(null)
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)
  const [pendingScores, setPendingScores] = useState<Record<AxisKey, number> | null>(null)

  useEffect(() => {
    const isImport = searchParams.get('import') === 'diagnosis'

    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setNotLoggedIn(true)
        setLoading(false)
        return
      }

      // ?import=diagnosis: sessionStorage から診断結果を読み込む
      if (isImport) {
        const raw = sessionStorage.getItem(PENDING_DIAGNOSIS_KEY)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            if (data.scores) {
              setPendingScores(data.scores)
              setLoading(false)
              return
            }
          } catch {
            // parse失敗は無視して通常フローへ
          }
        }
      }

      setLoading(false)
    })
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notLoggedIn || !isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-sm text-center">
          <p className="text-4xl mb-3">🔐</p>
          <h1 className="text-xl font-bold text-stone-800 mb-2">ログインが必要です</h1>
          <p className="text-sm text-stone-500 mb-5">
            プロファイルを作成するには、まずログインしてください。
          </p>
          <Link
            href="/"
            className="block bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            トップページでログイン →
          </Link>
          <Link
            href="/diagnosis"
            className="block mt-3 border border-amber-300 text-amber-700 hover:bg-amber-50 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            ログイン不要で性格診断をやってみる
          </Link>
        </div>
      </div>
    )
  }

  function handleSaved() {
    sessionStorage.removeItem(PENDING_DIAGNOSIS_KEY)
    router.push('/generator')
  }

  // sessionStorage からインポートした診断結果を直接 ProfileResult に渡す
  if (pendingScores) {
    return (
      <div className="min-h-screen bg-stone-50 py-10 px-4">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-800">診断結果を保存</h1>
            <p className="text-sm text-stone-500">診断で作成した返信DNAを保存します</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <ProfileResult
              scores={pendingScores}
              analysisData={null}
              creationMethod="diagnosis"
              onSaved={handleSaved}
              isAnonymous={false}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/profile" className="text-sm text-stone-400 hover:text-stone-600">
            ← プロファイル一覧に戻る
          </Link>
          <h1 className="text-2xl font-bold text-stone-800 mt-2">返信プロファイルを作成</h1>
          <p className="text-sm text-stone-500">あなたらしい返信DNAをAIに学習させましょう</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {!method ? (
            <ProfileMethodSelector onSelect={setMethod} />
          ) : method === 'text_learning' ? (
            <TextLearningFlow onSaved={handleSaved} onBack={() => setMethod(null)} />
          ) : (
            <DiagnosisFlow onSaved={handleSaved} onBack={() => setMethod(null)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfileCreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileCreateInner />
    </Suspense>
  )
}
