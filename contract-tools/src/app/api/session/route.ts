import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ customerId: session.customer, subscriptionId: session.subscription });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
