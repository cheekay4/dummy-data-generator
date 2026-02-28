# tools24.jp — Single Source of Truth

> このファイルはプロジェクトの現在状態を記録するSST（Single Source of Truth）。
> Claude Code は毎セッション開始時に読み込み、変更時に即反映すること。

最終更新: 2026-02-28（myreplytone.com 本番完全稼働。GA4・Search Console・DNS・Supabase全設定完了。詳細は review-reply-ai/MYREPLYTONE-STATUS.md 参照）

---

## 1. デプロイ済みツール一覧

| ツール名 | URL | ステータス | リポジトリ名 |
|---------|-----|----------|------------|
| 確定申告かんたんツール集 | https://tools24.jp | ✅ LIVE | kakutei-tools |
| 個人情報マスキングツール | https://masking-tools-inky.vercel.app | ✅ LIVE | masking-tools |
| tools24.jp 開発者ツール群 | https://tools24-rho.vercel.app | ✅ LIVE | tools24 |
| 敬語メールライター | https://keigo-tools.vercel.app | ✅ LIVE | keigo-tools |
| 契約書チェッカー | https://contract-tools-theta.vercel.app | ✅ LIVE | contract-tools |
| AI口コミ返信ジェネレーター | https://myreplytone.com | ✅ LIVE | review-reply-ai |

---

## 2. 確定申告ツール詳細（kakutei-tools）

ベースURL: https://tools24.jp

| # | ツール名 | パス | 実装状況 |
|---|---------|------|---------|
| 1 | 所得税シミュレーター | /income-tax | ✅ 実装済み |
| 2 | 医療費控除計算 | /medical | ✅ 実装済み |
| 3 | ふるさと納税控除額計算 | /furusato | ✅ 実装済み |
| 4 | ふるさと納税トラッカー | /furusato-tracker | ✅ 実装済み |
| 5 | 副業・フリーランス所得計算 | /side-job | ✅ 実装済み |
| 6 | 生命保険料控除計算 | /life-insurance | ✅ 実装済み |
| 7 | 住宅ローン控除計算 | /housing-loan | ✅ 実装済み |
| 8 | 確定申告チェックリスト | /checklist | ✅ 実装済み |
| 9 | e-Tax提出ガイド | /etax-guide | ✅ 実装済み |

共通ページ: /about, /contact, /privacy, /terms

---

## 3. 収益化ステータス

### Google AdSense
- ステータス: 🟡 審査待ち / 未承認（プレースホルダー実装済み）
- 実装: 3箇所のプレースホルダー配置済み（728x90, 336x280, 300x250）
- パブリッシャーID: ???

### A8.net（アフィリエイト）
- ステータス: ✅ 実装済み（kakutei-tools に組み込み済み）
- 対象ページ: /income-tax, /medical, /furusato, /side-job, /life-insurance, /housing-loan
- リンク済みサービス:
  - freee会計（a8mat=4AXEWG+32QO2I+3SPO+9FL80Y）
  - マネーフォワード クラウド確定申告（a8mat=4AXEWG+36WPAY+4JGQ+BZ8OY）
  - やよいの青色申告オンライン（a8mat=4AXEWG+5HNYE2+35XE+609HU）

### Stripe（サブスク課金）
- ステータス: ✅ サンドボックス環境で稼働中（テストモード）
- 商品一覧:
  - 個人情報マスキング Pro ¥190/月（price_1T33Su3aq0QKNOrWJAARR0Xb）
  - 敬語メールライター Pro ¥290/月（price_1T3Dnp3aq0QKNOrWGZnO1CXQ）
  - 契約書チェッカー Pro ¥490/月（price_1T3Do83aq0QKNOrWBMIamrTq）
- Webhook: 3エンドポイント登録済み（masking-tools, keigo-tools, contract-tools）

---

## 4. ロードマップ進捗

### Phase 0: 確定申告ツール集（tools24.jp） ✅ 完了
- [x] 9ツール全実装
- [x] Vercel デプロイ（tools24.jp）
- [x] SEO対応（sitemap, OGP, 構造化データ）
- [x] A8.net アフィリエイト実装
- [x] AdSense プレースホルダー設置
- [x] プライバシーポリシー・利用規約・お問い合わせページ

### Phase 1: 個人情報マスキングツール（masking-tools） ✅ 完了
- [x] UI実装（personal-data-masking ページ）
- [x] pricing ページ実装（Free / Pro 190円/月）
- [x] Stripe連携（サブスク課金）
- [x] Vercel デプロイ
- [x] Webhook登録

