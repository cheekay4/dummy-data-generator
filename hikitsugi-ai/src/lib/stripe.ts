import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
  }
  return _stripe
}

// 後方互換: 直接 stripe として使う場合
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PLANS = {
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    price: 1980,
  },
  team: {
    name: 'Team',
    priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? '',
    price: 4980,
  },
} as const

export type PlanKey = keyof typeof PLANS
