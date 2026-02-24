# MsgScore — Phase 2: 認証・課金・Pro機能フル実装
## Claude Code 開発プロンプト

---

## 前提
Phase 1（A/B/C）で構築済みのプロジェクトに追加実装する。
デザインディレクション（Editorial Dashboard）は維持。
Phase 1のコードベース・コンポーネント構成・デザインシステムをそのまま活かすこと。

---

## Phase 2 のゴール
「課金可能なPro」を作る。Free/Pro の2プランが動作し、Proユーザーが満足する個人ワークフロー機能を全て実装する。

---

## 1. Supabase セットアップ

### 1.1 Supabase プロジェクト接続

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

`.env.local` に追加:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
```

### 1.2 認証方式

Supabase Auth を使用。プロバイダー:
- **Google OAuth**（メイン）
- **メールマジックリンク**（サブ）

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// ... サーバーサイド用クライアント
```

### 1.3 認証UI

- ヘッダーの「ログイン」ボタンからモーダル or /login ページ
- Google OAuth ボタン + メールアドレス入力（マジックリンク）
- ログイン後はヘッダーにアバター + ドロップダウン（マイページ / プラン / ログアウト）
- デザイン: Phase 1のEditorial Dashboardテイストを維持

### 1.4 認証コールバック

```
src/app/auth/callback/route.ts  — OAuth コールバック処理
```

---

## 2. DB設計（Supabase）

### 2.1 テーブル

```sql
-- ユーザープロフィール
create table profiles (
  id uuid references auth.users primary key,
  email text,
  name text,
  plan text not null default 'free',  -- 'free' / 'pro'
  stripe_customer_id text,
  stripe_subscription_id text,
  custom_ng_words text[] default '{}',  -- Pro: 最大10語
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- スコア履歴（個人 + 将来のチーム共用）
create table score_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  team_id uuid,  -- Phase 2.5で使用。今はNULL
  channel text not null,  -- 'email-subject' / 'email-body' / 'line'
  input_text text not null,
  subject text,  -- メール本文時の件名
  audience jsonb not null,  -- AudienceSegment全体（conversionGoal含む）
  result jsonb not null,  -- ScoreResponse全体
  share_token text unique,  -- URLシェア用トークン
  -- 配信後の実績入力（Pro機能）
  actual_open_rate decimal,
  actual_ctr decimal,
  actual_cv_count int,
  actual_cv_type text,
  actual_input_at timestamp,
  created_at timestamp default now()
);

-- カスタムセグメント保存（Pro: 10個まで）
create table custom_segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  team_id uuid,  -- Phase 2.5で使用
  name text not null,
  segment jsonb not null,  -- AudienceSegment（conversionGoal含む）
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 日次利用カウント（レート制限のDB化）
create table daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,  -- NULLなら未ログインユーザー
  ip_address text,  -- 未ログイン時のIP
  date date not null default current_date,
  count int not null default 0,
  unique(user_id, date),
  unique(ip_address, date)
);

-- インデックス
create index idx_score_history_user on score_history(user_id, created_at desc);
create index idx_score_history_share on score_history(share_token) where share_token is not null;
create index idx_custom_segments_user on custom_segments(user_id);
create index idx_daily_usage_user on daily_usage(user_id, date);
create index idx_daily_usage_ip on daily_usage(ip_address, date);
```

### 2.2 RLSポリシー

```sql
-- profiles: 本人のみ読み書き
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- score_history: 本人のみ（+ share_tokenでの公開閲覧は別途API）
alter table score_history enable row level security;
create policy "Users can view own scores" on score_history for select using (auth.uid() = user_id);
create policy "Users can insert own scores" on score_history for insert with check (auth.uid() = user_id);
create policy "Users can update own scores" on score_history for update using (auth.uid() = user_id);

-- custom_segments: 本人のみ
alter table custom_segments enable row level security;
create policy "Users can manage own segments" on custom_segments for all using (auth.uid() = user_id);

-- daily_usage: サーバーサイドのみ（service_role経由）
alter table daily_usage enable row level security;
```

### 2.3 トリガー: 新規ユーザー作成時にprofile自動作成

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## 3. Stripe 決済

### 3.1 セットアップ

```bash
npm install stripe
```

`.env.local` に追加:
```
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxx
```

### 3.2 Stripe商品（Phase 2時点）

```
Stripe Products:
1. MsgScore Pro: ¥980/月, ¥9,800/年
```

### 3.3 API Routes

```
src/app/api/stripe/checkout/route.ts    — Checkout Session作成
src/app/api/stripe/webhook/route.ts     — Webhook受信
src/app/api/stripe/portal/route.ts      — Customer Portal（プラン管理・解約）
```