### Phase 2: tools24.jp 開発者ツール群（tools24） ✅ 完了（ドメイン切り替え待ち）
- [x] JSON整形ツール（/json-formatter）
- [x] 文字数カウンター（/character-counter）
- [x] 正規表現テスター（/regex-tester）
- [x] ダミーデータ生成（/dummy-data-generator）
- [x] Cron式ビルダー（/cron-expression-builder）
- [x] 和暦・西暦変換（/wareki-converter）
- [x] エンコード・デコード（/encode-decode）
- [x] Vercel デプロイ
- [ ] tools24.jp ドメイン切り替え（kakutei-tools → tools24）

### Phase 3: 有料ツール拡充 ✅ 完了
- [x] 敬語メールライター（月額 290円）— keigo-tools
- [x] 契約書チェッカー（月額 490円）— contract-tools
- [x] Stripe サンドボックス環境設定
- [ ] Stripe 本番環境切り替え
- [ ] Google AdSense 審査通過・広告掲載

---

## 4-B. MsgScore 未実装・TODO項目

### 🔴 高優先度（近々実装予定）

| 項目 | 説明 | 備考 |
|------|------|------|
| ユーザー/チームの「復元」機能 | 削除済みアカウントの復元 | `deleted_at` ソフトデリート機能がDBに未追加。スキーマ変更要 |
| 企業アドミン権限分離 | Teamオーナー専用管理画面 | 現状はチームオーナーがメンバー管理できる（基本機能あり）。Proプランとの区別を強化するかどうか要検討 |
| Stripe 本番環境切り替え | テストモード → 本番モード | 全ツール共通 |

### 🟡 中優先度（要件確定後に実装）

| 項目 | 説明 | 備考 |
|------|------|------|
| マニュアルページ（個人編・チーム編） | /manual/basic, /manual/team | 画面キャプチャが整ったら実装 |

### 🟢 低優先度（将来的に検討）

| 項目 | 説明 | 備考 |
|------|------|------|
| テスト用チームのStripe連携 | 手動作成チームにStripeサブスク紐付け | 現状は stripe_subscription_id なしで機能は使える |
| Admin ユーザー/チーム CSV出力 | 一括エクスポート | データ分析用 |

---

## 5. 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| フォント | Noto Sans JP（Google Fonts） |
| デプロイ | Vercel |
| テスト | Vitest（kakutei-tools） |
| 設計原則 | 全処理クライアントサイド完結、データ送信なし |

---

## 6. 課金モデル（決定済み）

| ツール | プラン | 月額 | ステータス |
|------|----|------|---------|
| 個人情報マスキングツール | Free / Pro | 190円/月 | ✅ Stripe連携済み（テスト） |
| 敬語メールライター | Free / Pro | 290円/月 | ✅ Stripe連携済み（テスト） |
| 契約書チェッカー | Free / Pro | 490円/月 | ✅ Stripe連携済み（テスト） |

**共通方針:** いつでも解約可能、月次サブスク、Pro = 無制限利用 + 広告なし

---

## 7. 変更履歴

<!-- 最新が上。形式: YYYY-MM-DD | 内容 | 担当 -->

