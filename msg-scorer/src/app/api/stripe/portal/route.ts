import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'Stripe顧客情報が見つかりません。' }, { status: 404 });
  }

  const origin = req.headers.get('origin') ?? 'https://msgscore.jp';

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
