'use client'

import { useState } from 'react'
import type { ReplyPattern } from '@/lib/types'

interface Props {
  pattern: ReplyPattern
  index: number
}

export default function ReplyCard({ pattern, index }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pattern.reply)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback: select
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
          パターン{index === 0 ? 'A' : 'B'}
        </span>
        <span className="text-sm text-stone-600 font-medium">{pattern.label}</span>
      </div>
      <p className="text-stone-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{pattern.reply}</p>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-100">
        <span className="text-xs text-stone-400">📋 {pattern.reply.length}文字</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
          }`}
        >
          {copied ? '✓ コピーしました' : 'コピー'}
        </button>
      </div>
    </div>
  )
}
