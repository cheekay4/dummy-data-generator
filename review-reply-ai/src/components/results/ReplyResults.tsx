'use client'

import { useState, useEffect } from 'react'
import { useGeneratorStore } from '@/stores/generatorStore'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import SentimentBadge from './SentimentBadge'
import TipsBanner from './TipsBanner'
import ReplyCard from './ReplyCard'
import CustomerAnalysis from './CustomerAnalysis'
import EditAdviceBanner from './EditAdviceBanner'
import AuthModal from '@/components/auth/AuthModal'

export default function ReplyResults() {
  const { result, rating, setStep } = useGeneratorStore()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthCTA, setShowAuthCTA] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsLoggedIn(!!user)
        setShowAuthCTA(!user)
      })
    } else {
      setShowAuthCTA(true)
    }
  }, [])

  if (!result) return null

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

      {/* 客層分析 */}
      {result.customerAnalysis && (
        <CustomerAnalysis analysis={result.customerAnalysis} isLoggedIn={isLoggedIn} />
      )}

      {/* 手直しアドバイスバナー */}
      <EditAdviceBanner />

      {/* 未ログイン誘導（Post-AHAモーメント） */}
      {showAuthCTA && (
        <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🎭</span>
            <div>
              <p className="font-bold text-stone-800 mb-1">この返信を、もっとあなたらしくできます</p>
              <p className="text-sm text-stone-600">
                今生成したのは汎用AI返信です。<br />
                あなたの過去の文章をAIに学習させると、<span className="font-medium text-amber-700">テンプレ感ゼロ</span>のあなたらしい返信が作れます。
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 mb-4 border border-amber-100">
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span>✨</span>プロファイルを作ると変わること
            </div>
            <ul className="text-xs text-stone-600 space-y-1">
              <li>✅ あなた独自の口調・言葉遣いで返信</li>
              <li>✅ 1日5回まで無料で生成</li>
              <li>✅ お客様の特徴分析（客層・来店動機）</li>
            </ul>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm"
          >
            無料で返信プロファイルを作る →
          </button>
          <p className="text-xs text-stone-400 text-center mt-2">登録無料 · クレジットカード不要</p>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          nextPath="/profile/create"
        />
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => setStep('form')}
          className="flex-1 flex items-center justify-center gap-2 border border-stone-300 hover:border-amber-400 hover:text-amber-600 text-stone-600 py-3 rounded-xl font-medium transition-all"
        >
          🔄 もう一度生成
        </button>
        <button
          onClick={() => setStep('form')}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          ✏️ 新しい口コミを入力
        </button>
      </div>
    </div>
  )
}
