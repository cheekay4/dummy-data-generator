'use client'

import { useRef, useEffect } from 'react'
import { Send, Mic } from 'lucide-react'

interface InputAreaProps {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function InputArea({ value, onChange, onSend, disabled }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) onSend()
    }
  }

  const handleMicClick = () => {
    alert('音声入力はProプランで利用できます。')
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="回答を入力…"
          disabled={disabled}
          rows={1}
          className="flex-1 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[14px] resize-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none bg-neutral-50 placeholder:text-neutral-400 disabled:opacity-50 leading-[1.6]"
          style={{ minHeight: '42px', maxHeight: '120px' }}
        />
        <button
          onClick={handleMicClick}
          title="音声入力（Proプランで利用可能）"
          className="w-9 h-9 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 transition-colors flex-shrink-0"
        >
          <Mic size={16} />
        </button>
        <button
          onClick={() => value.trim() && !disabled && onSend()}
          disabled={!value.trim() || disabled}
          className="w-9 h-9 bg-neutral-900 hover:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} color="white" />
        </button>
      </div>
    </div>
  )
}
