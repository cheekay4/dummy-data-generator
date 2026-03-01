'use client'
import { useState } from 'react'
import AutoDiscoverTab from '@/components/campaigns/AutoDiscoverTab'
import UrlScrapeTab from '@/components/campaigns/UrlScrapeTab'
import ManualAddTab from '@/components/campaigns/ManualAddTab'

const TABS = [
  { id: 'discover', label: '🔍 自動探索',   desc: '業種・地域から候補を自動発見' },
  { id: 'url',      label: '🔗 URL指定',    desc: 'URLを直接スクレイプ（CLI）' },
  { id: 'manual',   label: '✏️ 手動追加',  desc: 'リードを直接入力' },
] as const

type TabId = 'discover' | 'url' | 'manual'

export default function CampaignsPage() {
  const [tab, setTab] = useState<TabId>('discover')

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">キャンペーン</p>
        <h1 className="text-2xl font-bold text-stone-900">リードを追加</h1>
      </div>

      {/* タブ */}
      <div className="flex gap-2 mb-6">
        {TABS.map(({ id, label, desc }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-2xl border px-4 py-3 text-left transition-all ${
              tab === id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-stone-200 text-stone-700 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <p className="text-sm font-semibold">{label}</p>
            <p className={`text-xs mt-0.5 ${tab === id ? 'text-indigo-200' : 'text-stone-400'}`}>{desc}</p>
          </button>
        ))}
      </div>

      <div className={tab === 'discover' ? '' : 'hidden'}><AutoDiscoverTab /></div>
      <div className={tab === 'url'      ? '' : 'hidden'}><UrlScrapeTab /></div>
      <div className={tab === 'manual'   ? '' : 'hidden'}><ManualAddTab /></div>
    </div>
  )
}
