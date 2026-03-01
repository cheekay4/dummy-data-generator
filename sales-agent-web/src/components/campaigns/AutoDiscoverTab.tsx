'use client'
import { useState, useEffect, useCallback } from 'react'

interface Candidate {
  name: string
  email: string | null
  website_url: string
  industry: string
  estimated_scale: string
  has_line_official: boolean
  source_url: string
  google_place_id?: string
  google_rating?: number | null
  google_review_count?: number | null
  phone?: string | null
  address?: string | null
  google_maps_url?: string | null
  source: 'google_places' | 'tavily' | 'mock'
  product?: string
}

// 業種 → プロダクト自動判定
const INDUSTRY_PRODUCT_DEFAULT: Record<string, string> = {
  restaurant:  'review-reply-ai',
  beauty:      'review-reply-ai',
  gym:         'review-reply-ai',
  realestate:  'review-reply-ai',
  school:      'review-reply-ai',
  ec:          'msgscore',
  saas:        'msgscore',
  other:       'review-reply-ai',
}

const STORAGE_KEY = 'autodiscover_state'

interface StoredState {
  candidates: Candidate[]
  selected: string[]
  note: string
  addResult: { added: number; skipped: number } | null
}

function loadStored(): StoredState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredState
  } catch {
    return null
  }
}

const INDUSTRIES = [
  { value: 'restaurant', label: '飲食店（カフェ/レストラン/テイクアウト）' },
  { value: 'ec', label: 'EC・通販' },
  { value: 'gym', label: 'パーソナルジム/フィットネス/パーソナルトレーナー' },
  { value: 'beauty', label: '美容（ネイル/エステ/美容室）' },
  { value: 'saas', label: 'SaaS/ITサービス' },
  { value: 'realestate', label: '不動産' },
  { value: 'school', label: '教室/スクール（ヨガ/ピラティス/料理教室）' },
  { value: 'other', label: 'その他' },
]

const PREFECTURES = [
  '東京都', '大阪府', '神奈川県', '愛知県', '福岡県',
  '北海道', '埼玉県', '千葉県', '兵庫県', '京都府',
]

const SCALES = [
  { value: 'individual', label: '個人事業主・フリーランス' },
  { value: 'small', label: '小規模（〜5人）' },
  { value: 'medium', label: '中小（6〜30人）' },
  { value: 'large', label: '中堅以上（31人〜）' },
]

