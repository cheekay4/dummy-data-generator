'use client'
import { useState, useEffect } from 'react'

interface LeadOption {
  id: string
  company_name: string
  email: string
  product: string
}

type ProductInterest = 'review-reply-ai' | 'msgscore' | 'both'

export default function InboundReplyTab() {
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  // 既存リード
  const [selectedLeadId, setSelectedLeadId] = useState('')
  // 新規リード
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  // 共通
  const [productInterest, setProductInterest] = useState<ProductInterest>('review-reply-ai')
  const [replyBody, setReplyBody] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; intent?: string; error?: string } | null>(null)

  useEffect(() => {
    async function fetchLeads() {
      const res = await fetch('/api/leads/list')
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads ?? [])
      }
    }
    fetchLeads()
  }, [])

  const canSubmit = mode === 'existing'
    ? selectedLeadId && replyBody.trim()
    : companyName && email && replyBody.trim()

  // DB保存用のプロダクト（「両方」の場合は review-reply-ai を主とする）
  const dbProduct = productInterest === 'both' ? 'review-reply-ai' : productInterest

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setResult(null)
    try {
      let leadId = selectedLeadId

      // 新規リードの場合は先に作成
      if (mode === 'new') {
        const createRes = await fetch('/api/leads/bulk-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leads: [{ company_name: companyName, email, product: dbProduct, discovery_method: 'manual' }],
          }),
        })
        const createData = await createRes.json()
        if (!createRes.ok) throw new Error(createData.error ?? 'リード作成に失敗しました')
        if (createData.skipped > 0) throw new Error('このメールアドレスは既に登録済みです。「既存リードから選択」に切り替えてください')

        // 作成されたリードのIDを取得
        const listRes = await fetch('/api/leads/list')
        const listData = await listRes.json()
        const created = (listData.leads as LeadOption[]).find((l) => l.email === email)
        if (!created) throw new Error('リード作成後のID取得に失敗しました')
        leadId = created.id
        setLeads(listData.leads)
      }

      // 受信メールを登録 + AI処理
      const res = await fetch('/api/replies/manual-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          reply_body: replyBody,
          subject: subject || undefined,
          product_interest: productInterest,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'エラーが発生しました')
      setResult({ ok: true, intent: data.intent })
      setReplyBody('')
      setSubject('')
      setCompanyName('')
      setEmail('')
      setSelectedLeadId('')
    } catch (e: unknown) {
      setResult({ ok: false, error: e instanceof Error ? e.message : 'エラーが発生しました' })
    } finally {
      setLoading(false)
    }
  }

  const intentLabels: Record<string, string> = {
    interested: '興味あり',
    question: '質問',
    not_interested: '興味なし',
    soft_decline: 'やんわり断り',
    internal_review: '社内検討',
    out_of_office: '不在',
    unsubscribe: '配信停止',
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">📩 受信メールを登録</h2>
      <p className="text-xs text-stone-400 mb-5">お客様から届いたメールを登録し、AIが返信ドラフトを生成します</p>

      <div className="space-y-4">
        {/* モード切替 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">送信元</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode('existing')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${mode === 'existing' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              既存リードから選択
            </button>
            <button type="button" onClick={() => setMode('new')}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${mode === 'new' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              新規登録
            </button>
          </div>
        </div>

        {/* 既存リード選択 */}
        {mode === 'existing' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">リード *</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            >
              <option value="">選択してください</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.company_name} ({lead.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 新規リード入力 */}
        {mode === 'new' && (
          <>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">企業名 / 屋号 *</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                placeholder="株式会社B"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">メールアドレス *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="info@company-b.jp"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
          </>
        )}

        {/* プロダクト選択（共通） */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">興味のある商品</label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setProductInterest('review-reply-ai')}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition-colors ${productInterest === 'review-reply-ai' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              AI口コミ返信
            </button>
            <button type="button" onClick={() => setProductInterest('msgscore')}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition-colors ${productInterest === 'msgscore' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              MsgScore
            </button>
            <button type="button" onClick={() => setProductInterest('both')}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition-colors ${productInterest === 'both' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              両方
            </button>
          </div>
        </div>

        <hr className="border-stone-100" />

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">件名（任意）</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ご紹介いただいた件について"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">メール本文 *</label>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="お客様から届いたメールの本文を貼り付けてください"
            rows={8}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 resize-y"
          />
        </div>

        {result?.ok && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700">
              登録完了！ 意図分類: <span className="font-semibold">{result.intent ? intentLabels[result.intent] ?? result.intent : '処理中'}</span>
            </p>
            <a href="/replies" className="text-sm text-green-600 underline mt-1 inline-block">
              返信ドラフトを確認する →
            </a>
          </div>
        )}
        {result && !result.ok && (
          <p className="text-sm text-red-500">⚠️ {result.error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !canSubmit}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'AI処理中...' : '📩 登録してAI処理を実行'}
        </button>
      </div>
    </div>
  )
}
