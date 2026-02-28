import { Check } from 'lucide-react'

export default function PricingSection() {
  const plans = [
    {
      name: 'お試し',
      price: '0',
      sub: 'ログイン不要',
      badge: null,
      features: ['AI返信3回/日', '基本返信のみ', '客層分析なし'],
      cta: '今すぐ試す',
      ctaHref: '/generator',
      variant: 'outline' as const,
    },
    {
      name: 'Free',
      price: '0',
      sub: 'ログインで無料',
      badge: '★ おすすめ',
      features: [
        'AI返信5回/日',
        'プロファイル1名分',
        '客層分析',
        '手直しアドバイス（無制限）',
      ],
      cta: '無料で始める',
      ctaHref: '/generator',
      variant: 'primary' as const,
    },
    {
      name: 'Pro',
      price: '390',
      sub: '1日たった13円',
      badge: null,
      features: [
        'AI返信 無制限',
        'プロファイル5名分',
        '補助スタイル5種',
        '返信の重複回避',
        '履歴保存90日',
        '多言語返信',
        '広告なし',
        '手直しアドバイス',
      ],
      cta: 'Proを始める',
      ctaHref: '/pricing',
      variant: 'dark' as const,
    },
  ]

  return (
    <section id="pricing" className="py-16 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-3">
          シンプルな料金プラン
        </h2>
        <p className="text-stone-500 text-center mb-10 text-sm">いつでも解約可能 · クレジットカード不要で始められる</p>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 relative ${
                plan.variant === 'primary'
                  ? 'bg-white border-2 border-amber-400 shadow-md'
                  : plan.variant === 'dark'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <p className={`text-sm font-medium mb-2 ${plan.variant === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-3xl font-bold ${plan.variant === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                  ¥{plan.price}
                </span>
                {plan.price !== '0' && (
                  <span className={`text-sm ${plan.variant === 'dark' ? 'text-stone-400' : 'text-stone-400'}`}>/月</span>
                )}
              </div>
              <p className={`text-xs mb-6 ${plan.variant === 'dark' ? 'text-stone-400' : 'text-stone-400'}`}>
                {plan.sub}
              </p>

              <ul className="space-y-2 mb-7">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${
                      plan.variant === 'dark' ? 'text-stone-300' : 'text-stone-600'
                    }`}
                  >
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.variant === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`block text-center font-medium py-3 rounded-xl text-sm transition-colors ${
                  plan.variant === 'primary'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : plan.variant === 'dark'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'border border-stone-300 hover:border-amber-400 hover:text-amber-600 text-stone-600'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
