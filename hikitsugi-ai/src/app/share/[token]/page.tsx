import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('manuals')
    .select('title, business_type')
    .eq('share_token', token)
    .eq('is_public', true)
    .single()

  if (!data) return { title: '引き継ぎAI — 共有マニュアル' }

  return {
    title: `${data.title} | 引き継ぎAI`,
    description: `${data.business_type}の引き継ぎマニュアル — 引き継ぎAIで生成`,
  }
}

export default async function SharePage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('manuals')
    .select('title, business_type, content_markdown, created_at')
    .eq('share_token', token)
    .eq('is_public', true)
    .single()

  if (!data || !data.content_markdown) notFound()

  const createdAt = new Date(data.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-600 rounded-md flex items-center justify-center">
              <MessageSquare size={12} color="white" />
            </div>
            <span className="font-semibold text-neutral-700 text-[13px]">引き継ぎAI</span>
          </Link>
          <span className="text-[11px] text-neutral-400">閲覧専用</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Manual meta */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-neutral-900 leading-snug mb-2">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-[12px] text-neutral-400">
            <span>{data.business_type}</span>
            <span>·</span>
            <span>{createdAt}</span>
            <span>·</span>
            <span>引き継ぎAIで生成</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-neutral-200 px-6 py-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-[16px] font-bold text-neutral-800 mt-8 mb-3 pb-2 border-b border-neutral-100 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[14px] font-semibold text-neutral-800 mt-5 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[13px] text-neutral-600 leading-[1.9] mb-3">{children}</p>
              ),
              ul: ({ children }) => <ul className="space-y-1 mb-4 ml-4">{children}</ul>,
              ol: ({ children }) => <ol className="space-y-1 mb-4 ml-4 list-decimal">{children}</ol>,
              li: ({ children }) => (
                <li className="text-[13px] text-neutral-600 leading-[1.85] flex gap-2 items-start">
                  <span className="text-neutral-300 mt-[3px] flex-shrink-0">–</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="bg-slate-50 border border-slate-200/60 rounded-lg px-4 py-3 mb-4">
                  <div className="text-[12px] text-slate-600 leading-[1.8]">{children}</div>
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-[12px] border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-semibold text-neutral-700">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-neutral-200 px-3 py-2 text-neutral-600">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-neutral-800">{children}</strong>
              ),
              hr: () => <hr className="border-neutral-100 my-6" />,
            }}
          >
            {data.content_markdown}
          </ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-[12px] text-neutral-400 mb-3">
            このマニュアルは引き継ぎAIで生成されました
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            無料で自分のマニュアルを作る →
          </Link>
        </div>
      </div>
    </div>
  )
}
