'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import type { BusinessType } from '@/lib/types'

const BUSINESS_TYPES: { value: BusinessType; icon: string }[] = [
  { value: '飲食店（カフェ・レストラン・居酒屋）', icon: '🍽️' },
  { value: '美容院・ネイルサロン', icon: '💇' },
  { value: 'クリニック・歯科', icon: '🏥' },
  { value: 'ホテル・旅館', icon: '🏨' },
  { value: '小売店・雑貨店', icon: '🛍️' },
  { value: '整体・マッサージ', icon: '💆' },
  { value: '不動産', icon: '🏠' },
  { value: 'その他（自由記述）', icon: '📝' },
]

export default function BusinessTypeSelect() {
  const { businessType, setBusinessType } = useGeneratorStore()

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        業種 <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BUSINESS_TYPES.map(({ value, icon }) => (
          <button
            key={value}
            onClick={() => setBusinessType(value)}
            className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
              businessType === value
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-center leading-tight">{value.split('（')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
