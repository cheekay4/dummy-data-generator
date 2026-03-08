# ScanLingo — セッションログ 2026-03-07

## 実装完了フェーズ

### Phase 1-A: プロジェクト初期化 + カメラUI + オンボーディング
- React Native + Expo SDK 55 + NativeWind v4 + zustand + i18next
- オンボーディング3画面（母国語選択 → 目的 → デモ）
- カメラ画面（シャッター / フラッシュ / ギャラリー / ライブテキストバー）
- ボトムシート結果表示（50% / 95% スナップポイント）
- 設定画面（母国語変更モーダル）
- 4言語対応（en / vi / zh-CN / fil）
- モックOCR / モック辞書データ
- expo export --platform web ビルド確認済み

### Phase 1-B: Claude Vision API 連携
- japandoc-api/ 新規作成（Next.js API プロキシ）
- POST /api/scan — Claude Vision API (claude-sonnet-4-20250514) へ画像送信
- カテゴリ別プロンプト注入（6種: 公的書類 / 医療 / 飲食 / 交通 / 住居 / 仕事）
- レート制限（10req/min per IP）、2回リトライ
- japandoc-ai 側: scan-api.ts（画像圧縮 → base64 → API送信 → マッピング）
- エラー時モックデータフォールバック + 警告バナー
- Web用モーダル表示（@gorhom/bottom-sheet がWebで動作しないため）
- 「Try Demo Scan」ボタン追加（カメラ非対応環境向け）

### Phase 1-C: 履歴・保存・期限トラッキング
- expo-sqlite データベース（scans + deadlines テーブル）
- プラットフォーム分割: database.native.ts（SQLite）/ database.web.ts（localStorage）
- スキャン結果の自動保存（scan-store → history-store → DB）
- 履歴一覧画面（FlatList + カテゴリフィルタチップ + お気に入りフィルタ + テキスト検索）
- お気に入り追加/解除（result/[id] の星ボタン）
- 期限トラッキング（deadlines テーブル + DeadlineList コンポーネント）
- 設定画面から期限一覧モーダル表示（色分け: 赤=期限切れ / オレンジ=7日以内 / 緑=それ以降）
- expo-notifications でローカル通知スケジュール（7日前 / 1日前 / 当日）
- 無料3回/日制限（AsyncStorage永続化 + 日付リセット）
- history namespace 翻訳追加（4言語）

### Phase 1-D: 課金UI + クレジット管理 + ペイウォール
- ペイウォール画面 /paywall（モーダル表示）
  - サブスクリプション2プラン: ¥980/月（7日間無料トライアル）/ ¥9,800/年
  - クレジットパック4種: 5回¥160 / 30回¥500 / 100回¥1,500 / 300回¥3,500
  - Restore Purchases リンク
  - 「発音ガイドはずっと無料」ヒント
- クレジット残高管理（zustand + AsyncStorage永続化）
- user-store 拡張: addCredits / useCredit / setPurchaseStatus / restorePurchases
- スキャン時クォータ消費ロジック: subscriber=無制限 / credits=1消費 / free=3回/日
- 制限到達時 → ペイウォール自動遷移
- カメラ画面ヘッダーに残回数バッジ表示
- /api/verify-receipt スケルトン（Apple Server API v2 用）
- paywall namespace 翻訳追加（4言語）

## ファイル構成（最終）

```
japandoc-ai/
  app/
    _layout.tsx              # RootLayout + DB初期化 + onboarding guard
    paywall.tsx              # ペイウォール画面（Phase 1-D）
    (tabs)/
      _layout.tsx            # 3タブ（Scan / History / Settings）
      index.tsx              # カメラ + ボトムシート
      history.tsx            # 履歴一覧（Phase 1-C）
      settings.tsx           # 設定 + 期限モーダル
    onboarding/
      language.tsx / target.tsx / demo.tsx
    result/
      [id].tsx               # 結果全画面 + お気に入りトグル
  src/
    components/
      camera/                # CameraView / ShutterButton / FlashToggle / GalleryButton / LiveTextBar
      bottom-sheet/          # ScanResultSheet / ResultSummary / ResultDetail / UrgencyBadge
      onboarding/            # LanguageList / TargetCountryList / DemoContent
      deadlines/             # DeadlineList（Phase 1-C）
    lib/
      types.ts               # 型定義
      i18n.ts                # i18next 初期化（7 namespace x 4言語）
      database.native.ts     # SQLite（native）
      database.web.ts        # localStorage（web）
      database.d.ts          # 型定義
      scan-api.ts            # API クライアント
      image-utils.ts         # 画像圧縮
      pronunciation.ts       # ローマ字 → 発音ガイド変換
      mock-data.ts           # モックデータ
      notifications.ts       # 通知スケジューラ（Phase 1-C）
    locales/
      en/ vi/ zh-CN/ fil/    # 各7ファイル（common/onboarding/camera/result/settings/history/paywall）
    stores/
      user-store.ts          # 言語/課金/クレジット/日次制限
      scan-store.ts          # スキャン状態 + クォータ消費
      history-store.ts       # 履歴CRUD + フィルタ（Phase 1-C）

japandoc-api/
  src/app/api/
    scan/route.ts            # Claude Vision API プロキシ
    verify-receipt/route.ts  # レシート検証スケルトン（Phase 1-D）
  src/lib/
    system-prompt.ts         # システムプロンプト
    category-prompts.ts      # カテゴリ別プロンプト拡張
```

## ビルド結果
- japandoc-ai: `npx expo export --platform web` — 13ルート全て成功
- japandoc-api: `npx next build` — /api/scan + /api/verify-receipt 成功

## 2026-03-08 セッション: CORS修正 + Web動作確認

### 修正内容
1. **`corsJson` 関数の致命的バグ修正** — 自身を再帰呼び出ししていた → `NextResponse.json` に修正
2. **ステータスコード形式修正** — `{ status: 500 }` オブジェクト → `500` 数値（2箇所）
3. **ポート競合の解決** — ポート3000は別アプリ（sales-agent-web）が占有していたため、japandoc-apiをポート3001で起動するよう変更
   - `japandoc-ai/.env.local`: `EXPO_PUBLIC_API_URL=http://localhost:3001`

### 動作確認結果（2026-03-08）
- ✅ ギャラリーから日本語画像を選択 → Claude Vision API で実データ解析 → 結果表示 **成功**
- ⚠️ **精度に課題あり** — 翻訳・解析の正確性に改善余地
- ⚠️ **速度に課題あり** — レスポンス時間が遅い（画像base64送信 + Claude Vision処理）

### 今後の改善候補（精度・速度）
| 課題 | 考えられる対策 |
|------|---------------|
| 精度 | システムプロンプトの改善、カテゴリ別プロンプトの精緻化、few-shot例の追加 |
| 精度 | モデルアップグレード（claude-sonnet → claude-opus 等、コスト増） |
| 速度 | 画像圧縮の最適化（解像度・品質の調整で送信データ量削減） |
| 速度 | ストリーミングレスポンス対応（部分結果を先に表示） |
| 速度 | カテゴリ自動再検出の2回目API呼び出しをスキップ（categoryHint指定時） |
| 速度 | claude-haiku への切り替え（精度とのトレードオフ） |