**Checkout フロー:**
1. ユーザーが料金ページで「Proプランを申し込む」クリック
2. POST /api/stripe/checkout → Stripe Checkout Session作成
3. Stripeの決済画面にリダイレクト
4. 決済成功 → /api/stripe/webhook がイベント受信
5. profiles.plan を 'pro' に更新、stripe_customer_id と stripe_subscription_id を保存

**Webhook処理:**
- `checkout.session.completed`: プラン更新
- `customer.subscription.updated`: プラン変更反映
- `customer.subscription.deleted`: plan を 'free' に戻す
- `invoice.payment_failed`: 通知（将来）

**Customer Portal:**
- プラン変更・解約はStripe Customer Portalに委任
- アカウント設定ページにリンク配置

### 3.4 プラン判定

```typescript
// src/lib/plan.ts
export type Plan = 'free' | 'pro';

export function getPlanLimits(plan: Plan) {
  return {
    free: {
      dailyScoreLimit: 5,
      historyRetention: 3,      // 直近3回のみ
      customSegments: 0,
      customNgWords: 0,
      csvExport: false,
      preview: false,
      scoreTrend: false,
      actualInput: false,
    },
    pro: {
      dailyScoreLimit: Infinity,
      historyRetention: 90,     // 90日
      customSegments: 10,
      customNgWords: 10,
      csvExport: true,
      preview: true,
      scoreTrend: true,
      actualInput: true,
    },
  }[plan];
}
```

---

## 4. レート制限のDB化

Phase 1のメモリベースをSupabase daily_usageテーブルに移行。

```typescript
// src/lib/rate-limit.ts
export async function checkAndIncrementUsage(
  userId: string | null,
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  // ログイン済み: user_id で検索
  // 未ログイン: ip_address で検索
  // Proユーザー: 常にallowed=true
  // Freeユーザー: 5回/日
}
```

API Route `/api/score` を更新してDB版レート制限に差し替え。

---

## 5. スコア履歴機能

### 5.1 履歴保存

スコアリング実行時に score_history テーブルに自動保存（ログイン済みユーザーのみ）。
未ログインユーザーはlocalStorageに直近3回分を保持（既存の動作を維持）。

### 5.2 履歴一覧ページ

```
src/app/history/page.tsx  — 履歴一覧
```

- テーブル形式: 日時 / チャネル / 入力テキスト冒頭30文字 / 総合スコア / 配信目的
- ソート: 新しい順（デフォルト）、スコア順
- フィルタ: チャネル、期間
- Freeユーザー: 直近3回のみ表示 + 「Proにアップグレードで90日分の履歴」バナー
- Proユーザー: 90日分表示
- クリックで詳細表示（結果画面と同じレイアウト）
- デザイン: Editorial Dashboard テイスト。テーブルは bg-white rounded-2xl

### 5.3 スコア結果URLシェア（全プラン）

スコアリング結果にshare_tokenを発行し、URLで共有可能にする。

```
src/app/share/[token]/page.tsx  — 共有結果ページ（認証不要で閲覧可能）
```

- スコアリング実行時に crypto.randomUUID() でtoken生成
- 結果画面に「🔗 結果をシェア」ボタン → URLコピー
- 共有ページはログイン不要で閲覧可能（SEO noindex）
- デザインは結果画面と同じだが、入力フォームなし

---

## 6. 実画面プレビュー機能（Pro以上）

結果画面に「📱 プレビュー」タブを追加。

### 6.1 メール件名プレビュー

**EmailSubjectPreview.tsx**

モバイル（iPhone受信トレイ風）:
- iPhoneフレーム風のコンテナ
- 前後にダミーメール2件ずつ表示
- 対象メールはハイライト表示
- 件名が途切れる場合は「⚠️ モバイルで件名が切れます（表示: 20文字）」警告

デスクトップ（Gmail風）:
- Gmail受信トレイの1行表示を模したUI
- 差出人 + 件名 + プレビューテキスト

### 6.2 LINE配信プレビュー

**LinePreview.tsx**

トーク画面:
- LINEのトークUI風（緑の吹き出し）
- 吹き出し内にテキスト
- 文字数カウント表示

トーク一覧:
- LINE一覧画面風
- ブランド名 + 冒頭40文字

### 6.3 プレビュー共通

- Freeユーザーがプレビュータブをクリック → ぼかし表示 + 「Proにアップグレードでプレビュー機能を利用」オーバーレイ
- タブ切替: 「📊 スコア」「📱 プレビュー」をresult画面上部に