export default function AutoDiscoverTab() {
  const [industry, setIndustry] = useState('restaurant')
  const [product, setProduct] = useState('review-reply-ai')
  const [region, setRegion] = useState('東京都')
  const [subRegion, setSubRegion] = useState('')
  const [scales, setScales] = useState<string[]>(['individual', 'small'])
  const [keyword, setKeyword] = useState('')
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [addLoading, setAddLoading] = useState(false)
  const [addResult, setAddResult] = useState<{ added: number; skipped: number } | null>(null)
  const [note, setNote] = useState('')

  // sessionStorage から復元（初回マウント時）
  useEffect(() => {
    const stored = loadStored()
    if (stored) {
      setCandidates(stored.candidates)
      setSelected(new Set(stored.selected))
      setNote(stored.note)
      setAddResult(stored.addResult)
    }
  }, [])

  // 検索結果を sessionStorage に保存
  const saveState = useCallback((c: Candidate[], sel: Set<string>, n: string, ar: { added: number; skipped: number } | null) => {
    const state: StoredState = { candidates: c, selected: [...sel], note: n, addResult: ar }
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [])

  function toggleScale(v: string) {
    setScales((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])
  }

  async function handleDiscover() {
    setLoading(true)
    setCandidates([])
    setSelected(new Set())
    setAddResult(null)
    setNote('')
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, region, sub_region: subRegion, scale: scales, keyword, limit, product: product === 'both' ? 'review-reply-ai' : product }),
      })
      const data = await res.json()
      const list: Candidate[] = data.candidates ?? []
      const noteText = data.note ?? ''
      const sel = new Set(list.filter((c) => c.email).map((c) => c.website_url))
      setCandidates(list)
      setNote(noteText)
      setSelected(sel)
      saveState(list, sel, noteText, null)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLeads() {
    setAddLoading(true)
    const toAdd = candidates.filter((c) => c.email && selected.has(c.website_url))
    const res = await fetch('/api/leads/bulk-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leads: toAdd.map((c) => ({
          company_name: c.name,
          email: c.email,
          website_url: c.website_url,
          industry: c.industry,
          estimated_scale: c.estimated_scale,
          discovery_method: 'auto_discover',
          google_place_id: c.google_place_id,
          google_rating: c.google_rating,
          google_review_count: c.google_review_count,
          phone: c.phone,
          address: c.address,
          google_maps_url: c.google_maps_url,
          product: c.product ?? (product === 'both' ? 'review-reply-ai' : product),
        })),
      }),
    })
    const data = await res.json()
    const result = { added: data.added ?? 0, skipped: data.skipped ?? 0 }
    setAddResult(result)
    setAddLoading(false)
    saveState(candidates, selected, note, result)
  }

  const withEmail = candidates.filter((c) => c.email)
  const selectedCount = candidates.filter((c) => c.email && selected.has(c.website_url)).length

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-5">🔍 ターゲット自動探索</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">業界</label>
          <select value={industry} onChange={(e) => {
            const v = e.target.value
            setIndustry(v)
            setProduct(INDUSTRY_PRODUCT_DEFAULT[v] ?? 'review-reply-ai')
          }}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
            {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">対象プロダクト</label>
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => setProduct('review-reply-ai')}
              className={`rounded-xl px-2 py-2.5 text-xs font-medium border transition-colors ${product === 'review-reply-ai' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              AI口コミ返信
            </button>
            <button type="button" onClick={() => setProduct('msgscore')}
              className={`rounded-xl px-2 py-2.5 text-xs font-medium border transition-colors ${product === 'msgscore' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              MsgScore
            </button>
            <button type="button" onClick={() => setProduct('both')}
              className={`rounded-xl px-2 py-2.5 text-xs font-medium border transition-colors ${product === 'both' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              両方
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">地域</label>
          <div className="flex gap-2">
            <select value={region} onChange={(e) => setRegion(e.target.value)}
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
              {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={subRegion} onChange={(e) => setSubRegion(e.target.value)}
              placeholder="区・市（任意）"
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">規模</label>
        <div className="flex flex-wrap gap-4">
          {SCALES.map((s) => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={scales.includes(s.value)} onChange={() => toggleScale(s.value)}
                className="rounded w-4 h-4" />
              <span className="text-sm text-stone-700">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">キーワード（任意）</label>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: LINE公式、予約システム"
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">探索数</label>
          <input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))}
            min={5} max={50}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
      </div>

      <button
        onClick={handleDiscover}
        disabled={loading || scales.length === 0}
        className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '🔍 探索中...' : '🚀 候補を探す'}
      </button>

      {note && (
        <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ {note}
        </p>
      )}

      {/* 結果 */}
      {candidates.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-stone-700">
              {candidates.length}件見つかりました（メールあり: {withEmail.length}件）
            </p>
            <div className="flex gap-3">
              <button onClick={() => setSelected(new Set(withEmail.map((c) => c.website_url)))}
                className="text-xs text-indigo-600 hover:underline">全選択</button>
              <button onClick={() => setSelected(new Set())}
                className="text-xs text-stone-400 hover:underline">全解除</button>
            </div>
          </div>

          <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
            {candidates.map((c) => (
              <label key={c.website_url}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  c.email
                    ? selected.has(c.website_url)
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                    : 'bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!c.email}
                  checked={c.email ? selected.has(c.website_url) : false}
                  onChange={() => {
                    if (!c.email) return
                    setSelected((prev) => {
                      const next = new Set(prev)
                      next.has(c.website_url) ? next.delete(c.website_url) : next.add(c.website_url)
                      return next
                    })
                  }}
                  className="mt-0.5 rounded w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-stone-900 truncate">{c.name}</p>
                    {c.google_rating != null && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                        ★ {c.google_rating}{c.google_review_count != null && ` (${c.google_review_count})`}
                      </span>
                    )}
                    {c.has_line_official && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full shrink-0">LINE公式</span>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                      c.source === 'google_places' ? 'bg-blue-50 text-blue-600' :
                      c.source === 'tavily' ? 'bg-purple-50 text-purple-600' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {c.source === 'google_places' ? 'Google Places' : c.source === 'tavily' ? 'Tavily' : 'Mock'}
                    </span>
                  </div>
                  {c.email ? (
                    <p className="text-xs text-stone-500 font-mono mt-0.5">{c.email}</p>
                  ) : (
                    <p className="text-xs text-red-400 mt-0.5">メール未検出 — 追加不可</p>
                  )}
                  {c.address && (
                    <p className="text-xs text-stone-400 mt-0.5 truncate">{c.address}</p>
                  )}
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {c.phone && (
                      <span className="text-xs text-stone-400">{c.phone}</span>
                    )}
                    <a href={c.website_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}>
                      {c.website_url}
                    </a>
                    {c.google_maps_url && (
                      <a href={c.google_maps_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline shrink-0"
                        onClick={(e) => e.stopPropagation()}>
                        Maps で確認
                      </a>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {addResult ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
              ✅ {addResult.added}件をリードに追加しました（重複スキップ: {addResult.skipped}件）
              <a href="/leads" className="ml-3 underline font-medium">リードを確認する →</a>
            </div>
          ) : (
            <button
              onClick={handleAddLeads}
              disabled={addLoading || selectedCount === 0}
              className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {addLoading ? '追加中...' : `選択した ${selectedCount}件をリードに追加`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