| 日付 | 内容 |
|------|------|
| 2026-02-28 | GA4(G-8Z4CYXXR5N)設定・Search Console登録・sitemap送信・Supabase URL更新・DNS設定・myreplytone.com 本番完全稼働 | Claude Code |
| 2026-02-28 | myreplytone.com ドメイン変更。絵文字→lucide-react全置換・Headerナビ2状態・性格診断推奨化。npm run build ✅ git push ✅ | Claude Code |
| 2026-02-28 | review-reply-ai Phase 2完全実装（UX動線/性格診断/Post-AHA/SEO/認証/課金/客層分析）。npm run build ✅ git push ✅ | Claude Code |
| 2026-02-28 | review-reply-ai Phase 2 全実装完了。Big Five 4軸プロファイル（テキスト学習+10問診断）・客層分析・補助スタイル5種・Supabase認証+課金+レート制限・LP全面刷新・/profile/createページ・/api/analyze-writing API。npm run build ✅ | Claude Code |
| 2026-02-28 | DemoForge ローカルE2Eテスト完了。URL入力→LP解析→計画生成→Playwright自動操作→FFmpeg動画生成→MP4出力まで全パイプライン動作確認。未対応: 音声・操作可視化 | Claude Code |
| 2026-02-28 | DemoForge Phase 1 全実装完了（1-A〜1-E）。Next.js 16 + Tailwind v4 + Zustand v5 + Playwright + Claude Vision + VOICEVOX + FFmpegワーカー。npm run build ✅ | Claude Code |
| 2026-02-24 | sales-agent-web（Next.js ダッシュボード）新規作成: Dashboard/Leads/Drafts/Replies/Campaigns/Settings全ページ。Add-B（CLI A/B生成+MsgScoreセルフスコアリング）・Add-C（テスト送信API）・Step6（返信承認+Gmail送信）・Step7（Cron自動送信）実装完了。npm run build ✅ x2（CLI+web）| Claude Code |
| 2026-02-23 | review-reply-ai: /generator子ページ分離（LP/ツール分割）・privacy/termsページ追加・口コミ5,000文字制限追加。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | AI口コミ返信ジェネレーター（review-reply-ai）Phase 1 MVP実装完了 + Vercelデプロイ完了（https://review-reply-ai-nu.vercel.app）。Next.js 16+Claude API+Zustand。8業種/3トーン/8プラットフォーム対応。IPレート制限3回/日。npm run build ✅ | Claude Code |
| 2026-02-24 | sales-agent 全実装完了（Phase 1+2）。gmail/lead-db/templates/commands/knowledge/index.ts 作成。npm run build ✅ | Claude Code |
| 2026-02-23 | セキュリティポリシー実装: ①Webhook拡張トークン自動失効(subscription.updated/deleted) ②DELETE /api/account/delete エンドポイント ③AccountDeleteSection確認UI ④マイページ/設定ページに追加。LINE低評価バッジ・配信停止リスク警告・プレビュー機能も同時実装。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | Admin チーム管理に「チームを作成」機能追加（チーム名+オーナーEmail+プラン入力→team/team_members作成）・STATUS.md未実装TODO一覧追加。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | Phase4実装: ①マイページ(/mypage 履歴/セグメント/設定タブ統合・/historyリダイレクト) ②ブログ・SNSチャネル追加+海外向けリメイク(/api/localize・LocalizePanel) ③スライダーUX改善(年代残り人数差分・性別数値/パーセント直打ち・リセット3種・モバイル率/既存顧客率を数値入力化) ④Adminアカウント作成UI改善。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | Admin バグ修正2件: ①ユーザーテーブルのscoresTODAY列（daily_usageのidentifier列→user_id列修正）②profiles_plan_check制約エラー修正（admin UIをfree/proのみに制限、team planはチーム管理で変更）。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | Super Admin パネル実装完了: /admin(KPI統計/プラン内訳グラフ)・/admin/users(プラン変更/削除/ダミー作成/拡張トークン失効)・/admin/teams(プラン変更/削除)・SUPER_ADMIN_EMAIL環境変数認証。npm run build ✅ | Claude Code |
| 2026-02-23 | MsgScore Phase 3-C実装完了: Chrome拡張(msg-scorer-extension)新規作成。Gmail・LINE OA Manager Shadow DOMパネル・ポップアップ・拡張トークン認証(mse_*)・/api/extension/token・/api/extension/verify・ExtensionTokenSection設定UI・supabase-schema-extension.sql。npm run build ✅ | Claude Code |
| 2026-02-23 | MsgScore Phase 3-A実装完了: FeedbackWidget(👍👎+コメント)・FeedbackTrend(週次グラフ+コメント一覧)・/api/feedback・/api/team/feedback・supabase-schema-feedback.sql・Slack通知強化。npm run build ✅ | Claude Code |
| 2026-02-23 | MsgScore 料金ページ刷新: 4列構成(Free/Pro/Team/TeamPro)・TeamをS/M/L切替カード化・機能行10行に整理・/featuresページ新規作成・TeamProカスタムセグメント20個化。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-23 | MsgScore Phase 3-B実装完了: CSVインポート・Slack通知・外部APIキー管理・v1/scoreエンドポイント・APIドキュメントページ・Team Proゲーティング・料金ページTeamPro追加・スコアルート類似配信注入+Slack通知組込み。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-22 | MsgScore Session14 UXテスト: 🔴2件修正（5回使い切り→アップグレードCTA表示・AgeError時disabled理由を明示）。SubmitButton.tsx修正。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-22 | MsgScore UX修正3件: U-1入力方式タブ(HTML/JSON/LINE JSON抽出)・U-2もう一度試すボタン上下2箇所配置・U-3年代スライダー人数/割合直打ち+バリデーション。npm run build ✅ Vercelデプロイ完了 | Claude Code |
| 2026-02-22 | MsgScore: WebhookのCustomer.subscription.updatedハンドラ修正（アクティブ復元時にPrice IDからプランを逆引き）。Vercel envに STRIPE_PRICE_TEAM_S/M/L追加、再デプロイ完了。npm run build ✅ | Claude Code |
| 2026-02-22 | MsgScore Phase 2.5実装完了: Team S/M/L課金(Stripe)・チーム作成/招待/承諾フロー・チームダッシュボード(管理者/メンバービュー)・メンバー管理・ブランドボイス設定・共有プリセット・修正依頼・チームスコア推移グラフ・個人vsチーム比較レーダー・最低スコアルール・料金ページ5プラン化・ナビゲーション更新。supabase-schema-phase25.sql作成。npm run build ✅ | Claude Code |
| 2026-02-22 | keigo-tools: CORS対応・ライセンスキー認証・Webhook(Resend)・アカウントページ追加。keigo-extension新規作成（Shadow DOM・MV3・esbuild・icons生成）。npm run build ✅ | Claude Code |
| 2026-02-22 | tools24: 文字数カウンターをcoming-soonに変更（tools24未統合・standalone character-counter/は別途存在）。handoff/roadmap更新 | Claude Code |
| 2026-02-22 | MsgScore Phase 2実装完了: Supabase認証(Google OAuth+マジックリンク)・Stripe課金(checkout/webhook/portal)・DBレート制限(daily_usage)・スコア履歴保存・share/[token]公開ページ・ProGate・NGワード検出・メール/LINEプレビュー・カスタムセグメントCRUD・CSV出力・設定ページ。npm run build ✅ | Claude Code |
| 2026-02-21 | MsgScore Phase 1-C実装完了: SEO/OGP/sitemap/robots.txt・GA4 trackEvent全5箇所・vercel.jsonセキュリティヘッダー・pricing/privacy/termsページ・next.config turbopack.root修正。npm run build ✅ |
| 2026-02-21 | MsgScore Phase 1-B実装完了: Claude API(claude-sonnet-4-6)スコアリング・systemPrompt/userPrompt構築・JSONパースリトライ・結果UI8コンポーネント(ScoreCircle/RadarChart/ImpactCard/AxisFeedback/ImprovementList/ABComparison/CopyReport/ResultView)。npm run build ✅ |
| 2026-02-21 | MsgScore新規プロジェクト作成。Phase 1-A実装完了: Next.js 16 + Tailwind v4 + zustand + Framer Motion。全UI構築（LP・スコアリング入力フォーム・セグメントパネル・アニメーション）。npm run build ✅ |
| 2026-02-21 | Phase 1完了: masking-tools Stripe連携+デプロイ。Phase 2完了: 正規表現テスター・Cronビルダー・ダミーデータ生成器・和暦変換・エンコードデコード追加。Phase 3完了: 敬語メールライター・契約書チェッカー新規作成+デプロイ。UXテスト2回実施、🔴計7件修正済み。5リポジトリ全てVercelデプロイ完了 |
| 2026-02-21 | Session 13 UXテスト：🔴4件修正（Base64サイズ制限・空文字ハッシュ・riskScore=-1誤表示・非契約書カウント消費）。tools24+contract-tools npm run build ✅ |
| 2026-02-21 | contract-tools新規リポジトリ作成。契約書チェッカー実装完了（Claude API連携・Stripe課金・12カテゴリ分析・リスクゲージ・条項対照表・pdfjs-dist PDF読み込み）。npm run build ✅ |
| 2026-02-21 | Phase 3開始: keigo-tools新規リポジトリ作成。敬語メールライター実装完了（Claude API連携・Stripe課金・8テンプレ・トーン調整・敬語解説）。npm run build ✅ |
| 2026-02-21 | tools24にエンコード・デコードツールキット（/encode-decode）追加。Base64/URL/JWT/ハッシュ(MD5+SHA)/Unicode変換を実装。npm run build ✅ |
| 2026-02-21 | tools24に和暦・西暦変換ツール（/wareki-converter）追加。元号変換・UNIX時間・ISO 8601・年齢計算・営業日計算・和暦早見表を実装。npm run build ✅ |
| 2026-02-21 | Phase 1完了: masking-tools Stripe連携+デプロイ。Phase 2完了: tools24に正規表現テスター・Cronビルダー・ダミーデータ生成器を追加+デプロイ。UXテスト実施、🔴3件修正済み |
| 2026-02-20 | ダミーデータ生成ツール実装完了（/dummy-data-generator）。22種類のフィールド・3プリセット・5形式出力（テーブル/JSON/CSV/TSV/SQL）。accordion/checkbox/input/label UIコンポーネント追加 |
| 2026-02-20 | 正規表現テスター実装完了（/regex-tester）。プリセット9種・マッチハイライト・置換・解説機能 |
| 2026-02-20 | Cron式ビジュアルビルダー実装完了（/cron-expression-builder）。tools24のsitemap・トップページも更新 |
| 2026-02-20 | STATUS.md 初版作成。kakutei-tools(9ツール)デプロイ済み確認、masking-tools/tools24は未デプロイ確認 |
