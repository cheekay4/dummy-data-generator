'use client'

import { useState, useEffect } from 'react'
import { useGeneratorStore } from '@/stores/generatorStore'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import ReviewInput from './ReviewInput'
import StarRating from './StarRating'
import PlatformSelect from './PlatformSelect'
import BusinessTypeSelect from './BusinessTypeSelect'
import ToneSelector from './ToneSelector'
import ShopProfile from './ShopProfile'
import SubmitButton from './SubmitButton'
import ReplyResults from '@/components/results/ReplyResults'
import ProfileSelector from '@/components/profile/ProfileSelector'

const ONBOARDING_DISMISSED_KEY = 'rr_onboarding_dismissed'

export default function GeneratorWorkspace() {
  const { step, error } = useGeneratorStore()
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [selectedModifierId, setSelectedModifierId] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setIsLoggedIn(true)
      const [profileData, replyProfileData] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', user.id).single(),
        supabase.from('reply_profiles').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setIsPro(profileData.data?.plan === 'pro')
      const hasNoProfiles = (replyProfileData.count ?? 0) === 0
      const dismissed = typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_DISMISSED_KEY)
      if (hasNoProfiles && !dismissed) setShowOnboarding(true)
    })
  }, [])

  function dismissOnboarding() {
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, '1')
    setShowOnboarding(false)
  }

  const store = useGeneratorStore()

  return (
    <section id="generator" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">口コミ返信を生成する</h2>
          <p className="text-stone-500 text-sm">
            {isLoggedIn ? 'プロファイルを設定すると、あなたらしい返信が生成されます' : '口コミを貼り付けて、業種とトーンを選ぶだけ'}
          </p>
        </div>

        {step === 'result' ? (
          <ReplyResults />
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* 新規ユーザーオンボーディング */}
            {isLoggedIn && showOnboarding && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">🎭</span>
                    <div>
                      <p className="font-bold text-stone-800 mb-1">まず「返信DNA」を登録しましょう</p>
                      <p className="text-sm text-stone-600 mb-3">
                        あなたの過去の文章をAIに学習させると、テンプレ感ゼロのあなたらしい返信が生成されます。
                        2分もあれば完成します。
                      </p>
                      <a
                        href="/profile/create"
                        className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
                      >
                        返信プロファイルを作る →
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={dismissOnboarding}
                    className="text-stone-300 hover:text-stone-500 text-lg flex-shrink-0 mt-0.5"
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* プロファイル選択（ログイン済みのみ表示） */}
            {isLoggedIn && (
              <ProfileSelector
                selectedProfileId={selectedProfileId}
                selectedModifierId={selectedModifierId}
                isPro={isPro}
                onProfileChange={(id) => {
                  setSelectedProfileId(id)
                  store.setProfileId(id)
                }}
                onModifierChange={(id) => {
                  setSelectedModifierId(id)
                  store.setModifierId(id)
                }}
              />
            )}

            <ReviewInput />
            <StarRating />

            <div className="grid sm:grid-cols-2 gap-4">
              <PlatformSelect />
              <div /> {/* spacer */}
            </div>

            {/* プロファイル未選択時のみ業種・トーン表示 */}
            {!selectedProfileId && (
              <>
                <BusinessTypeSelect />
                <ToneSelector />
                <ShopProfile />
              </>
            )}

            <div className="border-t border-stone-100 pt-4">
              <SubmitButton profileId={selectedProfileId} modifierId={selectedModifierId} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
