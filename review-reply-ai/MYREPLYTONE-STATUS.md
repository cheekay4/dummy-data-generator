# myreplytone.com — プロジェクト完全ログ

> このファイルは `review-reply-ai`（旧URL: review-reply-ai-nu.vercel.app → 新URL: myreplytone.com）の
> Single Source of Truth。このプロジェクトが中心プロダクトのため、詳細ログを別ファイルで管理する。

最終更新: 2026-03-01（sales-agent プロダクト分離 UAT完了）

---

## 1. プロジェクト基本情報

| 項目 | 内容 |
|------|------|
| **正式名称** | AI口コミ返信ジェネレーター |
| **ドメイン** | https://myreplytone.com |
| **旧Vercel URL** | https://review-reply-ai-nu.vercel.app |
| **ディレクトリ** | `review-reply-ai/` |
| **リポジトリ** | https://github.com/cheekay4/dummy-data-generator（モノレポ内） |
| **デプロイ** | Vercel（自動デプロイ: main ブランチ push → 即反映） |
| **ステータス** | ✅ LIVE |

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン/詳細 |
|---------|------|--------------|
| フレームワーク | Next.js | 16.1.6（App Router） |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | v4 |
| 状態管理 | Zustand | v5 |
| 認証・DB | Supabase | Auth（Google OAuth + Magic Link）+ PostgreSQL |
| 決済 | Stripe | テストモード（Webhook登録済み） |
| AI | Anthropic Claude API | claude-sonnet-4-6 |
| アイコン | lucide-react | v0.575.0 |
| アニメーション | framer-motion | v12 |
| フォント | Noto Sans JP + Noto Serif JP + DM Mono | Google Fonts |
| デプロイ | Vercel | 自動デプロイ |
| 環境変数管理 | `.env.local`（ローカル） + Vercel環境変数（本番） | |

---

## 3. 環境変数一覧

### ローカル（`.env.local`）
```
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SUPABASE_URL=https://kmfxxmrksadnzyqrznjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...（本番切替時は sk_live_...）
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_REVIEW_REPLY_PRO=price_1T5jkZ45kfJ8CuqfasfHsLup
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=（GA4 Measurement ID。空欄でも動作）
```

### Vercel 本番環境（要設定・要更新）
```
NEXT_PUBLIC_APP_URL=https://myreplytone.com  ← ★ドメイン変更に合わせて更新必須
```

---

## 4. Supabase 構成

- **プロジェクト URL**: `https://kmfxxmrksadnzyqrznjo.supabase.co`
- **認証プロバイダー**: Google OAuth ✅（Supabase Authentication > Providers で有効化済み）+ Magic Link ✅
- **Redirect URL**: Supabase Authentication > URL Configurationに `https://myreplytone.com/auth/callback` を追加要

### テーブル一覧

| テーブル | 用途 |
|---------|------|
| `profiles` | ユーザープロファイル（plan, email, created_at） |
| `reply_profiles` | 返信プロファイル（Big Five 4軸スコア + DISC分類） |
| `reply_modifiers` | 補助スタイル（ユーモア・丁寧すぎず等） |
| `generated_replies` | 生成済み返信の履歴 |
| `daily_usage` | 日次利用回数カウント（IPベース + user_id） |
| `customer_analyses` | 客層分析結果 |

---

## 5. 課金モデル

| プラン | 制限 | 月額 | ステータス |
|-------|------|------|-----------|
| 無料 | 1日3回（未ログイン IP制限）/ 1日5回（ログイン済み） | 0円 | ✅ 稼働中 |
| Pro | 無制限 + 補助スタイル + 履歴 | ¥390/月 | ⚠️ テストモード（近日公開表示中） |

- Stripe Product ID: `price_1T5jkZ45kfJ8CuqfasfHsLup`
- Webhook エンドポイント: `/api/stripe/webhook`
- **Stripe 本番切替は保留中**（全プロダクト共通タスク）

---

## 6. ページ一覧

