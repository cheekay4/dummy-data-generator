# sales-agent

MsgScore の営業自動化エージェント。
企業サイトをスクレイピングしてリードを収集し、Claude API でパーソナライズされた営業メールを生成・送信する CLI ツール。

## 特徴

- **特定電子メール法準拠**: List-Unsubscribe ヘッダー + 送信者情報フッター自動付与
- **HITL（Human-in-the-Loop）**: 全メールは人間がレビューして承認してから送信
- **安全装置**: 日次上限20通・最小60秒インターバル・ICP スコアフィルタ
- **Phase 2 返信対応**: 受信返信を意図分類 → AI ドラフト生成 → 人間承認 → 返信送信

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
npx playwright install chromium
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集して以下を設定:

| 変数名 | 説明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API キー |
| `GMAIL_CLIENT_ID` | Google Cloud OAuth2 クライアント ID |
| `GMAIL_CLIENT_SECRET` | OAuth2 クライアントシークレット |
| `GMAIL_REFRESH_TOKEN` | Gmail リフレッシュトークン（auth コマンドで取得） |
| `SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role キー |
| `SENDER_NAME` | 送信者名（例: Riku） |
| `SENDER_EMAIL` | 送信元メールアドレス |

### 3. Google Cloud 設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. Gmail API を有効化
3. OAuth 2.0 クライアント ID を作成（アプリケーションの種類: デスクトップ）
4. `credentials/` に `client_secret.json` を配置

### 4. Gmail 認証

```bash
node dist/index.js auth
# → 表示された URL をブラウザで開いて認証
node dist/index.js auth:callback <取得したcode>
# → 表示された GMAIL_REFRESH_TOKEN を .env に設定
```

### 5. Supabase テーブル作成

```bash
# Supabase ダッシュボード > SQL Editor で実行
cat supabase/schema.sql
```

### 6. ビルド

```bash
npm run build
```

## 使い方

### Phase 1: リード収集〜メール送信

```bash
# ① リードを収集（URL をスクレイピング）
node dist/index.js scrape https://example.com --depth 1

# ② 分析 & メールドラフト生成
node dist/index.js generate --limit 20 --min-icp 40

# ③ ドラフトをレビュー（対話的）
node dist/index.js review

# ④ 承認済みメールを送信
node dist/index.js send

# ① + ② をまとめて実行
node dist/index.js pipeline --url https://example.com --depth 1
```

### Phase 2: 返信監視・対応

```bash
# ① 受信トレイをチェック → AI 分類 & ドラフト生成
node dist/index.js replies:monitor

# ② AI 返信ドラフトをレビューして送信
node dist/index.js replies:review
```

### 統計確認

```bash
node dist/index.js stats --days 14
```

## アーキテクチャ

```
src/
├── index.ts                    # CLI エントリポイント（commander）
├── config/
│   ├── env.ts                  # Zod による環境変数バリデーション
│   └── constants.ts            # 安全装置・モデル設定
├── types/index.ts              # 全型定義
├── services/
│   ├── scraper.ts              # Playwright スクレイピング + robots.txt チェック
│   ├── email-extractor.ts      # メールアドレス抽出 + MX バリデーション
│   ├── industry-analyzer.ts    # Claude による業界・ICP 分析
│   ├── message-generator.ts    # Claude によるパーソナライズメール生成
│   ├── gmail.ts                # Gmail OAuth2 + 送受信
│   ├── lead-db.ts              # Supabase CRUD
│   ├── reply-monitor.ts        # 返信監視（Phase 2）
│   ├── intent-classifier.ts    # 返信意図分類（Phase 2）
│   ├── researcher.ts           # ナレッジベース検索（Phase 2）
│   └── reply-generator.ts      # 返信ドラフト生成（Phase 2）
├── templates/
│   ├── base.ts                 # 特定電子メール法フッター
│   └── industries/             # 業態別フォールバックテンプレート
└── commands/
    ├── scrape.ts
    ├── generate.ts
    ├── review.ts
    ├── send.ts
    ├── pipeline.ts
    └── replies.ts
```

## 安全装置

| 項目 | 値 | 設定箇所 |
|------|-----|---------|
| 日次送信上限 | 20通 | `SAFETY.DAILY_SEND_LIMIT` |
| 最小送信間隔 | 60秒 | `SAFETY.MIN_SEND_INTERVAL_SEC` |
| バッチ上限 | 5通 | `SAFETY.MAX_BATCH_SIZE` |
| ICP スコア閾値 | 40点 | `SAFETY.ICP_SCORE_THRESHOLD` |
| 人間承認 | 必須 | `SAFETY.REQUIRE_HUMAN_APPROVAL` |

## ライセンス

Private — Riku 個人利用
