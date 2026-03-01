'use client'
import { useState } from 'react'

export default function ManualAddTab() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [industry, setIndustry] = useState('')
  const [product, setProduct] = useState('review-reply-ai')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd() {
    if (!companyName || !email) return
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/leads/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: [{ company_name: companyName, email, website_url: websiteUrl, industry, product: product === 'both' ? 'review-reply-ai' : product, discovery_method: 'manual' }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'エラーが発生しました')
      if (data.skipped > 0) {
        setError('このメールアドレスは既に登録済みです')
      } else {
        setSuccess(true)
        setCompanyName('')
        setEmail('')
        setWebsiteUrl('')
        setIndustry('')
        setProduct('review-reply-ai')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-stone-900 mb-5">✏️ リードを手動追加</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">企業名 / 屋号 *</label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            placeholder="カフェ花道"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">メールアドレス *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="info@cafe-hanamichi.jp"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">ウェブサイト（任意）</label>
          <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://cafe-hanamichi.jp"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">業種（任意）</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)}
            placeholder="飲食店"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">対象プロダクト</label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setProduct('review-reply-ai')}
              className={`rounded-xl px-3 py-3 text-sm font-medium border transition-colors ${product === 'review-reply-ai' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              AI口コミ返信
            </button>
            <button type="button" onClick={() => setProduct('msgscore')}
              className={`rounded-xl px-3 py-3 text-sm font-medium border transition-colors ${product === 'msgscore' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              MsgScore
            </button>
            <button type="button" onClick={() => setProduct('both')}
              className={`rounded-xl px-3 py-3 text-sm font-medium border transition-colors ${product === 'both' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              両方
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">⚠️ {error}</p>}
        {success && (
          <p className="text-sm text-green-600">
            ✅ リードを追加しました！
            <a href="/leads" className="ml-2 underline">リードを確認する →</a>
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={loading || !companyName || !email}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '追加中...' : '✅ リードを追加'}
        </button>
      </div>
    </div>
  )
}
