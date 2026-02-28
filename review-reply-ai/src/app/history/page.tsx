'use client'

import { useEffect, useState, useCallback } from 'react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import type { ReplyHistory } from '@/lib/types'
import Link from 'next/link'

export default function HistoryPage() {
  const [history, setHistory] = useState<ReplyHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/'
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    const pro = profile?.plan === 'pro'
    setIsPro(pro)

    if (pro) {
      const { data } = await supabase
        .from('reply_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)
      setHistory(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center">
          <p className="text-4xl mb-3">📋</p>
          <h1 className="text-xl font-bold text-stone-800 mb-2">履歴保存はPro限定</h1>
          <p className="text-sm text-stone-500 mb-5">Proプランにアップグレードすると、返信履歴を90日間保存できます。</p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            ✨ Proにアップグレード →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/generator" className="text-sm text-stone-400 hover:text-stone-600">
            ← ジェネレーターに戻る
          </Link>
          <h1 className="text-2xl font-bold text-stone-800 mt-2">返信履歴</h1>
          <p className="text-sm text-stone-500 mt-1">直近90日間の生成履歴</p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
            <p className="text-stone-400 text-sm">まだ返信履歴がありません。</p>
            <Link href="/generator" className="mt-3 inline-block text-amber-600 text-sm hover:underline">
              返信を生成してみる →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="bg-white border border-stone-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">{'★'.repeat(h.rating)}{'☆'.repeat(5 - h.rating)}</span>
                    {h.platform && <span className="text-xs text-stone-400">{h.platform}</span>}
                  </div>
                  <span className="text-xs text-stone-400">
                    {new Date(h.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <p className="text-sm text-stone-600 line-clamp-2">{h.review_text}</p>
                {h.selected_reply && (
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <p className="text-xs text-stone-400 mb-1">保存した返信</p>
                    <p className="text-sm text-stone-700">{h.selected_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
