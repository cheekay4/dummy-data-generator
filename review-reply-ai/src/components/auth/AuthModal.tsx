'use client'

import { useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

interface AuthModalProps {
  onClose: () => void
  nextPath?: string
}

export default function AuthModal({ onClose, nextPath = '/profile' }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function callbackUrl() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured()) { setError('認証サービスが設定されていません'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl() },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured()) { setError('認証サービスが設定されていません'); return }
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl() },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-stone-800">ログイン / 新規登録</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-bold text-stone-800 mb-2">ログインリンクを送信しました</p>
            <p className="text-sm text-stone-500 leading-relaxed">
              <span className="font-medium text-stone-700">{email}</span> に届いたメールを開いて、ログインボタンをタップしてください。
            </p>
            <p className="text-xs text-stone-400 mt-3">届かない場合は迷惑メールフォルダもご確認ください</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl py-3 text-sm font-medium text-stone-700 mb-4 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Googleアカウントで続ける
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400">またはメールで</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {loading ? '送信中...' : 'メールでログイン / 新規登録'}
              </button>
            </form>

            <p className="text-xs text-stone-400 text-center mt-4">
              ログインすることで
              <a href="/terms" className="underline hover:text-stone-600">利用規約</a>と
              <a href="/privacy" className="underline hover:text-stone-600">プライバシーポリシー</a>
              に同意したことになります。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
