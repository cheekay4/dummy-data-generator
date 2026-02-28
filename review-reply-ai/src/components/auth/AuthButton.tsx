'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import AuthModal from './AuthModal'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [configured] = useState(() => isSupabaseConfigured())

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
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

  if (!configured) return null

  if (loading) {
    return <div className="w-20 h-8 bg-stone-200 animate-pulse rounded-lg" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="text-sm text-stone-600 hover:text-amber-600 font-medium transition-colors"
        >
          プロファイル
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          ログアウト
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        ログイン
      </button>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}
