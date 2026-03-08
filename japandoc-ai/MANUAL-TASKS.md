# JapanDoc AI — 手動タスク一覧

コード実装は Phase 1-A〜1-D 全て完了。以下は手動で対応が必要な項目。

---

## 1. Apple Developer Account（前提条件）

- [ ] Apple Developer Program に登録（年額 $99 / ¥12,980）
- [ ] App Store Connect にアプリを作成
- [ ] Bundle ID を決定（例: com.tools24.japandoc-ai）

## 2. 環境変数の設定

- [ ] `japandoc-api/.env.local` に `ANTHROPIC_API_KEY=sk-ant-...` を設定
  - Claude API コンソール: https://console.anthropic.com/
- [ ] japandoc-api を Vercel にデプロイし、本番URLを取得
- [ ] `japandoc-ai/.env.local` の `EXPO_PUBLIC_API_URL` を本番URLに変更

## 3. App Store Connect — IAP 商品作成

### Consumable（クレジットパック）
| Product ID | 内容 | 価格 |
|-----------|------|------|
| japandoc.credits.5 | 5スキャン | ¥160 |
| japandoc.credits.30 | 30スキャン | ¥500 |
| japandoc.credits.100 | 100スキャン | ¥1,500 |
| japandoc.credits.300 | 300スキャン | ¥3,500 |

### Auto-Renewable Subscription
| Product ID | 内容 | 価格 |
|-----------|------|------|
| japandoc.premium.monthly | Premium月額 | ¥980/月（7日間無料トライアル） |
| japandoc.premium.yearly | Premium年額 | ¥9,800/年 |

- [ ] サブスクリプショングループを作成
- [ ] 各商品を登録
- [ ] サンドボックステスターアカウントを作成

## 4. react-native-iap 実装

```bash
cd japandoc-ai
npm install react-native-iap
```

- [ ] paywall.tsx の TODO コメント箇所を実装:
  - `handleBuyCredits` → IAP購入フロー接続
  - `handleSubscribe` → サブスク購入フロー接続
  - `handleRestore` → restorePurchases 接続
- [ ] 購入完了後に /api/verify-receipt を呼んでサーバー検証

## 5. Apple Server API v2 レシート検証

- [ ] App Store Connect → Keys → In-App Purchase キーを生成
- [ ] japandoc-api の verify-receipt/route.ts を実装:
  - Apple の signed transaction を検証
  - Supabase に購入レコードを保存（任意）
- [ ] 環境変数に追加: APPLE_KEY_ID, APPLE_ISSUER_ID, APPLE_PRIVATE_KEY

## 6. AdMob 広告（無料ティアのみ）

```bash
cd japandoc-ai
npx expo install react-native-google-mobile-ads
```

- [ ] Google AdMob アカウント作成
- [ ] アプリを AdMob に登録
- [ ] バナー広告ユニットID取得
- [ ] 結果画面下部にバナー表示（subscriber には非表示）
- [ ] リワード動画オプション（広告視聴で+3スキャン）の検討

## 7. App Store メタデータ

- [ ] アプリアイコン（1024x1024 PNG）
- [ ] スクリーンショット作成:
  - 6.7インチ（iPhone 15 Pro Max）x 5枚
  - 6.1インチ（iPhone 15 Pro）x 5枚
  - 英語 + ベトナム語の2セット
- [ ] 説明文（英語 + 日本語）— product-spec-v2.md 参照
- [ ] キーワード: japan,document,translate,scanner,ocr,foreigner,expat,kanji,tax,visa,menu,sign,medical,ai
- [x] プライバシーポリシーURL: https://japandoc-api.vercel.app/privacy
- [ ] サポートURL
- [ ] カテゴリ: Utilities / Reference

## 8. EAS Build + TestFlight

```bash
# EAS CLI インストール
npm install -g eas-cli

# ログイン
eas login

# ビルド設定
eas build:configure

# iOS ビルド
eas build --platform ios

# TestFlight に提出
eas submit --platform ios
```

- [ ] eas.json の設定（development / preview / production プロファイル）
- [ ] app.json に bundleIdentifier を設定
- [ ] TestFlight で内部テスト実施
- [ ] 外部テスター（ベトナム語 / 中国語話者）に配布して多言語テスト

## 9. Firebase Analytics

```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

- [ ] Firebase プロジェクト作成
- [ ] GoogleService-Info.plist をダウンロード
- [ ] トラッキングイベント:
  - scan_complete（category, language）
  - paywall_shown
  - purchase_complete（product_id, type）
  - language_changed（from, to）
  - onboarding_complete

## 10. App Store 審査提出

- [ ] 上記 1〜9 全て完了後
- [ ] App Review に提出
- [ ] リジェクト対応（必要に応じて）

---

## 優先順位の推奨

1. 環境変数設定 + japandoc-api デプロイ（すぐできる）
2. Apple Developer Account 登録
3. EAS Build + TestFlight（実機動作確認）
4. IAP 商品作成 + react-native-iap 接続
5. レシート検証実装
6. AdMob
7. メタデータ + スクリーンショット
8. Firebase Analytics
9. App Store 提出
