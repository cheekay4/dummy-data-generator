import { NextRequest } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import Stripe from 'stripe';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  const stripe = getStripe();

  switch (event.type) {
    case 'customer.subscription.created': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      try {
        // ライセンスキーを生成
        const licenseKey = crypto.randomUUID();

        // Stripeの顧客メタデータにライセンスキーを保存
        await stripe.customers.update(customerId, {
          metadata: { license_key: licenseKey },
        });

        // メールアドレスを取得
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const email = customer.email;

        // Resendでライセンスキーをメール送信
        if (email && process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'noreply@keigo-tools.vercel.app',
            to: email,
            subject: '【敬語メールライター Pro】ライセンスキーのお知らせ',
            text: [
              'この度は敬語メールライター Proプランへのご登録ありがとうございます。',
              '',
              'Chrome拡張でProプランをご利用いただくためのライセンスキーをお送りします。',
              '',
              `ライセンスキー: ${licenseKey}`,
              '',
              '【設定方法】',
              '1. Chrome拡張をインストール',
              '2. 拡張のポップアップ右上の歯車アイコンをクリック',
              '3. ライセンスキーを入力して「保存して確認」をクリック',
              '',
              'ライセンスキーを紛失した場合は以下のページから再確認できます:',
              'https://keigo-tools.vercel.app/account',
              '',
              'ご不明な点がございましたらお問い合わせください。',
            ].join('\n'),
          });
        }

        console.log('[webhook] customer.subscription.created: license_key generated', {
          customerId,
          email,
        });
      } catch (err) {
        console.error('[webhook] customer.subscription.created error:', err);
        // ライセンス発行失敗でもwebhookは200を返す（Stripeのリトライを防ぐ）
      }
      break;
    }

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