---

## 7. NGワード機能

### 7.1 共通警告ワード（5語、全プラン）

スコアリングエンジンに組み込み。以下の5語が入力テキストに含まれていた場合、配信適正スコアを減点:
- 最安値
- 業界No.1
- 絶対
- 確実
- 保証

※ 景表法リスクのある表現。Freeユーザーでも検出・警告表示。

結果画面に警告表示:
```
⚠️ NGワード検出:「最安値」「絶対」
景品表示法に抵触する可能性のある表現が含まれています。
```

### 7.2 カスタムNGワード（Pro: 10語まで）

```
src/app/settings/page.tsx  — 設定ページ
```

設定ページ内の「NGワード設定」セクション:
- テキスト入力 + 「追加」ボタン
- 登録済みワード一覧（削除ボタン付き）
- 上限10語。上限到達時は「上限に達しました」表示
- profiles.custom_ng_words に保存

スコアリング時にカスタムNGワードもチェック:
- Claude APIのシステムプロンプトに注入:
```
## カスタムNGワード（ユーザー設定）
以下の単語が含まれる場合、配信適正スコアを減点してフィードバックに記載:
{custom_ng_words.join(', ')}
```

Freeユーザーの設定ページ: 「ProにアップグレードでカスタムNGワードを設定」表示

---

## 8. カスタムセグメント保存（Pro: 10個）

AudiencePanelに「💾 セグメントを保存」ボタンを追加。

- 現在のセグメント設定（性別・年代・母数・目的・属性）をまるごと保存
- 名前を入力して保存
- 保存済みセグメントはプリセット一覧の下に「マイセグメント」セクションとして表示
- 上限10個。超過時は古いものの削除を促す
- custom_segments テーブルに保存
- Freeユーザー: 保存ボタン非表示 or 「Proにアップグレード」ツールチップ

---

## 9. スコア推移グラフ（Pro）

```
src/components/history/ScoreTrendChart.tsx
```

- 履歴ページの上部にrechartsの折れ線グラフ
- X軸: 日付、Y軸: 総合スコア（0-100）
- チャネルごとに色分け（メール件名: indigo、メール本文: emerald、LINE: amber）
- ツールチップ: 日付 + スコア + チャネル + 入力テキスト冒頭
- 期間選択: 直近7日 / 30日 / 90日
- Freeユーザー: ぼかし表示 + アップグレード誘導

---

## 10. 配信後の実績入力・答え合わせ（Pro）

履歴詳細画面に「📊 実績入力」セクションを追加。

### 入力項目

| 項目 | 入力方式 |
|------|---------|
| 実際の開封率 | 数値入力 (%) |
| 実際のCTR | 数値入力 (%) |
| 実際のCV数 | 数値入力 (件) |
| CV種別 | 選択: 購入/クリック/申込/来店/問い合わせ |

### 答え合わせ表示

入力後に「予測 vs 実績」を並べて表示:
```
          予測        実績        差分
開封率    23.4%       25.1%       +1.7pt ✅
CTR       4.7%        4.2%        -0.5pt ⚠️
購入数    9件         11件        +2件 ✅
```

- score_history の actual_* カラムに保存
- Freeユーザー: 「Proにアップグレードで実績入力」表示

---

## 11. CSVエクスポート（Pro）

履歴ページに「📥 CSVエクスポート」ボタン。

**出力カラム:**
- 日時
- チャネル
- 配信目的
- 入力テキスト
- 総合スコア
- 5軸スコア（開封誘引力, 読了性, CTA強度, ターゲット適合度, 配信適正）
- 予測開封率 / CTR / CV数
- 実績開封率 / CTR / CV数（入力済みの場合）
- 改善提案

クライアントサイドで生成（Blob + download）。Shift-JIS対応（日本語Excelで文字化けしないよう BOM付きUTF-8）。

Freeユーザー: ボタン非活性 + 「Proにアップグレード」ツールチップ

---

## 12. 料金ページ更新

Phase 1-Cで作成したPricingSectionを実際の課金導線に接続:
- 「無料で始める」→ /login（未ログイン時）or そのまま利用
- 「Proプランを申し込む」→ /login（未ログイン時）→ Stripe Checkout
- ログイン済みFreeユーザー: 「Proにアップグレード」→ Stripe Checkout
- ログイン済みProユーザー: 「現在のプラン ✓」表示 + 「プラン管理」→ Stripe Portal

---

## 13. ナビゲーション更新

### ヘッダー（ログイン状態別）

未ログイン:
```
◆ MsgScore    スコアリング  料金    [ログイン]
```

