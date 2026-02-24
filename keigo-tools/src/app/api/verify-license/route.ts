import { getStripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

// TODO: 将来は chrome-extension://EXTENSION_ID に絞る
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { licenseKey } = body as { licenseKey: string };

    if (!licenseKey || typeof licenseKey !== 'string') {
      return Response.json(
        { valid: false },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const stripe = getStripe();

    // Stripeでlicense_keyメタデータが一致する顧客を検索
    const customers = await stripe.customers.search({
      query: `metadata['license_key']:'${licenseKey}'`,
      limit: 1,
    });

    const customer = customers.data[0];
    if (!customer) {
      return Response.json({ valid: false }, { headers: CORS_HEADERS });
    }

    // アクティブなサブスクリプションを確認
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subs.data.length === 0) {
      return Response.json({ valid: false }, { headers: CORS_HEADERS });
    }

    const email = (customer as Stripe.Customer).email ?? undefined;
    return Response.json({ valid: true, email }, { headers: CORS_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'エラーが発生しました';
    return Response.json(
      { valid: false, error: message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