| パス | 内容 | アクセス |
|-----|------|---------|
| `/` | LP（ランディングページ） | 全員 |
| `/generator` | 口コミ返信生成ツール | 全員（未ログインは3回/日制限） |
| `/diagnosis` | 性格診断（ログイン不要） | 全員 |
| `/profile` | 返信プロファイル一覧 | ログイン必須 |
| `/profile/create` | プロファイル作成（診断/テキスト学習） | ログイン必須 |
| `/advice` | 口コミ返信アドバイス | 全員 |
| `/pricing` | 料金ページ | 全員 |
| `/history` | 生成履歴 | ログイン必須 |
| `/auth/callback` | Supabase OAuth コールバック | システム |
| `/privacy` | プライバシーポリシー | 全員 |
| `/terms` | 利用規約 | 全員 |
| `/api/generate-reply` | 返信生成API | 認証付き |
| `/api/analyze-writing` | テキスト分析API | 認証付き |
| `/api/stripe/*` | Stripe連携API | 認証付き |

---

## 7. コアフィーチャー詳細

### 7-A. 返信プロファイル（返信DNA）

Big Five 心理学の4軸をベースにしたプロファイリング：

| 軸 | 表示名 | 説明 |
|---|------|------|
| `agreeableness` | 温かみ | 共感・思いやりの強さ |
| `extraversion` | 社交性 | 外向き・明るさ |
| `conscientiousness` | 丁寧さ | 礼儀・几帳面さ |
| `openness` | 独自性 | 個性・創造性 |

DISC分類（D/I/S/C）に変換してプロンプトに活用。

### 7-B. プロファイル作成方法

1. **性格診断（推奨）**: 10問の日常行動質問 → AIがスコア計算 → 返信DNA生成
2. **テキスト学習**: 過去の返信文2〜3件 → Claude APIが文体分析 → スコア計算

### 7-C. 匿名診断フロー

未ログインでも `/diagnosis` で診断可能：
1. 診断完了 → `sessionStorage`（キー: `rr_pending_diagnosis`）にスコア保存
2. 「保存して使う」→ `AuthModal` 表示（`nextPath="/profile/create?import=diagnosis"`）
3. ログイン完了 → `/profile/create?import=diagnosis` にリダイレクト
4. sessionStorage からスコア読み込み → `ProfileResult` に渡して保存

### 7-D. 8業種対応

飲食店・美容院・クリニック・ホテル・ネイルサロン・エステ・歯科・汎用

### 7-E. 8プラットフォーム対応

Google・食べログ・ホットペッパー・じゃらん・一休・楽天トラベル・Yelp・Tripadvisor

---

## 8. UX設計の重要決定事項

### ログイン必須にしない理由
- 登録前の価値体験が先（口コミ返信生成は未ログインでも3回/日可能）
- 性格診断は完全無料・登録不要で提供
- Post-AHAモーメント（初回生成後）にプロファイル作成CTA表示

### ナビゲーション設計
- **未ログイン**: 料金 / FAQ / 今すぐ試す（amber） / ログイン
- **ログイン済み**: 料金 / 返信を作る（amber） / マイページ / ログアウト

### アイコン方針
- UIアイコンはすべて `lucide-react` SVG で統一（絵文字は使わない）
- 感情表現・コンテンツとしての絵文字は許容（例: LP内の「悩みセクション」）

---

## 9. 実装フェーズ履歴

### Phase 1（2026-02-23）: MVP
- Next.js 16 + Claude API + Zustand
- 8業種 / 3トーン / 8プラットフォーム
- IPベースレート制限（3回/日）
- Vercelデプロイ（`review-reply-ai-nu.vercel.app`）

### Phase 1-B（2026-02-23）: ページ構成整理
- `/generator` 子ページ分離（LP / ツール分割）
- privacy / terms ページ追加
- 口コミ5,000文字制限

### Phase 2（2026-02-28）: プロファイル + 認証 + 課金
- Supabase 認証（Google OAuth + Magic Link）
- Big Five 4軸返信プロファイル
  - テキスト学習フロー（`/api/analyze-writing`）
  - 10問性格診断フロー（`DiagnosisFlow`）
- 客層分析機能（`CustomerAnalysis`）
- 補助スタイル5種（`reply_modifiers`）
- DBレート制限（`daily_usage`）+ 1日5回（ログイン済み）
- Stripe連携（checkout / webhook / customer portal）
- `/profile`, `/profile/create`, `/history` ページ
- LP全面刷新
- supabase-schema.sql 実行済み

