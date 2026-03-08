import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

const PLAN_FROM_PRICE: Record<string, 'pro' | 'team'> = {}

function getPlanFromPrice(priceId: string): 'pro' | 'team' | null {
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY) return 'team'
  return PLAN_FROM_PRICE[priceId] ?? null
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.supabase_user_id
      const subscriptionId = session.subscription as string

      if (!userId || !subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      const plan = getPlanFromPrice(priceId) ?? 'pro'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (subscription as any).current_period_end
      await supabase.from('profiles').update({ plan }).eq('id', userId)
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        status: subscription.status,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id

      if (!userId) {
        const { data } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
        if (!data) break

        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanFromPrice(priceId) ?? 'pro'
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'

        await supabase.from('profiles').update({ plan: isActive ? plan : 'free' }).eq('id', data.user_id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subPeriodEnd = (subscription as any).current_period_end
        await supabase.from('subscriptions').update({
          status: subscription.status,
          stripe_price_id: priceId,
          current_period_end: subPeriodEnd ? new Date(subPeriodEnd * 1000).toISOString() : null,
        }).eq('stripe_subscription_id', subscription.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      const { data } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()
      if (!data) break

      await supabase.from('profiles').update({ plan: 'free' }).eq('id', data.user_id)
      await supabase.from('subscriptions').update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
