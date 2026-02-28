'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AudioWaveform } from 'lucide-react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/auth/AuthModal'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) { setLoading(false); return }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [configured])

  async function handleSignOut() {
    if (!configured) return
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AudioWaveform className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold tracking-tight text-stone-900 text-sm">
              MyReply<span className="text-amber-500">Tone</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal hidden sm:block">AI口コミ返信ジェネレーター</span>
          </div>
        </Link>

        {/* ナビ */}
        <nav className="flex items-center gap-1 text-sm">
          {loading ? (
            <div className="w-48 h-8 bg-stone-100 animate-pulse rounded-lg" />
          ) : user ? (
            /* ログイン済み */
            <>
              <Link
                href="/pricing"
                className="hidden sm:block text-stone-500 hover:text-stone-800 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                料金
              </Link>
              <Link
                href="/generator"
                className="hidden sm:block bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                返信を作る
              </Link>
              <Link
                href="/profile"
                className="text-stone-700 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors font-medium"
              >
                マイページ
              </Link>
              <button
                onClick={handleSignOut}
                className="text-stone-400 hover:text-stone-600 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            /* 未ログイン */
            <>
              <Link
                href="/pricing"
                className="hidden sm:block text-stone-500 hover:text-stone-800 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                料金
              </Link>
              <a
                href="/#faq"
                className="hidden sm:block text-stone-500 hover:text-stone-800 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/generator"
                className="hidden sm:block bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                今すぐ試す
              </Link>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-stone-600 hover:text-stone-800 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors font-medium"
              >
                ログイン
              </button>
            </>
          )}
        </nav>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          nextPath="/profile/create"
        />
      )}
    </header>
  )
}