Free:
```
◆ MsgScore    スコアリング  履歴  料金    [アバター ▼]
                                          ├ 設定
                                          ├ プラン管理
                                          └ ログアウト
```

Pro:
```
◆ MsgScore    スコアリング  履歴  料金    [Pro] [アバター ▼]
                                                ├ 設定
                                                ├ プラン管理
                                                └ ログアウト
```

[Pro] バッジ: bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium

---

## 14. Pro機能ゲーティング

全てのPro機能にゲーティングを実装。パターンは2つ:

**パターンA: ぼかし + オーバーレイ**（プレビュー、スコア推移）
- コンテンツをぼかし表示（filter: blur(8px)）
- 中央にオーバーレイ:
  ```
  🔒 Proプランで利用可能
  [Proにアップグレード — ¥980/月]
  ```

**パターンB: 非活性 + ツールチップ**（CSVエクスポート、セグメント保存）
- ボタンをdisabled
- ホバーでツールチップ「Proプランにアップグレードで利用可能」

---

## 15. 設定ページ

```
src/app/settings/page.tsx
```

- プロフィール情報（名前、メール — 読み取り専用）
- プラン情報（現在のプラン + Stripe Portalリンク）
- NGワード設定（Pro: カスタム10語）
- アカウント削除（将来）

---

## 16. 新規ページ・ルート一覧

```
src/app/
  login/page.tsx               — ログイン画面
  auth/callback/route.ts       — OAuth コールバック
  history/page.tsx             — 履歴一覧
  settings/page.tsx            — 設定
  share/[token]/page.tsx       — 共有結果
  pricing/page.tsx             — 料金ページ（単独）
  api/
    score/route.ts             — スコアリングAPI（更新: DB版レート制限 + 履歴保存）
    stripe/
      checkout/route.ts        — Stripe Checkout Session
      webhook/route.ts         — Stripe Webhook
      portal/route.ts          — Stripe Customer Portal
    segments/route.ts          — カスタムセグメントCRUD
    history/route.ts           — 履歴取得（ページネーション）
    history/[id]/actual/route.ts — 実績入力
    history/export/route.ts    — CSVエクスポート
```

---

## 17. 技術的な注意事項

- Supabase Auth のセッション管理は middleware.ts で実装
- Stripe Webhookのbody検証は raw body で行う（Next.js App Routerの場合 `export const config = { api: { bodyParser: false } }` は不要、代わりに `request.text()` を使う）
- 全てのAPI Routeでユーザー認証チェック（認証必須のもの）
- Supabaseクライアントはサーバーコンポーネント用とクライアントコンポーネント用を分ける
- 環境変数が未設定の場合はgraceful degradation（Stripe未設定ならPro課金ボタンを非表示にする等）
- TypeScript strict、any禁止は維持
- デザインはPhase 1のEditorial Dashboardテイストを維持。新規ページも同じカラーパレット・タイポグラフィ・角丸・余白ルールに従う

---

## 18. 最終チェックリスト

- [ ] ログイン/ログアウトが正常に動作
- [ ] Google OAuth でログイン可能
- [ ] ログイン後にprofileが自動作成される
- [ ] Stripe Checkout でPro課金が完了する
- [ ] Webhook でプランが 'pro' に更新される
- [ ] Stripe Customer Portal でプラン管理・解約ができる
- [ ] 解約後にプランが 'free' に戻る
- [ ] Freeユーザー: 5回/日のレート制限（DB版）
- [ ] Proユーザー: 無制限
- [ ] スコアリング結果がscore_historyに保存される
- [ ] 履歴一覧: Freeは直近3回、Proは90日
- [ ] 履歴詳細: 結果画面と同じレイアウト
- [ ] URLシェア: share_tokenでログイン不要で閲覧可能
- [ ] 実画面プレビュー: メール件名（iPhone/Gmail風）、LINE（トーク画面風）
- [ ] NGワード共通5語: スコアリング結果に警告表示
- [ ] NGワードカスタム: Pro設定ページで10語まで追加
- [ ] カスタムセグメント: Proで10個まで保存・呼び出し
- [ ] スコア推移グラフ: Proで折れ線グラフ表示
- [ ] 配信実績入力: Proで予測vs実績の答え合わせ
- [ ] CSVエクスポート: ProでBOM付きUTF-8出力
- [ ] Pro機能ゲーティング: 全箇所でFreeユーザーにアップグレード誘導
- [ ] 料金ページ: 課金導線が正常に動作
- [ ] レスポンシブ: 全新規ページでモバイル対応
