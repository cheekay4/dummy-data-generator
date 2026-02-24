import { NextRequest } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return Response.json(
      { error: 'emailパラメータが必要です' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const stripe = getStripe();

    // メールアドレスで顧客を検索
    const customers = await stripe.customers.search({
      query: `email:'${email}'`,
      limit: 1,
    });

    const customer = customers.data[0];
    if (!customer) {
      return Response.json(
        { error: 'このメールアドレスのProプランが見つかりません' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // アクティブなサブスクリプションを確認
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subs.data.length === 0) {
      return Response.json(
        { error: 'アクティブなProプランが見つかりません' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const licenseKey = (customer as Stripe.Customer).metadata?.license_key;
    if (!licenseKey) {
      return Response.json(
        { error: 'ライセンスキーがまだ発行されていません。しばらくお待ちください' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return Response.json({ licenseKey }, { headers: CORS_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'エラーが発生しました';
    return Response.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
