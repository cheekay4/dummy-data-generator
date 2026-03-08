# hikitsugi-ai Phase 1-C — 手動セットアップチェックリスト

> Phase 1-C のコードはデプロイ済み（https://hikitsugi-ai.vercel.app）。
> 以下の手動設定が完了するまで認証・課金は動作しない。

---

## 1. Supabase プロジェクト作成

1. https://supabase.com/dashboard → 新規プロジェクト作成
2. **Settings → API** から以下を取得してメモ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Supabase スキーマ適用

SQL Editor で `hikitsugi-ai/supabase-schema.sql` の全内容を実行。

作成されるテーブル:
- `profiles` — ユーザー情報・プラン
- `manuals` — マニュアル本体・会話履歴
- `subscriptions` — Stripe サブスクリプション

---

## 3. Supabase Auth 設定

### Google OAuth
1. **Authentication → Providers → Google** を有効化
2. Google Cloud Console で OAuth クライアントID・シークレットを取得して貼り付け
3. 承認済みリダイレクト URI に追加:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```

### リダイレクト URL
**Authentication → URL Configuration**:
- Site URL: `https://hikitsugi-ai.vercel.app`
- Redirect URLs に追加:
  ```
  https://hikitsugi-ai.vercel.app/auth/callback
  http://localhost:3000/auth/callback
  ```

---

## 4. Stripe セットアップ

1. https://stripe.com/jp でアカウント作成（日本語対応）
2. **テストモード**で以下を作成:

### 商品・価格の作成
| 商品名 | 金額 | 周期 | 環境変数 |
|--------|------|------|---------|
| 引き継ぎAI Pro | ¥1,980 | 月次 | `STRIPE_PRICE_PRO_MONTHLY` |
| 引き継ぎAI Team | ¥4,980 | 月次 | `STRIPE_PRICE_TEAM_MONTHLY` |

各 Price ID（`price_...`）をメモ。

### Webhook エンドポイント
**Developers → Webhooks → Add endpoint**:
- URL: `https://hikitsugi-ai.vercel.app/api/stripe/webhook`
- リッスンするイベント:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- 作成後に **Signing secret** (`whsec_...`) をメモ → `STRIPE_WEBHOOK_SECRET`

### Customer Portal 有効化
**Settings → Billing → Customer portal** で有効化してカスタマイズ。

---

## 5. Vercel 環境変数の設定

https://vercel.com/cheekays-projects/hikitsugi-ai/settings/environment-variables

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `STRIPE_SECRET_KEY` | `sk_test_...`（テスト）|
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_...`（Pro） |
| `STRIPE_PRICE_TEAM_MONTHLY` | `price_...`（Team） |
| `NEXT_PUBLIC_APP_URL` | `https://hikitsugi-ai.vercel.app` |

設定後、**Vercel でリデプロイ**（Settings → Deployments → Redeploy）。

---

## 6. 動作確認チェックリスト

- [ ] LP → 「無料でマニュアルを作成する」クリック → AuthModal が開く
- [ ] Googleログイン → `/dashboard` にリダイレクト
- [ ] マジックリンク → メール届く → リンクで `/dashboard` に遷移
- [ ] 「新規作成」→ 汎用テンプレート選択 → インタビュー開始
- [ ] 飲食店テンプレートが🔒 Pro ロックになっている
- [ ] 10ターン後に上限ウォーニングが出る
- [ ] マニュアル生成 → DB に保存される → ダッシュボードに表示
- [ ] 共有リンクを生成 → `/share/[token]` でログアウト状態でも閲覧できる
- [ ] Settings → 「Proプランにアップグレード」→ Stripe Checkout に遷移
- [ ] テスト決済完了 → `profiles.plan` が `pro` になる
- [ ] PDF出力ボタン（Pro）→ 印刷ダイアログが開く
- [ ] マニュアル3件作成 → 4件目で上限エラーになる

---

## 7. 残タスク（Phase 1-D 以降）

- [ ] Phase 1-D: 音声チャット（Web Speech API）
- [ ] Phase 1-D: ブラウザ録音（MediaRecorder）
- [ ] Phase 1-D: 録音アップロード + Whisper 文字起こし
- [ ] カスタムドメイン取得（hikitsugi.ai 等）
- [ ] GA4 設定（`NEXT_PUBLIC_GA_ID` を Vercel に設定）
- [ ] Google Search Console 登録・sitemap 送信
- [ ] Stripe 本番モード切り替え（審査提出後）

---

*作成: 2026-03-08 / Phase 1-C 実装完了時*
