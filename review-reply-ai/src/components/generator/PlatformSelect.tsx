'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import type { Platform } from '@/lib/types'

const PLATFORMS: Platform[] = [
  'Google マップ',
  '食べログ',
  'ホットペッパー',
  'Amazon',
  '楽天',
  'じゃらん',
  'トリップアドバイザー',
  'その他',
]

export default function PlatformSelect() {
  const { platform, setPlatform } = useGeneratorStore()

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        口コミ元プラットフォーム <span className="text-red-500">*</span>
      </label>
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm bg-white"
      >
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
