import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe/config';
import { updateProfilePlan, getProfileByStripeCustomerId } from '@/lib/db/profiles';
import { createTeamFromWebhook } from '@/lib/db/teams';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

/** サブスクリプション失効時: 拡張トークンを自動失効させる */
async function revokeExtensionTokenOnCancel(profileId: string) {
  const db = createAdminClient();
  await db
    .from('profiles')
    .update({ extension_token_hash: null })
    .eq('id', profileId);
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planType = session.metadata?.plan_type;
      const teamPlan = session.metadata?.team_plan as 'team_s' | 'team_m' | 'team_l' | undefined;

      if (!userId) break;

      if (planType === 'team' && teamPlan) {
        // Teamプラン: チーム作成 + Ownerメンバー追加 + brand_voice初期化
        const customerEmail = session.customer_details?.email ?? '';
        try {
          await createTeamFromWebhook({
            userId,
            ownerEmail: customerEmail,
            teamPlan,
            stripeSubscriptionId: session.subscription as string,
          });
          await updateProfilePlan(
            userId,
            teamPlan,
            session.customer as string,
            session.subscription as string,
          );
        } catch (e) {
          console.error('Team creation failed:', e);
        }
      } else {
        // Proプラン
        if (session.customer) {
          await updateProfilePlan(
            userId,
            'pro',
            session.customer as string,
            session.subscription as string,
          );
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const profile = await getProfileByStripeCustomerId(sub.customer as string);
      if (profile) {
        const isActive = ['active', 'trialing'].includes(sub.status);
        if (!isActive) {
          await updateProfilePlan(profile.id, 'free');
          // 非アクティブ化: 拡張トークン自動失効
          await revokeExtensionTokenOnCancel(profile.id);
        } else {
          // Price ID からプランを逆引きして正しいプランに復元
          const priceId = sub.items.data[0]?.price.id ?? '';
          const priceToplan: Record<string, string> = {
            [PRICE_IDS.proMonthly]: 'pro',
            [PRICE_IDS.proYearly]:  'pro',
            [PRICE_IDS.teamS]:      'team_s',
            [PRICE_IDS.teamM]:      'team_m',
            [PRICE_IDS.teamL]:      'team_l',
          };
          const resolvedPlan = priceToplan[priceId];
          if (resolvedPlan && profile.plan !== resolvedPlan) {
            await updateProfilePlan(profile.id, resolvedPlan as 'pro' | 'team_s' | 'team_m' | 'team_l');
          }
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const profile = await getProfileByStripeCustomerId(sub.customer as string);
      if (profile) {
        await updateProfilePlan(profile.id, 'free');
        // 解約時: 拡張トークン自動失効
        await revokeExtensionTokenOnCancel(profile.id);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
