'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import AuthModal from '@/components/auth/AuthModal'

export default function Header() {
  const { user, profile, signOut, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setShowMenu(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare size={14} color="white" />
            </div>
            <span className="font-semibold text-neutral-800 text-[15px] tracking-tight">
              引き継ぎAI
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/#pricing"
              className="text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              料金
            </Link>
            <Link
              href="/#faq"
              className="text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              よくある質問
            </Link>
          </nav>

          {loading ? (
            <div className="w-24 h-8 bg-neutral-100 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-1.5 hover:border-neutral-300 transition-colors"
              >
                <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">
                    {(profile?.display_name ?? user.email ?? '?')[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-[12px] text-neutral-700 max-w-[100px] truncate hidden sm:block">
                  {profile?.display_name ?? user.email}
                </span>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 overflow-hidden">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <LayoutDashboard size={13} />
                      マイマニュアル
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Settings size={13} />
                      設定
                    </Link>
                    <div className="border-t border-neutral-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={13} />
                      ログアウト
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-neutral-900 hover:bg-neutral-700 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-all active:scale-[0.98]"
            >
              無料で始める
            </button>
          )}
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
