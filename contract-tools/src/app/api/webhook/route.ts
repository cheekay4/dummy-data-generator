import { NextRequest } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing stripe-signature header', { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('[webhook] checkout.session.completed', event.data.object);
      break;
    case 'customer.subscription.deleted':
      console.log('[webhook] customer.subscription.deleted', event.data.object);
      break;
    case 'invoice.payment_failed':
      console.log('[webhook] invoice.payment_failed', event.data.object);
      break;
    default:
      console.log(`[webhook] unhandled event: ${event.type}`);
  }

  return new Response('ok', { status: 200 });
}
