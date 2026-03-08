'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronLeft, Edit2, Download, FileText, Check, Share2, X, Loader2, Crown } from 'lucide-react'
import { useInterviewStore } from '@/stores/interviewStore'
import { useAuth } from '@/components/auth/AuthProvider'

interface TocItem {
  id: string
  text: string
  level: number
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const toc: TocItem[] = []
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/)
    if (m) {
      const text = m[2].replace(/[*_`]/g, '').trim()
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      toc.push({ id, text, level: m[1].length })
    }
  }
  return toc
}

function downloadMarkdown(content: string, title: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function printManual(title: string, content: string) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!DOCTYPE html>
<html lang="ja"><head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
body{font-family:'Hiragino Sans','Noto Sans JP',sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a;line-height:1.8;font-size:13px}
h1{font-size:22px;border-bottom:2px solid #ddd;padding-bottom:8px;margin-bottom:24px}
h2{font-size:17px;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:32px}
h3{font-size:15px;margin-top:20px}
blockquote{background:#f5f5f5;border-left:3px solid #ccc;padding:10px 16px;margin:12px 0}
table{width:100%;border-collapse:collapse;margin:12px 0}
th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}
th{background:#f5f5f5}
footer{margin-top:48px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee;padding-top:16px}
@media print{@page{margin:20mm}}
</style></head>
<body>
<h1>${title}</h1>
<p style="color:#999;font-size:11px;margin-bottom:24px">引き継ぎAIで生成 — ${new Date().toLocaleDateString('ja-JP')}</p>
<div id="content"></div>
<footer>引き継ぎAI (hikitsugi-ai.vercel.app) で生成されたマニュアル</footer>
<script>
const md = ${JSON.stringify(content)};
// Basic markdown to HTML
document.getElementById('content').innerHTML = md
  .replace(/^# (.+)$/gm,'<h1>$1</h1>')
  .replace(/^## (.+)$/gm,'<h2>$1</h2>')
  .replace(/^### (.+)$/gm,'<h3>$1</h3>')
  .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
  .replace(/\*(.+?)\*/g,'<em>$1</em>')
  .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
  .replace(/^- (.+)$/gm,'<li>$1</li>')
  .replace(/^(\d+)\. (.+)$/gm,'<li>$2</li>')
  .replace(/\n\n/g,'</p><p>')
  .replace(/^(<h|<li|<blockquote)/gm,'$1')
window.onload = () => { window.print(); window.close(); }
</script></body></html>`)
  w.document.close()
}

export default function ManualPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { generatedMarkdown, manualTitle, selectedTemplate, setMarkdown } = useInterviewStore()
  const { profile } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [copied, setCopied] = useState(false)

  // Share state
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)

  // DB-loaded fallback
  const [dbMarkdown, setDbMarkdown] = useState<string | null>(null)
  const [dbTitle, setDbTitle] = useState<string | null>(null)
  const [dbBusinessType, setDbBusinessType] = useState<string | null>(null)

  const plan = profile?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'team'

  const loadFromDb = useCallback(async () => {
    const res = await fetch(`/api/manuals/${id}`)
    if (res.ok) {
      const data = await res.json()
      const m = data.manual
      if (m?.content_markdown) {
        setDbMarkdown(m.content_markdown)
        setDbTitle(m.title)
        setDbBusinessType(m.business_type)
        if (m.share_token) {
          setShareUrl(`${window.location.origin}/share/${m.share_token}`)
        }
      }
    }
  }, [id])

  useEffect(() => {
    if (!generatedMarkdown) {
      loadFromDb()
    } else {
      setEditValue(generatedMarkdown)
    }
  }, [generatedMarkdown, loadFromDb])

  const activeMarkdown = generatedMarkdown ?? dbMarkdown
  const activeTitle = manualTitle || dbTitle || '無題のマニュアル'
  const activeTemplate = selectedTemplate?.businessType ?? dbBusinessType ?? ''

  useEffect(() => {
    if (!activeMarkdown && !dbMarkdown) {
      const timer = setTimeout(() => router.replace('/interview/new'), 3000)
      return () => clearTimeout(timer)
    }
  }, [activeMarkdown, dbMarkdown, router])

  if (!activeMarkdown) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-neutral-400 mx-auto mb-3" />
          <p className="text-[13px] text-neutral-500">マニュアルを読み込み中...</p>
        </div>
      </div>
    )
  }

  const toc = extractToc(activeMarkdown)
  const wordCount = activeMarkdown.replace(/[#*`>\-\[\]]/g, '').replace(/\s+/g, ' ').length
  const readMinutes = Math.ceil(wordCount / 400)

  const handleSaveEdit = async () => {
    setMarkdown(editValue)
    setIsEditing(false)
    // Save to DB
    await fetch(`/api/manuals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_markdown: editValue }),
    }).catch(() => {})
  }

  const handleCopyMd = async () => {
    await navigator.clipboard.writeText(activeMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateShare = async () => {
    setShareLoading(true)
    const res = await fetch(`/api/manuals/${id}/share`, { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      setShareUrl(data.url)
    }
    setShareLoading(false)
  }

  const handleCopyShare = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  const handleRevokeShare = async () => {
    await fetch(`/api/manuals/${id}/share`, { method: 'DELETE' })
    setShareUrl(null)
    setShowSharePanel(false)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-14 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </Link>
            <h1 className="font-semibold text-neutral-800 text-[14px]">完成マニュアル</h1>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => { setEditValue(activeMarkdown); setIsEditing(false) }}
                  className="text-[11px] text-neutral-500 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="text-[11px] text-white bg-neutral-900 px-3 py-1.5 rounded-lg"
                >
                  保存
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 flex items-center gap-1.5"
                >
                  <Edit2 size={11} />
                  編集
                </button>
                <button
                  onClick={handleCopyMd}
                  className="text-[11px] text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 flex items-center gap-1.5"
                >
                  {copied ? <Check size={11} className="text-green-600" /> : <FileText size={11} />}
                  {copied ? 'コピー済み' : 'コピー'}
                </button>
                <button
                  onClick={() => downloadMarkdown(activeMarkdown, activeTitle)}
                  className="text-[11px] text-white bg-neutral-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Download size={11} />
                  MD
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Manual meta */}
        <div className="bg-neutral-50 border-b border-neutral-200 rounded-xl px-5 py-5 mb-6">
          <h2 className="text-[18px] font-bold text-neutral-900 leading-snug mb-2">
            {activeTitle}
          </h2>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span>{activeTemplate}</span>
            <span>·</span>
            <span>{toc.length}セクション</span>
            <span>·</span>
            <span>約{readMinutes}分で読了</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {isPro ? (
              <button
                onClick={() => printManual(activeTitle, activeMarkdown)}
                className="flex items-center gap-1.5 text-[11px] text-neutral-700 border border-neutral-200 bg-white px-3 py-2 rounded-lg hover:border-neutral-300 transition-colors"
              >
                <FileText size={11} />
                PDF出力
              </button>
            ) : (
              <button
                disabled
                title="Proプランで利用可能"
                className="flex items-center gap-1.5 text-[11px] text-neutral-300 border border-neutral-200 bg-white px-3 py-2 rounded-lg cursor-not-allowed"
              >
                <Crown size={11} />
                PDF（Pro）
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowSharePanel(!showSharePanel)}
                className="flex items-center gap-1.5 text-[11px] text-neutral-700 border border-neutral-200 bg-white px-3 py-2 rounded-lg hover:border-neutral-300 transition-colors"
              >
                <Share2 size={11} />
                {shareUrl ? '共有中' : '共有'}
                {shareUrl && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </button>

              {showSharePanel && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSharePanel(false)} />
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-semibold text-neutral-700">共有リンク</p>
                      <button onClick={() => setShowSharePanel(false)} className="text-neutral-400">
                        <X size={14} />
                      </button>
                    </div>

                    {shareUrl ? (
                      <>
                        <div className="bg-neutral-50 rounded-lg px-3 py-2 mb-3 break-all">
                          <p className="text-[11px] text-neutral-600 font-mono">{shareUrl}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopyShare}
                            className="flex-1 text-[12px] font-medium text-white bg-neutral-900 hover:bg-neutral-700 py-2 rounded-lg transition-colors"
                          >
                            {shareCopied ? 'コピー済み' : 'URLをコピー'}
                          </button>
                          <button
                            onClick={handleRevokeShare}
                            className="text-[12px] text-red-500 hover:text-red-600 px-2"
                          >
                            削除
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-2">
                          リンクを知っている人なら誰でも閲覧できます
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[12px] text-neutral-500 mb-3">
                          共有URLを生成すると、ログイン不要で閲覧できるリンクが作成されます。
                        </p>
                        <button
                          onClick={handleGenerateShare}
                          disabled={shareLoading}
                          className="w-full flex items-center justify-center gap-2 text-[13px] font-medium text-white bg-neutral-900 hover:bg-neutral-700 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {shareLoading && <Loader2 size={12} className="animate-spin" />}
                          共有リンクを生成
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* TOC sidebar (desktop) */}
          {toc.length > 0 && !isEditing && (
            <div className="hidden lg:block w-48 flex-shrink-0">
              <div className="sticky top-32 bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  目次
                </p>
                <nav className="space-y-1">
                  {toc.map((item, i) => (
                    <a
                      key={i}
                      href={`#${item.id}`}
                      className={`block text-[11px] text-neutral-600 hover:text-neutral-900 leading-[1.6] transition-colors ${
                        item.level === 3 ? 'pl-3 text-neutral-400' : ''
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div>
                <p className="text-[12px] text-neutral-500 mb-2">
                  Markdown形式で編集できます
                </p>
                <textarea
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="w-full h-[70vh] border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-mono resize-none focus:border-slate-400 focus:ring-0 outline-none bg-white leading-[1.8]"
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 px-6 py-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const text = String(children)
                      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
                      return (
                        <h2
                          id={id}
                          className="text-[16px] font-bold text-neutral-800 mt-8 mb-3 pb-2 border-b border-neutral-100 first:mt-0"
                        >
                          {children}
                        </h2>
                      )
                    },
                    h3: ({ children }) => {
                      const text = String(children)
                      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
                      return (
                        <h3 id={id} className="text-[14px] font-semibold text-neutral-800 mt-5 mb-2">
                          {children}
                        </h3>
                      )
                    },
                    p: ({ children }) => (
                      <p className="text-[13px] text-neutral-600 leading-[1.9] mb-3">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-1 mb-4 ml-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-1 mb-4 ml-4 list-decimal">{children}</ol>
                    ),
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
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-')
                      if (isBlock) {
                        return (
                          <code className="block bg-neutral-900 text-neutral-100 rounded-lg px-4 py-3 text-[12px] font-mono overflow-x-auto mb-4">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code className="bg-neutral-100 text-neutral-700 rounded px-1 py-0.5 text-[12px] font-mono">
                          {children}
                        </code>
                      )
                    },
                    strong: ({ children }) => (
                      <strong className="font-semibold text-neutral-800">{children}</strong>
                    ),
                    hr: () => <hr className="border-neutral-100 my-6" />,
                  }}
                >
                  {activeMarkdown}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
