'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import type { GenerateReplyRequest } from '@/lib/types'

interface SubmitButtonProps {
  profileId: string | null
  modifierId: string | null
}

export default function SubmitButton({ profileId, modifierId }: SubmitButtonProps) {
  const {
    reviewText,
    rating,
    platform,
    businessType,
    tone,
    shopName,
    shopDescription,
    remainingToday,
    step,
    setStep,
    setResult,
    setError,
  } = useGeneratorStore()

  const isDisabled = !reviewText.trim() || rating === 0 || step === 'loading' || remainingToday === 0

  async function handleSubmit() {
    setStep('loading')

    const payload: GenerateReplyRequest = {
      reviewText,
      rating,
      platform,
      businessType,
      tone,
      shopName: shopName || undefined,
      shopDescription: shopDescription || undefined,
      profileId: profileId ?? undefined,
      modifierId: modifierId ?? undefined,
      source: 'web',
    }

    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        setResult(json.data, json.remainingToday)
      } else {
        setError(json.error || '生成に失敗しました。')
      }
    } catch {
      setError('ネットワークエラーが発生しました。しばらくしてからもう一度お試しください。')
    }
  }

  return (
    <div>
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
          isDisabled
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg active:scale-[0.99]'
        }`}
      >
        {step === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AIが返信文を生成中...
          </span>
        ) : remainingToday === 0 ? (
          '本日の利用回数を使い切りました'
        ) : (
          '✨ 返信文を生成する'
        )}
      </button>
      {remainingToday >= 0 && (
        <p className="text-center text-xs text-stone-400 mt-2">
          {remainingToday > 0
            ? `本日あと ${remainingToday} 回利用できます（無料）`
            : '本日の無料利用回数を使い切りました'}
        </p>
      )}
    </div>
  )
}
