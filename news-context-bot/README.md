# 文脈の翻訳家 - ニュース自動解説システム

日本と海外のニュースの「温度差」を可視化し、独自の視点で解説する記事を自動生成するシステムです。

## 概要

- **目的**: 国内外のニュース論調の差を分析し、note用記事を自動生成
- **Phase 1**: ローカル環境で実行、Markdown出力、手動投稿
- **技術スタック**: Next.js 14 (App Router) + TypeScript + Supabase + Claude API

## 主な機能

1. **ニュース収集**: NewsAPI + RSS（NHK、Reuters、BBC、NYT等）
2. **トピック抽出**: キーワードベースのクラスタリング
3. **温度差スコア計算**: 国内外の報道量の差を数値化
4. **記事自動生成**: Claude APIで「文脈の翻訳家」ペルソナを適用
5. **Markdown保存**: outputs/ディレクトリに記事を保存

## セットアップ

### 1. 依存関係のインストール

```bash
cd news-context-bot
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定してください：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# NewsAPI（オプション）
NEWSAPI_KEY=your-newsapi-key
```

#### 環境変数の取得方法

##### Supabase
1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. Settings > API から以下をコピー:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

##### Claude API
1. [Anthropic Console](https://console.anthropic.com/)でAPIキーを発行
2. コピーして `ANTHROPIC_API_KEY` に設定

##### NewsAPI（オプション）
1. [NewsAPI](https://newsapi.org/)で無料アカウント登録
2. APIキーをコピーして `NEWSAPI_KEY` に設定
3. **注意**: 無料プランは100リクエスト/日まで

### 3. Supabaseテーブル作成

Supabaseダッシュボードで、`supabase-schema.sql` を実行してください。

1. Supabaseダッシュボード > SQL Editor
2. `supabase-schema.sql` の内容をコピー&ペースト
3. 実行（Run）

### 4. 開発サーバー起動

```bash
npm run dev
```

サーバーが `http://localhost:3000` で起動します。

## 使い方

### 記事を自動生成する

ブラウザで以下のURLにアクセスしてください：

```
http://localhost:3000/api/manual/trigger-generate
```

処理が開始され、以下の流れで記事が生成されます：

1. ニュース収集（NewsAPI + RSS）
2. トピック抽出（クラスタリング + 温度差スコア計算）
3. 記事生成（Claude API）
4. Supabaseに保存
5. `outputs/` ディレクトリにMarkdownファイル保存

### 生成された記事を確認

`outputs/` ディレクトリ内に以下の形式でMarkdownファイルが保存されます：

```
outputs/
├── 20250215_0700_AI規制.md
└── 20250215_0705_円安.md
```

ファイルを開いて内容を確認し、noteにコピー&ペーストしてください。

## ディレクトリ構成

```
news-context-bot/
├── pages/
│   └── api/
│       └── manual/
│           └── trigger-generate.ts    # 手動実行API
├── lib/
│   ├── news-sources/                  # ニュース収集
│   │   ├── newsapi.ts
│   │   ├── rss-feeds.ts
│   │   └── types.ts
│   ├── analysis/                      # トピック抽出・温度差計算
│   │   ├── clustering.ts
│   │   ├── gap-calculator.ts
│   │   └── topic-extractor.ts
│   ├── generation/                    # 記事生成
│   │   ├── claude-client.ts
│   │   ├── article-generator.ts
│   │   └── tag-selector.ts
│   ├── storage/                       # データ保存
│   │   ├── supabase.ts
│   │   ├── github-backup.ts
│   │   └── database.types.ts
│   └── prompts/                       # ペルソナ定義
│       └── persona.ts
├── outputs/                           # 生成記事（Markdown）
├── supabase-schema.sql                # Supabaseテーブル定義
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local                         # 環境変数（作成が必要）
```

## トラブルシューティング

### ニュース記事が取得できない

- NewsAPIキーが設定されているか確認（`.env.local`）
- RSSフィードが正常にアクセスできるか確認（企業ファイアウォール等でブロックされていないか）

### Claude APIエラー

- `ANTHROPIC_API_KEY` が正しく設定されているか確認
- APIキーの利用制限を確認（課金設定が必要な場合があります）

### Supabase接続エラー

- `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` が正しいか確認
- Supabaseプロジェクトが有効化されているか確認

### トピックが抽出できない

- 収集された記事数が少ない可能性があります（最低20件程度必要）
- キーワードが一致しない場合、クラスタリングできません
- 時間を置いてから再実行してください

## API制限・コスト

### NewsAPI（無料プラン）
- 100リクエスト/日
- 1日2回実行 × 6カテゴリ = 12リクエスト/日（余裕あり）

### Claude API
- 1記事あたり約 $0.12（Claude Sonnet 4）
- 1日2本 × 30日 = 月 $7.2

### Supabase（無料プラン）
- 500MB ストレージ
- 50,000 月間アクティブユーザー
- Phase 1では十分

## Phase 2への拡張予定

- Vercel Cron設定（自動実行）
- X（Twitter）API連携（自動投稿）
- エラー通知（Discord Webhook）

## ライセンス

MIT License

## サポート

問題が発生した場合は、以下を確認してください：

1. コンソールログ（ターミナル）
2. ブラウザの開発者ツール（Network タブ）
3. Supabaseダッシュボード（Table Editor）

---

**開発者**: 文脈の翻訳家 Bot
**作成日**: 2025-02-15
**バージョン**: 1.0.0 (Phase 1)
