import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Plus, Clock, CheckCircle2, Archive, FileText } from 'lucide-react'
import DashboardClient from './DashboardClient'

interface ManualRow {
  id: string
  title: string
  business_type: string
  template_key: string | null
  status: 'interviewing' | 'generating' | 'completed' | 'archived'
  section_count: number | null
  word_count: number | null
  created_at: string
  updated_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=1')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, plan')
    .eq('id', user.id)
    .single()

  const { data: manuals } = await supabase
    .from('manuals')
    .select('id, title, business_type, template_key, status, section_count, word_count, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const plan = profile?.plan ?? 'free'
  const manualList = (manuals ?? []) as ManualRow[]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-neutral-800 text-[16px]">マイマニュアル</h1>
            <p className="text-[11px] text-neutral-400">
              {profile?.display_name ?? user.email} ·{' '}
              <span className={plan === 'free' ? 'text-neutral-500' : 'text-indigo-600 font-medium'}>
                {plan === 'free' ? '無料プラン' : plan === 'pro' ? 'Proプラン' : 'Teamプラン'}
              </span>
            </p>
          </div>
          <Link
            href="/interview/new"
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-700 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} />
            新規作成
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Plan limit notice */}
        {plan === 'free' && manualList.length >= 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-4">
            <p className="text-[13px] text-amber-800">
              無料プランの上限（3件）に達しています。
            </p>
            <Link
              href="/pricing"
              className="flex-shrink-0 text-[12px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Proにアップグレード
            </Link>
          </div>
        )}

        {manualList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {manualList.map((manual) => (
              <ManualCard key={manual.id} manual={manual} />
            ))}
          </div>
        )}
      </div>

      <DashboardClient />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MessageSquare size={22} className="text-neutral-400" />
      </div>
      <h2 className="text-[15px] font-semibold text-neutral-700 mb-2">
        まだマニュアルがありません
      </h2>
      <p className="text-[13px] text-neutral-400 mb-6 leading-[1.7]">
        業種を選んでAIインタビューを始めましょう。
        <br />
        答えるだけで引き継ぎ資料が完成します。
      </p>
      <Link
        href="/interview/new"
        className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold px-6 py-3 rounded-xl text-[14px] transition-colors"
      >
        <Plus size={14} />
        最初のマニュアルを作る
      </Link>
    </div>
  )
}

const STATUS_CONFIG = {
  interviewing: { label: 'ヒアリング中', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  generating: { label: '生成中', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  completed: { label: '完成', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  archived: { label: 'アーカイブ', icon: Archive, color: 'text-neutral-500 bg-neutral-100' },
} as const

const BUSINESS_ICONS: Record<string, string> = {
  restaurant: '🍽️',
  beauty_salon: '💇',
  professional_office: '📊',
  general: '📋',
}

function ManualCard({ manual }: { manual: ManualRow }) {
  const config = STATUS_CONFIG[manual.status]
  const Icon = config.icon
  const href =
    manual.status === 'completed'
      ? `/manual/${manual.id}`
      : `/interview/${manual.id}`

  const updatedAt = new Date(manual.updated_at)
  const dateStr = updatedAt.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })

  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-white rounded-xl border border-neutral-200 px-4 py-4 hover:border-neutral-300 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
        {BUSINESS_ICONS[manual.business_type] ?? '📋'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-neutral-800 truncate">
          {manual.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.color}`}>
            <Icon size={9} />
            {config.label}
          </span>
          {manual.section_count ? (
            <span className="text-[11px] text-neutral-400">
              {manual.section_count}セクション
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-neutral-400">{dateStr}</span>
        <FileText size={14} className="text-neutral-300" />
      </div>
    </Link>
  )
}
