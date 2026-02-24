'use client'

import { useState } from 'react'
import { useGeneratorStore } from '@/stores/generatorStore'

export default function ShopProfile() {
  const { shopName, shopDescription, setShopName, setShopDescription } = useGeneratorStore()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-stone-500">🏪</span>
          <span className="text-sm font-medium text-stone-700">お店情報（任意）</span>
          {(shopName || shopDescription) && (
            <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">入力済み</span>
          )}
        </div>
        <span className="text-stone-400">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="border-t border-stone-200 px-5 py-4 space-y-4 bg-stone-50">
          <p className="text-xs text-stone-500">お店の情報を入力すると、より自然な返信文を生成できます。</p>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">お店の名前</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="例: イタリアンレストラン ラ・ベラ"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">お店の特徴・こだわり</label>
            <textarea
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              placeholder="例: 地元農家から直送した新鮮野菜を使ったパスタが自慢の家族経営のお店です。"
              rows={3}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
