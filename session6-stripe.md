# Session 6: masking-tools Stripe連携

## 前提
- リポジトリ: masking-tools/
- 既にUIとpricingページが実装済み
- Stripe本番アカウント開設済み
- Free / Pro 190円/月のプラン設計済み

## 今回のスコープ
Stripeの月額課金を実装し、Pro機能をアンロックできるようにする。
Supabaseは今回使わない — 認証はStripeのCheckoutセッション + Webhookで管理。
（ユーザーDBが必要な場合はlocalStorageベースの簡易実装で割り切る）

## 実装する機能

### 1. Stripe商品・価格の作成（手動 or API）
Stripeダッシュボードで以下を作成（既に作成済みならスキップ）：
- 商品名: 「個人情報マスキング Pro」
- 価格: ¥190/月（JPY, recurring, monthly）
- price_idをメモして環境変数に設定

### 2. 環境変数
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_PRICE_ID_MASKING_PRO=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_BASE_URL=https://masking-tools.vercel.app（仮）
```

### 3. Stripe Checkout（課金ページへの遷移）
#### src/app/api/checkout/route.ts
- POST リクエストを受けてStripe Checkout Sessionを作成
- mode: 'subscription'
- line_items: [{ price: STRIPE_PRICE_ID_MASKING_PRO, quantity: 1 }]
- success_url: /success?session_id={CHECKOUT_SESSION_ID}
- cancel_url: /pricing

### 4. 成功ページ
#### src/app/success/page.tsx
- session_idからStripe Sessionを取得
- subscription_idとcustomer_idをlocalStorageに保存
- 「Pro登録が完了しました！」表示
- 「ツールに戻る」ボタン

### 5. Stripe Webhook
#### src/app/api/webhook/route.ts
- Stripe署名検証
- 処理するイベント:
  - checkout.session.completed → ログ記録
  - customer.subscription.deleted → ログ記録
  - invoice.payment_failed → ログ記録
- 今回はWebhookはログ記録のみでOK（本格的な利用制限はPhase 3で）

### 6. Pro状態の判定（簡易版）
#### src/lib/subscription.ts
```typescript
// 簡易版: localStorageベース
// 本番ではSupabase + Webhook連携に置き換える
export function isProUser(): boolean {
  if (typeof window === 'undefined') return false;
  const subId = localStorage.getItem('masking_subscription_id');
  return !!subId;
}
```

### 7. 既存UIへの組み込み
- pricingページの「Proプランに申し込む」ボタン → /api/checkout を呼ぶ
- マスキングツール本体:
  - 未課金: 10回/日制限（localStorageでカウント）
  - 課金済み: 無制限
  - 制限到達時: 「本日の無料枠を使い切りました。Pro（月額190円）で無制限に → [申し込む]」

### 8. Stripeカスタマーポータル
#### src/app/api/portal/route.ts
- 課金済みユーザーがサブスクリプションを管理（解約・カード変更）できるポータルへのリンク生成
- UIに「サブスクリプション管理」リンクを追加

## 技術要件
- stripe パッケージをインストール: `npm install stripe`
- @stripe/stripe-js: `npm install @stripe/stripe-js`（クライアント側リダイレクト用）
- Webhook の raw body 処理に注意（Next.js App Router の場合）
- 特商法ページ（/tokushoho）がなければ作成（Stripe日本円決済に必要）

## 完了条件
- [ ] 「Proに申し込む」→ Stripe Checkout画面に遷移する
- [ ] テストカード（4242424242424242）で決済が完了する
- [ ] 成功ページが表示される
- [ ] 課金後にツールが無制限で使える
- [ ] 未課金時に10回/日の制限が機能する
- [ ] 制限到達時にアップグレード導線が表示される
- [ ] カスタマーポータルで解約できる
- [ ] npm run build が通る

## 注意
- 今日はStripeテストモードで動作確認まで。本番切り替えはデプロイ後に行う
- Supabase連携は今回スキップ。localStorage簡易版で十分
- Webhookのエンドポイントはデプロイ後にStripeダッシュボードで登録
