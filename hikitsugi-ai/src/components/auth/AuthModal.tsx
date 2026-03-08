'use client'

import { useState } from 'react'
import { X, Mail, Chrome, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      setError('Googleログインに失敗しました。')
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      setError('メール送信に失敗しました。もう一度お試しください。')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X size={18} />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
            <h2 className="text-[16px] font-bold text-neutral-800 mb-2">
              メールを送信しました
            </h2>
            <p className="text-[13px] text-neutral-500 leading-[1.7]">
              <strong>{email}</strong> にログインリンクを送りました。
              メールを確認してリンクをクリックしてください。
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-[17px] font-bold text-neutral-800 mb-1">
                アカウントを作成・ログイン
              </h2>
              <p className="text-[12px] text-neutral-500">
                3件まで無料。クレジットカード不要。
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 border-2 border-neutral-200 rounded-xl py-3 text-[14px] font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all mb-4 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Chrome size={16} />
              )}
              Googleで続ける
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[11px] text-neutral-400">またはメールで</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 text-[14px] text-neutral-800 placeholder:text-neutral-300 focus:border-slate-500 focus:ring-0 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold py-3 rounded-xl text-[14px] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Mail size={14} />
                )}
                ログインリンクを送る
              </button>
            </form>

            <p className="text-[10px] text-neutral-400 mt-4 text-center leading-[1.6]">
              続けることで
              <a href="/terms" className="underline hover:text-neutral-600">利用規約</a>
              と
              <a href="/privacy" className="underline hover:text-neutral-600">プライバシーポリシー</a>
              に同意します。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
