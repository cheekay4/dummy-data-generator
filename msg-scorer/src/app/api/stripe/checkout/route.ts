import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/profiles';

const TEAM_PRICE_MAP: Record<string, string> = {
  team_s: PRICE_IDS.teamS,
  team_m: PRICE_IDS.teamM,
  team_l: PRICE_IDS.teamL,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });
  }

  const { priceId, interval, teamPlan } = await req.json() as {
    priceId?: string;
    interval?: 'month' | 'year';
    teamPlan?: 'team_s' | 'team_m' | 'team_l';
  };

  const isTeamPlan = !!teamPlan;

  let resolvedPriceId: string;
  if (isTeamPlan) {
    resolvedPriceId = TEAM_PRICE_MAP[teamPlan!] ?? '';
  } else {
    resolvedPriceId = priceId ?? (interval === 'year' ? PRICE_IDS.proYearly : PRICE_IDS.proMonthly);
  }

  if (!resolvedPriceId) {
    return NextResponse.json({ error: '料金プランが設定されていません。' }, { status: 400 });
  }

  const profile = await getProfile(user.id);
  const origin = req.headers.get('origin') ?? 'https://msgscore.jp';

  const successUrl = isTeamPlan
    ? `${origin}/team/setup?session_id={CHECKOUT_SESSION_ID}`
    : `${origin}/settings?upgraded=1`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: resolvedPriceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: isTeamPlan ? undefined : 7,
      metadata: {
        userId: user.id,
        ...(isTeamPlan ? { plan_type: 'team', team_plan: teamPlan! } : {}),
      },
    },
    metadata: {
      userId: user.id,
      ...(isTeamPlan ? { plan_type: 'team', team_plan: teamPlan! } : {}),
    },
    success_url: successUrl,
    cancel_url:  `${origin}/pricing`,
    locale: 'ja',
  });

  return NextResponse.json({ url: session.url });
}
