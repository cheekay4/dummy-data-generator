'use client'

import { useGeneratorStore } from '@/stores/generatorStore'

export default function ReviewInput() {
  const { reviewText, setReviewText } = useGeneratorStore()

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        口コミ本文 <span className="text-red-500">*</span>
      </label>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value.slice(0, 5000))}
        placeholder="口コミをここに貼り付けてください..."
        rows={5}
        maxLength={5000}
        className="w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none text-sm leading-relaxed"
      />
      <p className={`text-xs mt-1 text-right ${reviewText.length >= 4800 ? 'text-amber-500' : 'text-stone-400'}`}>
        {reviewText.length} / 5,000文字
      </p>
    </div>
  )
}
