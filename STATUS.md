# tools24.jp — Single Source of Truth

> このファイルはプロジェクトの現在状態を記録するSST（Single Source of Truth）。
> Claude Code は毎セッション開始時に読み込み、変更時に即反映すること。

最終更新: 2026-03-24（カスハラShield Vercelデプロイ + UX修正7件）

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
| 引き継ぎAI | https://hikitsugi-ai.vercel.app | ✅ LIVE（Phase 1-C） | hikitsugi-ai |
| ScanLingo API | https://japandoc-api.vercel.app | ✅ LIVE | japandoc-api |
| ScanLingo | — | 🔧 開発中（Phase 1-A~D コード完了、UXテスト済み） | japandoc-ai |
| DealRoom | — | 🔧 未デプロイ（Phase 1-A/B/C コード完了）| dealroom |
| カスハラShield | https://kasuhara-shield.vercel.app | ✅ LIVE | kasuhara-shield |
| 触診部位同定トレーナー | — | ✅ MVP完成（Phase 0〜5完了・ローカル動作・教員レビュー待ち） | palpation-trainer |

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
| 2026-08-18 | palpation-trainer: Phase 5 セッション統合完了=MVP完成（Taskエンジン+scoreTask+L2カバレッジ+選択肢生成+セッションUI。5分セッションのE2Eを実APIで通し実証。テスト78件） | Claude Code |
| 2026-08-18 | palpation-trainer: Phase 4 LLM統合完了（患者役Haiku+講評Sonnet実API疎通、二重フィルタ・事実生成検出・再試行を実証。実測原価3.3円/セッション。テスト62件） | Claude Code |
| 2026-08-18 | palpation-trainer: Phase 3 症例DB完了（10症例・public/truth型分離・リーク防止テスト・ランドマーク座標を幾何生成しビューワー実証。テスト34件パス） | Claude Code |
| 2026-08-18 | palpation-trainer: Phase 2 3Dビューワー完了（Vite+R3F、61メッシュ表示・レイヤー切替・レイキャスト座標取得・ランドマーク判定をブラウザ実証。テスト24件パス） | Claude Code |
| 2026-08-18 | palpation-trainer: Phase 1 データ基盤完了（A案承認→モノレポ+BodyParts3D変換パイプライン61メッシュ+scope.json 55構造+層B事実テーブル+getStructureFacts+テスト18件パス） | Claude Code |
| 2026-08-09 | palpation-trainer: Phase 0 検証完了（Z-Anatomy/BodyParts3D 実データ解析・GLB変換テスト・日本語用語ライセンス調査。レポート: palpation-trainer/PHASE0-VERIFICATION.md）。データソース戦略の確認待ち | Claude Code |
| 2026-03-24 | kasuhara-shield: Vercel初回デプロイ（https://kasuhara-shield.vercel.app）+ UXテスト7件修正（LP改善・WelcomeGuide・オンボーディング強化・モバイルナビ・かんたん入力モード・料金プラン明確化）。npm run build ✅ | Claude Code |
| 2026-03-20 | DealRoom Phase 1-A/B/C 全実装完了（ルームページ6セクション・RoomTracker・ダッシュボード・ルーム作成・Sales Agent連携）Agent Teams 3体。npm run build ✅ | Claude Code |
| 2026-03-15 | tools24.jp: Sランクツール6本追加（文字化け修正/ファビコン生成/電子印鑑/WebP変換/Minify/全角半角変換）npm run build ✅ | Claude Code |
| 2026-03-15 | sales-agent-web: 送信スケジュールページ新設（/schedule）Agent Teams 3体。日付グループ型タイムライン・JST対応・KPIカード・プロダクトフィルタ。npm run build ✅ | Claude Code |
| 2026-03-14 | ScanLingo: カメラ修正（expo-dev-client追加・GestureHandlerRootView二重ネスト解消・CameraView onMountError/loading改善・eas.json整備）Agent Teams 3体。npx expo export --platform web ✅ | Claude Code |
| 2026-03-14 | hikitsugi-ai Phase 1-D完了（音声入力UI+Transcribe API+GA4+チャットデザイン改善）Agent Teams 3体で実装・レビュー・デプロイ | Claude Code |
| 2026-03-08 | hikitsugi-ai Phase 1-C完了(Supabase Auth+Stripe+DB永続化+Dashboard+共有リンク+利用制限)・myreplytone GA4修正(nonce-CSP対応のSSRスクリプトに変更) | Claude Code |
| 2026-03-08 | ScanLingo: アプリアイコン設定(うさぎりんご1024x1024+favicon+splash+Android adaptive)+権限テキストをグローバル対応+スプラッシュ/Android背景色ダークテーマ統一 | Claude Code |
| 2026-03-08 | ScanLingo: サービス名リネーム(JapanDoc AI→ScanLingo)。app.json/IAP ID/DB名/プライバシーポリシー等11ファイル更新+再デプロイ | Claude Code |
| 2026-03-08 | JapanDoc AI: UXペルソナテスト実施(6ペルソナ12画面)→致命的3件+重要7件を全修正(APIエラーUI・オフライン検知・WCAG AAコントラスト・タッチターゲット・オンボーディング戻るボタン・ペイウォールi18n完全対応)。プライバシーポリシーページ作成+japandoc-apiデプロイ | Claude Code |
| 2026-03-08 | JapanDoc AI: CORS修正(corsJson再帰バグ+ステータスコード形式)+ポート競合解決(3000→3001)。Web経由ギャラリー→Claude Vision API実データ解析✅動作確認。精度・速度に課題あり→改善候補記録済み | Claude Code |
| 2026-03-07 | JapanDoc AI Phase 1-C+1-D実装完了: expo-sqlite/localStorage DB・履歴一覧(フィルタ・検索・お気に入り)・期限トラッキング・通知スケジュール・無料3回/日制限・ペイウォール画面(サブスク+クレジットパック)・クレジット残高管理・/api/verify-receipt骨格。全13ルート build ✅ | Claude Code |
| 2026-03-07 | JapanDoc AI Phase 1-B実装完了: japandoc-api (Next.js Edge Function) + Claude Vision API (claude-sonnet-4-20250514) + カテゴリ別プロンプト(6種) + レート制限 + scan-api連携 + モックフォールバック。両プロジェクト build ✅ | Claude Code |
| 2026-03-07 | hikitsugi-ai Phase 1-C完了: Supabase Auth・Stripe課金(Pro¥1980/Team¥4980)・DB永続化・ダッシュボード・共有リンク・利用制限・PDF出力。npm run build ✅ Vercelデプロイ済み | Claude Code |
| 2026-03-07 | JapanDoc AI Phase 1-A実装完了: React Native + Expo SDK 55 + NativeWind v4 + zustand + i18next。オンボーディング3画面(母国語選択→目的→デモ) + カメラUI + ボトムシート結果表示 + 設定画面 + 4言語対応(en/vi/zh-CN/fil) + モックOCR/辞書。expo export ✅ | Claude Code |
| 2026-03-05 | hikitsugi-ai Phase 1-A実装完了: Next.js 16 + Tailwind v4 + Zustand v5 + Framer Motion。LP(8セクション) + テンプレート選択 + チャットUI + 静的ページ。npm run build ✅ | Claude Code |
| 2026-03-04 | sales-agent-web: プロンプト全面改修（自己紹介排除・価値提供型・スパム感排除）・デプロイ済み | Claude Code |
| 2026-03-04 | sales-agent-web: 初回ドラフト生成機能(Web UI)・再生成ボタン・性格診断推しプロンプト・冒頭挨拶固定・パスワード保護(middleware) | Claude Code |
| 2026-03-03 | MyReplyTone セキュリティ信頼性向上: SECURITY ACTION二つ星・Mozilla Observatory A+(105点)・プライバシー透明性強化・nonce CSP・MsgScoreファビコン変更・Stripe追加審査提出・IPA二つ星申込完了 | Claude Code |
| 2026-03-01 | MyReplyTone FAQ段落分け・Pro解約FAQ誤解防止修正（プロファイル制限/履歴閲覧条件明記・3箇所統一） | Claude Code |
| 2026-03-01 | sales-agent: UAT完了・Cron設定(send+check-replies)・E2Eテスト送信成功・返信AI処理確認・共通署名追加・関連ページURL自動挿入・Markdown禁止ルール追加 | Claude Code |
| 2026-03-01 | MyReplyTone FAQ充実(13問)+faqSchema同期・AdSense準拠(contact/プラポリ/利用規約/sitemap)・MsgScore同対応 | Claude Code |
| 2026-03-01 | sales-agent プロダクト分離 UAT全16テスト合格（Vercelキャッシュ問題修正含む） | Claude Code |
| 2026-03-01 | MyReplyTone AdSense所有権確認修正（head直接配置）・営業用説明資料作成 | Claude Code |
| 2026-03-01 | sales-agent プロダクト分離（MsgScore/AI口コミ）: DB migration・Web全レイヤーproduct通し・UI商品バッジ+フィルタ・CLI --productフラグ+テンプレ分岐+業種自動判定・メール文面ルール改善 | Claude Code |
| 2026-03-01 | MyReplyTone LP性格診断推し整合性統一（Header/FeatureCards/Pricing/Footer/FAQ）+ AdSense導入 | Claude Code |
| 2026-03-01 | sales-agent-web 受信メール登録機能(InboundReplyTab)+「両方」プロダクト選択(全3タブ)+manual-create API+leads/list API+bothProductContext対応 | Claude Code |
| 2026-03-01 | sales-agent-web 返信モジュール全8フェーズ実装完了（Phase4フォローアップ〜Phase8 VoC）＋Vercelデプロイ・動作確認済み | Claude Code |
| 2026-03-01 | sales-agent-web Google Places API 3段階パイプライン（Places→メール抽出→Tavily補助）Vercel本番デプロイ完了 | Claude Code |
| 2026-03-01 | MyReplyTone 管理者ダッシュボード実装（/admin KPI・ユーザー管理CRUD・認証バグ修正）デプロイ完了 | Claude Code |
| 2026-02-28 | MyReplyTone HowItWorks性格診断推し整合修正・STEP3リンク化・UXテスト方法論2基準追加 | Claude Code |
| 2026-03-05 | hikitsugi-ai Phase 1-B実装完了・Vercelデプロイ（https://hikitsugi-ai.vercel.app）。Claude AIインタビュー・ストリーミングマニュアル生成・ReactMarkdown表示。npm run build ✅ | Claude Code |
| 2026-02-28 | MyReplyTone UXテスト🔴4件修正（ナビ順序・広告非表示・料金表修正・残回数初期値）デプロイ完了 | Claude Code |
| 2026-02-28 | MyReplyTone ブランドリニューアル・ファビコン・Supabaseメールテンプレ日本語化・rate limit Supabase永続化・AuthModal UI改善 | Claude Code |
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