### Phase 2-A（2026-02-28）: UX動線改善 + SEO
- `AuthModal`に `nextPath` prop 追加（ログイン後リダイレクト先を制御）
- Post-AHAバナー（初回生成後にプロファイル作成CTA）
- 新規ユーザーオンボーディングバナー（`GeneratorWorkspace`）
- Header: AuthButton追加（ログイン状態検知）
- Sitemap: 全ページ追加（/pricing, /advice, /privacy, /terms）
- robots.ts: `/profile`, `/history`, `/api/` をdisallow
- JSON-LD: WebApplication + FAQPage 構造化データ
- GA4スクリプト（`NEXT_PUBLIC_GA_ID` 環境変数）
- HeroSection: 文言修正・CTA改善

### Phase 2-B（2026-02-28）: 未ログイン向け性格診断
- `/diagnosis` ページ新規作成（ログイン不要・完全無料）
- `ProfileResult` に `isAnonymous` prop 追加
- 匿名診断 → sessionStorage 保存 → ログイン後インポートフロー
- `ProfileCreatePage` に `Suspense` + `?import=diagnosis` 対応

### Phase 2-C（2026-02-28）: デザインリファイン
- HeroSection: フォント統一・Noto Serif JP追加・CTAテキスト刷新
  - 「AIにあなたを覚えさせる（無料）」
  - 「先に性格診断だけやってみる（2分・登録不要）」→ `/diagnosis`
- 全コンポーネントの絵文字 → lucide-react SVG 置換
- Header ナビ: ログイン状態で2パターンに整理（マイページ追加）
- ProfileMethodSelector: 性格診断を推奨（1番目・おすすめバッジ）

### Phase 2-D（2026-02-28）: ドメイン変更
- `myreplytone.com` へ変更
- `layout.tsx`, `robots.ts`, `sitemap.ts` のフォールバックURLを更新
- Vercel 環境変数 `NEXT_PUBLIC_APP_URL=https://myreplytone.com` の更新が必要

---

## 10. 未実装・TODO

### 🔴 高優先度

| 項目 | 説明 | 状態 |
|------|------|------|
| Stripe 本番切替 | テスト → 本番（全プロジェクト共通） | 保留中 |
| sales-agent メール配信開始 | myreplytone.com 向けリード獲得メール初回送信 | 未着手 |

### ✅ 完了済み

| 項目 | 完了日 |
|------|--------|
| ファビコン（icon.tsx / apple-icon.tsx）波形アイコン | 2026-02-28 |
| Supabase マジックリンク メールテンプレ日本語化 | 2026-02-28 |
| サービス名 MyReplyTone + AI口コミ返信ジェネレーター 併記 | 2026-02-28 |
| ロゴ刷新（AudioWaveform アイコン + 2行テキスト） | 2026-02-28 |
| AuthModal UX改善（ボタン文言・送信後メッセージ） | 2026-02-28 |
| rate limit: Supabase永続化（anonymous_trial_usage テーブル・3回/日） | 2026-02-28 |
| GA4 `G-8Z4CYXXR5N` 設定・本番反映 | 2026-02-28 |
| Google Search Console 登録・所有権確認・sitemap.xml 送信 | 2026-02-28 |
| ドメイン `myreplytone.com` Vercel 接続・DNS・SSL | 2026-02-28 |
| Supabase Redirect URL・Site URL 更新 | 2026-02-28 |
| Vercel 環境変数 `NEXT_PUBLIC_APP_URL=https://myreplytone.com` | 2026-02-28 |

### 🟡 中優先度

| 項目 | 説明 |
|------|------|
| OGP画像作成 | `/public/og-image.jpg`（1200x630px）。現状は画像なし |
| GA4 Measurement ID設定 | Vercel環境変数 `NEXT_PUBLIC_GA_ID` に実際のIDを設定 |
| カスタムドメインDNS設定 | myreplytone.com → Vercel の A/CNAMEレコード設定 |

### 🟢 低優先度

| 項目 | 説明 |
|------|------|
| Pro機能の「近日公開」解除 | Stripe本番切替後にUIを更新 |
| 多言語返信の品質向上 | 英語・中国語・韓国語返信のプロンプト改善 |
| モバイルUX最適化 | スマホでの入力体験改善 |

---

## 11. 変更履歴

