'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthModal from '@/components/auth/AuthModal'

const PLANS = [
  {
    name: 'お試し',
    price: '¥0',
    priceNote: 'ログイン不要',
    badge: '',
    features: [
      'AI返信 1回',
      '基本返信のみ',
      'プロファイルなし',
    ],
    cta: '今すぐ試す',
    ctaType: 'link' as const,
    ctaHref: '/generator',
    highlight: false,
  },
  {
    name: 'Free',
    price: '¥0',
    priceNote: 'ログインで無料',
    badge: 'おすすめ',
    features: [
      'AI返信 5回/日',
      '返信プロファイル 1名分',
      '客層分析',
      '手直しアドバイス（無制限）',
    ],
    cta: '無料で始める',
    ctaType: 'auth' as const,
    ctaHref: null,
    highlight: true,
  },
  {
    name: 'Pro',
    price: '¥390',
    priceNote: '/月（1日たった13円）',
    badge: '',
    features: [
      'AI返信 無制限',
      '返信プロファイル 5名分',
      'ペルソナテンプレート',
      '履歴保存 90日',
      '多言語返信（日英中韓）',
      '広告なし',
      '手直しアドバイス',
    ],
    cta: 'Proを始める',
    ctaType: 'checkout' as const,
    ctaHref: null,
    highlight: false,
  },
] as const

export default function PricingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function handleCheckout() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (res.status === 401) {
        // 未ログイン → 認証モーダルを表示
        setShowAuth(true)
      } else if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'チェックアウトの開始に失敗しました。')
      }
    } catch {
      alert('ネットワークエラーが発生しました。')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600">← ホームに戻る</Link>
          <h1 className="text-3xl font-bold text-stone-800 mt-4 mb-2">シンプルな料金プラン</h1>
          <p className="text-stone-500">まずは無料から。必要なときにProへ。</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col ${
                plan.highlight ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-stone-200'
              }`}
            >
              {plan.badge && (
                <div className="text-center mb-4">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ★ {plan.badge}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-bold text-stone-800 mb-1">{plan.name}</h2>
              <div className="mb-1">
                <span className="text-3xl font-bold text-stone-800">{plan.price}</span>
                <span className="text-sm text-stone-400 ml-1">{plan.priceNote}</span>
              </div>

              <div className="my-4 border-t border-stone-100" />

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.ctaType === 'auth' ? (
                <button
                  onClick={() => setShowAuth(true)}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                      : 'border border-stone-300 hover:border-amber-300 text-stone-600 hover:text-amber-600'
                  }`}
                >
                  {plan.cta}
                </button>
              ) : plan.ctaType === 'checkout' ? (
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-colors bg-stone-800 hover:bg-stone-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? '処理中...' : plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.ctaHref ?? '/'}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-colors text-center block border border-stone-300 hover:border-amber-300 text-stone-600 hover:text-amber-600"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-5 text-center">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: 'いつでも解約できますか？', a: 'はい、Stripeのカスタマーポータルからいつでも解約できます。解約後も月末まで利用可能です。' },
              { q: 'クレジットカード以外で支払えますか？', a: 'Stripeが対応している各種カード（VISA/Mastercard/JCB/AMEX）でお支払いいただけます。' },
              { q: 'Proをキャンセルするとデータは消えますか？', a: 'プロファイルのデータは削除されずに残ります。ただしFreeプランではプロファイルの新規作成が1件までに制限されます。履歴データも削除はされませんが、Freeプランでは閲覧できなくなります（再度Proに戻ると閲覧可能です）。' },
            ].map((item) => (
              <div key={item.q} className="bg-white border border-stone-200 rounded-xl p-4">
                <p className="font-medium text-stone-800 mb-1 text-sm">Q: {item.q}</p>
                <p className="text-sm text-stone-500">A: {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
