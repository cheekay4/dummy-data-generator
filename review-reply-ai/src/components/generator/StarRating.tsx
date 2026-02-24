'use client'

import { useGeneratorStore } from '@/stores/generatorStore'

export default function StarRating() {
  const { rating, setRating } = useGeneratorStore()

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        星評価 <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`w-11 h-11 rounded-xl border-2 font-bold text-lg transition-all ${
              rating === star
                ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                : rating >= star
                ? 'border-amber-300 bg-amber-50 text-amber-500'
                : 'border-stone-200 bg-white text-stone-300 hover:border-amber-300 hover:text-amber-400'
            }`}
          >
            {star}
          </button>
        ))}
        {rating > 0 && (
          <div className="flex items-center ml-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-xl ${i < rating ? 'text-amber-400' : 'text-stone-200'}`}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
