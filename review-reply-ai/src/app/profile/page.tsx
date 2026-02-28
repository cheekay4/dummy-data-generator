'use client'

import { useEffect, useState, useCallback } from 'react'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileEditor from '@/components/profile/ProfileEditor'
import type { UserProfile, ReplyProfile } from '@/lib/types'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [profiles, setProfiles] = useState<ReplyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editing, setEditing] = useState<Partial<ReplyProfile> | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      window.location.href = '/'
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
    setUser(profile)

    const { data: replyProfiles } = await supabase
      .from('reply_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: true })
    setProfiles(replyProfiles ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const isPro = user?.plan === 'pro'
  const maxProfiles = isPro ? 5 : 1
  const canCreate = profiles.length < maxProfiles

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    await supabase.from('reply_profiles').delete().eq('id', id)
    setDeleteConfirm(null)
    load()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center">
          <p className="text-4xl mb-3">⚙️</p>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Supabaseが未設定です</h1>
          <p className="text-sm text-stone-500 mb-5">.env.local に Supabase の環境変数を設定してください。</p>
          <Link href="/" className="text-amber-600 hover:underline text-sm">← トップページに戻る</Link>
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
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">返信プロファイル</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-stone-500 text-sm">あなたの返信スタイルをAIに教えましょう</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPro ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                  {isPro ? '✨ Pro' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {view === 'list' && (
          <>
            {profiles.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="font-medium text-stone-800 mb-1">プロファイルがまだありません</p>
                <p className="text-sm text-stone-500 mb-5">
                  あなたの文章から「返信DNA」を作りましょう
                </p>
                <Link
                  href="/profile/create"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
                >
                  返信DNAを作成する →
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  {profiles.map((p) => (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      onEdit={() => { setEditing(p); setView('edit') }}
                      onDelete={() => setDeleteConfirm(p.id)}
                    />
                  ))}
                </div>

                {canCreate ? (
                  <Link
                    href="/profile/create"
                    className="flex items-center justify-center w-full border-2 border-dashed border-stone-200 hover:border-amber-300 text-stone-400 hover:text-amber-500 py-4 rounded-2xl text-sm transition-colors"
                  >
                    ＋ 新しいプロファイルを作成
                    {!isPro && <span className="ml-1 text-xs">（無料: 1件まで）</span>}
                  </Link>
                ) : (
                  <div className="border border-amber-200 bg-amber-50 rounded-2xl p-4 text-center">
                    <p className="text-sm text-stone-700 mb-2">
                      {isPro ? 'プロファイルは5件まで作成できます。' : 'Freeプランはプロファイル1件まで。'}
                    </p>
                    {!isPro && (
                      <a href="/pricing" className="text-sm text-amber-600 font-medium hover:underline">
                        Proにアップグレードで5件まで →
                      </a>
                    )}
                    <p className="text-xs text-stone-400 mt-1">
                      既存のプロファイルを削除して作り直すことができます
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {view === 'edit' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="font-bold text-stone-800 mb-5">プロファイルを編集</h2>
            <ProfileEditor
              profile={editing}
              onSaved={() => { setView('list'); load() }}
              onCancel={() => setView('list')}
            />
          </div>
        )}

        {/* Delete confirm */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="font-bold text-stone-800 mb-2">プロファイルを削除しますか？</h3>
              <p className="text-sm text-stone-500 mb-5">削除したプロファイルは元に戻せません。</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-stone-300 text-stone-600 py-2.5 rounded-lg text-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
