'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// SpeechRecognition の型宣言（ブラウザ標準型が不完全なため補完）
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return (
    (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition ??
    null
  )
}

export interface UseVoiceInputReturn {
  isListening: boolean
  transcript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // クライアントサイドでのみ対応確認
  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognition()
    setIsSupported(SpeechRecognitionClass !== null)
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition()
    if (!SpeechRecognitionClass) {
      setError('音声認識はこのブラウザでは利用できません。')
      return
    }

    // 既存のセッションがあれば停止
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    setError(null)
    setTranscript('')

    const recognition = new SpeechRecognitionClass()
    recognition.lang = 'ja-JP'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = ''
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      setTranscript(finalText || interimText)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted') return
      const errorMessages: Record<string, string> = {
        'no-speech': '音声が検出されませんでした。',
        'audio-capture': 'マイクにアクセスできません。',
        'not-allowed': 'マイクの使用が許可されていません。',
        'network': 'ネットワークエラーが発生しました。',
      }
      setError(errorMessages[event.error] ?? '音声認識エラーが発生しました。')
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  // アンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return { isListening, transcript, error, isSupported, startListening, stopListening, clearTranscript }
}
