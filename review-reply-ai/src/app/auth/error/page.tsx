'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-xl font-bold text-stone-800 mb-2">ログインに失敗しました</h1>
        <p className="text-sm text-stone-500 mb-2">
          認証処理中にエラーが発生しました。もう一度お試しください。
        </p>
        {message && (
          <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2 mb-4 font-mono break-all">
            {message}
          </p>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <Link
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            トップページに戻る
          </Link>
          <p className="text-xs text-stone-400">
            リンクの有効期限が切れている可能性があります。再度ログインをお試しください。
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
