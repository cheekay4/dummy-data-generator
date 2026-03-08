'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CreditCard, LogOut, User, Crown, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

const PLAN_LABELS = { free: '無料プラン', pro: 'Proプラン', team: 'Teamプラン' }

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [portalLoading, setPortalLoading] = useState(false)

  const handleManageBilling = async () => {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Stripeポータルへのアクセスに失敗しました。')
      setPortalLoading(false)
    }
  }

  const handleUpgrade = async (plan: 'pro' | 'team') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) return null

  const plan = profile?.plan ?? 'free'

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-14 z-10">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-semibold text-neutral-800 text-[15px]">アカウント設定</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* Profile */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <User size={16} className="text-neutral-400" />
            <h2 className="text-[13px] font-semibold text-neutral-700">プロフィール</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-neutral-400 mb-0.5">名前</p>
              <p className="text-[14px] text-neutral-800">{profile?.display_name ?? '未設定'}</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400 mb-0.5">メールアドレス</p>
              <p className="text-[14px] text-neutral-800">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Crown size={16} className="text-neutral-400" />
            <h2 className="text-[13px] font-semibold text-neutral-700">プラン</h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[15px] font-bold text-neutral-800">{PLAN_LABELS[plan]}</p>
              {plan === 'free' && (
                <p className="text-[12px] text-neutral-500 mt-0.5">マニュアル3件まで無料</p>
              )}
              {plan === 'pro' && (
                <p className="text-[12px] text-neutral-500 mt-0.5">マニュアル無制限 + PDF/Word出力</p>
              )}
            </div>
            {plan !== 'free' && (
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                有効
              </span>
            )}
          </div>

          {plan === 'free' ? (
            <div className="space-y-2">
              <button
                onClick={() => handleUpgrade('pro')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-[14px] transition-colors"
              >
                Proプランにアップグレード — ¥1,980/月
              </button>
              <button
                onClick={() => handleUpgrade('team')}
                className="w-full border border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-2.5 rounded-xl text-[13px] transition-colors"
              >
                Teamプラン — ¥4,980/月（5ユーザー）
              </button>
            </div>
          ) : (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="w-full flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-2.5 rounded-xl text-[13px] transition-colors disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CreditCard size={14} />
              )}
              支払い管理・プラン変更・解約
            </button>
          )}
        </section>

        {/* Sign out */}
        <section className="bg-white rounded-xl border border-neutral-200 p-5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 text-[13px] text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={14} />
            ログアウト
          </button>
        </section>
      </div>
    </div>
  )
}
