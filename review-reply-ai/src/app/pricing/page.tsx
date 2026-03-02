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

        {/* 信頼性・セキュリティセクション */}
        <div className="mt-16 pt-12 border-t border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-6 text-center">安心してご利用いただくために</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">SECURITY ACTION 宣言</h3>
              <p className="text-xs text-stone-500">IPA（情報処理推進機構）の制度に基づき、情報セキュリティ対策に取り組むことを宣言しています。</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-emerald-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">セキュリティヘッダー A+</h3>
              <p className="text-xs text-stone-500">CSP・HSTS・Permissions-Policy など、業界推奨のセキュリティヘッダーを全ページに設定済み。</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-amber-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">データ透明性ポリシー</h3>
              <p className="text-xs text-stone-500">何のデータを送り、何を保存しないか。<a href="/privacy" className="text-amber-600 hover:text-amber-700 underline">プライバシーポリシー</a>で具体的に公開しています。</p>
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
