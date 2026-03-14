'use client'

import { useRef, useEffect } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'
import { useVoiceInput } from './VoiceRecorder'

interface InputAreaProps {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function InputArea({ value, onChange, onSend, disabled }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isListening, transcript, error: voiceError, isSupported, startListening, stopListening, clearTranscript } = useVoiceInput()

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }, [value])

  // transcript が更新されたらテキストエリアに反映（既存テキストがあれば末尾に追記）
  // value を依存に含めると onChange → value 更新 → effect 再発火の無限ループになるため除外
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!transcript) return
    // 既存の手入力テキストを保護しつつ音声認識結果を追記する
    const currentValue = textareaRef.current?.value ?? ''
    onChange(currentValue ? `${currentValue} ${transcript}` : transcript)
  }, [transcript])

  // 音声認識セッションが終了した時点で transcript をリセット
  // transcript・clearTranscript を依存に含めないことで onChange 再発火（入力消失）を防ぐ
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isListening) {
      clearTranscript()
    }
  }, [isListening])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) onSend()
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="px-4 py-3">
      {/* 音声認識エラー表示 */}
      {voiceError && (
        <p className="text-[11px] text-red-500 mb-1.5 px-1">{voiceError}</p>
      )}
      {/* 録音中インジケーター */}
      {isListening && (
        <p className="text-[11px] text-red-500 mb-1.5 px-1 animate-pulse">🎤 聞いています…</p>
      )}
      <div className="flex items-end gap-2">
        {/* マイクボタン（対応ブラウザのみ表示） */}
        {isSupported && (
          <button
            onClick={handleMicClick}
            disabled={disabled}
            title={isListening ? '音声入力を停止' : '音声で入力する'}
            aria-label={isListening ? '音声入力を停止' : '音声入力を開始'}
            style={{ minWidth: '44px', minHeight: '44px' }}
            className={[
              'rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isListening
                ? 'bg-red-50 border-red-300 text-red-500 animate-pulse'
                : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500',
            ].join(' ')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="回答を入力…"
          disabled={disabled}
          rows={1}
          className="flex-1 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[14px] resize-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none bg-neutral-50 placeholder:text-neutral-400 disabled:opacity-50 leading-[1.6]"
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
        <button
          onClick={() => value.trim() && !disabled && onSend()}
          disabled={!value.trim() || disabled}
          style={{ minWidth: '44px', minHeight: '44px' }}
          className="bg-neutral-900 hover:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} color="white" />
        </button>
      </div>
    </div>
  )
}
