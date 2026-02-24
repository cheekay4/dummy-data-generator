'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import type { Tone } from '@/lib/types'

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: '丁寧', label: '丁寧', desc: 'ですます調・フォーマル' },
  { value: 'フレンドリー', label: 'フレンドリー', desc: '親しみやすい・敬語あり' },
  { value: 'カジュアル', label: 'カジュアル', desc: '距離が近い・常連向き' },
]

export default function ToneSelector() {
  const { tone, setTone } = useGeneratorStore()

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        返信トーン <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        {TONES.map(({ value, label, desc }) => (
          <label
            key={value}
            className={`flex-1 flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
              tone === value
                ? 'border-amber-500 bg-amber-50'
                : 'border-stone-200 bg-white hover:border-amber-300'
            }`}
          >
            <input
              type="radio"
              name="tone"
              value={value}
              checked={tone === value}
              onChange={() => setTone(value)}
              className="mt-0.5 accent-amber-500"
            />
            <div>
              <p className={`text-sm font-medium ${tone === value ? 'text-amber-700' : 'text-stone-700'}`}>{label}</p>
              <p className="text-xs text-stone-400">{desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