| 日付 | 内容 | コミット |
|------|------|---------|
| 2026-03-01 | FAQ充実（8→13問）・faqSchema同期・AdSense準拠（/contact新設・プラポリ/利用規約拡充・sitemap更新）・MsgScore同対応 | - |
| 2026-03-01 | sales-agent プロダクト分離 UAT全16テスト合格（Vercelキャッシュ→強制再デプロイで解決） | a0bd9ff |
| 2026-03-01 | AdSense所有権確認修正（next/script→head直接配置）・営業用説明資料(docs/sales-deck.md)作成 | 4039de5 |
| 2026-03-01 | sales-agent プロダクト分離: DB product列追加・Web reply/followup/discover/cron全ルートproduct対応・LeadsTable商品バッジ+フィルタタブ・CLI ProductConfig動的プロンプト+rr-*テンプレ登録+--productフラグ+業種自動判定・メール文面ルール7項追加（改行/AI臭排除/敬語/呼称等） | - |
| 2026-03-01 | LP性格診断推し整合性統一: Header CTA→/diagnosis・FeatureCards1枚目→トーン再現・PricingSection Free CTA→/diagnosis・中間CTA主従逆転・Footer機能カテゴリ整理+性格診断リンク追加・FAQSection id="faq"バグ修正・AdSenseコード導入 | - |
| 2026-03-01 | sales-agent-web Phase4-8実装: フォローアップ・ナレッジ管理・2段階返信・マルチターン・VoC収集。Vercelデプロイ・動作確認済み | 最新 |
| 2026-03-01 | 管理者ダッシュボード実装: /admin KPIカード・ユーザー管理(一覧/詳細/プラン変更/削除)・admin認証基盤・認証バグ修正(client.ts)・Vercel ADMIN_EMAILS設定・migration_003作成 | - |
| 2026-02-28 | HowItWorks修正: STEP1性格診断メイン化(Brain icon)・STEP3 /adviceリンク化・UXテスト方法論にメッセージ整合性+クリッカブル錯覚基準追加 | - |
| 2026-02-28 | UXテスト🔴4件修正: Headerナビ順序CTA先頭化・広告プレースホルダー非表示・料金表お試し3回/日に修正・残回数初期値センチネル化 | - |
| 2026-02-28 | ファビコン追加（icon.tsx/apple-icon.tsx 波形アイコン）・Supabaseメールテンプレ日本語化 | - |
| 2026-02-28 | サービス名 MyReplyTone に統一・ロゴ刷新（AudioWaveform）・AI口コミ返信ジェネレーター併記・rate limit Supabase永続化（3回/日）・AuthModal UI改善 | b3ecf8c |
| 2026-02-28 | GA4（G-8Z4CYXXR5N）Vercel環境変数設定・デプロイ反映。Search Console sitemap.xml送信完了 | 54618af |
| 2026-02-28 | Google Search Console 所有権確認完了（HTMLファイル + メタタグ2方式）| ce6b1d2 / 572c85a |
| 2026-02-28 | Supabase Site URL・Redirect URL を myreplytone.com に更新 | 手動 |
| 2026-02-28 | さくらインターネット DNS設定（A: 76.76.21.21 / CNAME: cname.vercel-dns.com）・SSL自動発行 | 手動 |
| 2026-02-28 | Vercel カスタムドメイン登録（myreplytone.com / www.myreplytone.com）・NEXT_PUBLIC_APP_URL更新 | 5497b4c |
| 2026-02-28 | Phase 2-D: ドメインをmyreplytone.comに変更。layout/robots/sitemap のフォールバックURL更新 | 5497b4c |
| 2026-02-28 | Phase 2-C: 絵文字→lucide-react全置換・Headerナビ2状態対応・性格診断推奨化・Stripe/Supabaseパッケージ追加・Stripe APIバージョン更新 | a54724d |
| 2026-02-28 | Phase 2-B: 未ログイン向け/diagnosisページ新規作成・匿名診断→ログイン後インポートフロー実装 | 8ca9d42 |
| 2026-02-28 | Phase 2-A: HeroSection文言修正・CTAリファイン・Noto Serif JP追加・ProfileMethodSelector診断推奨化 | e029d89 |
| 2026-02-28 | Phase 2-A: UX動線改善+SEO強化（AuthModal nextPath/Post-AHAバナー/オンボーディング/JSON-LD/sitemap/robots/GA4） | ddd29ce / bf7c9a8 |
| 2026-02-28 | Phase 2全実装: プロファイル/認証/Stripe/客層分析/補助スタイル/LP全面刷新 | bf7c9a8 |
| 2026-02-23 | Phase 1-B: /generatorページ分離・privacy/terms追加・5000文字制限 | cc59691 |
| 2026-02-23 | Phase 1 MVP: Next.js 16+Claude API+Zustand。8業種/3トーン/8プラットフォーム。Vercelデプロイ | cc59691 |
