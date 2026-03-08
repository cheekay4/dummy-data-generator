'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Check, Crown, Loader2 } from 'lucide-react'
import { TEMPLATES_LIST } from '@/lib/templates'
import { useInterviewStore } from '@/stores/interviewStore'
import { useAuth } from '@/components/auth/AuthProvider'
import AuthModal from '@/components/auth/AuthModal'
import type { InterviewTemplate } from '@/lib/types'

const FREE_TEMPLATE_KEYS = ['general']

export default function NewInterviewPage() {
  const router = useRouter()
  const { setTemplate, setManualTitle, setInterviewId, reset } = useInterviewStore()
  const { user, profile } = useAuth()

  const [selected, setSelected] = useState<InterviewTemplate | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  const plan = profile?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'team'

  const handleStart = async () => {
    if (!selected) return

    if (!user) {
      setShowAuth(true)
      return
    }

    setLoading(true)
    setError(null)

    const defaultTitle = title.trim() || `${selected.businessType}の引き継ぎ`

    const res = await fetch('/api/manuals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: defaultTitle,
        businessType: selected.templateKey,
        templateKey: selected.templateKey,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.error === 'PLAN_LIMIT') {
        setError(data.message)
      } else {
        setError('マニュアルの作成に失敗しました。もう一度お試しください。')
      }
      setLoading(false)
      return
    }

    reset()
    setTemplate(selected)
    setManualTitle(defaultTitle)
    setInterviewId(data.id)

    router.push(`/interview/${data.id}`)
  }

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3 sticky top-14 z-10">
            <Link href="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="font-semibold text-neutral-800 text-[15px]">業種を選択</h1>
          </div>

          <div className="px-4 py-6">
            <p className="text-[13px] text-neutral-500 leading-[1.8] mb-6">
              業種に合ったひな形を選ぶと、AIが適切な質問で業務ノウハウを引き出します。
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <p className="text-[13px] text-red-700">{error}</p>
                {error.includes('Proプラン') && (
                  <Link
                    href="/settings"
                    className="inline-block mt-2 text-[12px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Proにアップグレード
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-2.5">
              {TEMPLATES_LIST.map((t) => {
                const isFreeOk = FREE_TEMPLATE_KEYS.includes(t.templateKey)
                const locked = !isPro && !isFreeOk

                return (
                  <button
                    key={t.templateKey}
                    onClick={() => !locked && setSelected(t)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      locked
                        ? 'border-neutral-100 bg-neutral-50 opacity-60 cursor-not-allowed'
                        : selected?.templateKey === t.templateKey
                        ? 'border-slate-500 bg-slate-50/50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${
                        selected?.templateKey === t.templateKey
                          ? 'bg-slate-600 text-white'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-neutral-800">{t.businessType}</p>
                        {locked && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            <Crown size={8} />
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-neutral-500 mt-0.5 leading-[1.5]">{t.description}</p>
                    </div>
                    {selected?.templateKey === t.templateKey && !locked && (
                      <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={10} color="white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {!isPro && (
              <p className="text-[11px] text-neutral-400 mt-3 text-center">
                飲食店・美容院・士業テンプレートは
                <Link href="/pricing" className="text-indigo-500 hover:underline ml-0.5">
                  Proプラン
                </Link>
                で利用可能
              </p>
            )}

            {selected && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-[13px] font-medium text-neutral-600 block mb-1.5">
                    マニュアルのタイトル
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`例）${selected.businessType}の引き継ぎ`}
                    className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 text-[14px] text-neutral-800 placeholder:text-neutral-300 focus:border-slate-500 focus:ring-0 outline-none transition-colors bg-white"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1 ml-1">あとから変更できます</p>
                </div>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold py-4 rounded-xl text-[15px] active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {user ? 'インタビューを始める' : 'ログインして始める'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
