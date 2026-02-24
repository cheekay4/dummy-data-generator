# セットアップガイド

このガイドでは、「文脈の翻訳家」を初めて起動するまでの手順を説明します。

## ステップ1: 依存関係のインストール

プロジェクトディレクトリで以下を実行してください：

```bash
cd news-context-bot
npm install
```

## ステップ2: Supabaseプロジェクトの作成

### 2-1. アカウント作成

1. [Supabase](https://supabase.com/)にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 2-2. プロジェクト作成

1. 「New Project」をクリック
2. 以下を入力：
   - **Project name**: `news-context-bot`（任意）
   - **Database Password**: 強力なパスワードを設定（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択
3. 「Create new project」をクリック（数分かかります）

### 2-3. APIキーの取得

1. 左メニューの「Settings」→「API」を選択
2. 以下をコピー：
   - **Project URL** → `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` に設定
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` に設定

### 2-4. テーブル作成

1. 左メニューの「SQL Editor」を選択
2. `supabase-schema.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリック
4. 「Success」と表示されればOK

確認方法:
- 左メニューの「Table Editor」で、以下のテーブルが作成されていることを確認
  - `news_articles`
  - `topics`
  - `generated_articles`

## ステップ3: Claude API キーの取得

### 3-1. Anthropicアカウント作成

1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. サインアップ（メールアドレスまたはGoogleアカウント）

### 3-2. APIキーの発行

1. コンソールにログイン後、「API Keys」を選択
2. 「Create Key」をクリック
3. 名前を入力（例: `news-context-bot`）
4. 生成されたキーをコピー → `.env.local` の `ANTHROPIC_API_KEY` に設定

### 3-3. 課金設定（重要）

**注意**: Claude APIは従量課金制です。初回は$5-$10程度の課金をおすすめします。

1. 左メニューの「Billing」→「Add Credits」
2. クレジットカードを登録
3. $5-$10をチャージ

コスト目安:
- 1記事生成: 約 $0.12
- 1日2本 × 30日 = 月 $7.2

## ステップ4: NewsAPI キー取得（オプション）

RSSフィードのみでも動作しますが、NewsAPIを使うとより多くの記事を収集できます。

### 4-1. アカウント作成

1. [NewsAPI](https://newsapi.org/)にアクセス
2. 「Get API Key」をクリック
3. 情報を入力してサインアップ

### 4-2. APIキーの取得

1. ダッシュボードに表示されたAPIキーをコピー
2. `.env.local` の `NEWSAPI_KEY` に設定

**注意**: 無料プランは100リクエスト/日まで

## ステップ5: 環境変数ファイルの作成

プロジェクトルートに `.env.local` ファイルを作成してください：

```bash
# news-context-bot/ ディレクトリで実行
cp .env.local.example .env.local
```

次に、`.env.local` を開いて、以下を設定：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# NewsAPI（オプション）
NEWSAPI_KEY=your-newsapi-key-here
```

## ステップ6: 開発サーバーの起動

```bash
npm run dev
```

以下のような出力が表示されればOK：

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## ステップ7: 動作確認

### 7-1. UIからテスト

ブラウザで `http://localhost:3000` を開き、「記事を生成する」ボタンをクリック。

### 7-2. API直接実行

```bash
curl http://localhost:3000/api/manual/trigger-generate
```

または、ブラウザで直接アクセス：
```
http://localhost:3000/api/manual/trigger-generate
```

### 7-3. 結果確認

- `outputs/` ディレクトリに `.md` ファイルが生成される
- Supabaseの「Table Editor」でデータが保存されていることを確認

## トラブルシューティング

### エラー: "Supabase環境変数が設定されていません"

→ `.env.local` が正しく作成されているか確認
→ サーバーを再起動（`Ctrl+C` → `npm run dev`）

### エラー: "ANTHROPIC_API_KEY が設定されていません"

→ `.env.local` にAPIキーが設定されているか確認
→ APIキーが有効か確認（Anthropic Consoleで確認）

### ニュース記事が取得できない

→ インターネット接続を確認
→ ファイアウォールでRSSフィードがブロックされていないか確認

### TypeError: Cannot read property '...' of undefined

→ `npm install` が正しく完了しているか確認
→ `node_modules` を削除して再インストール:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 次のステップ

- 生成された記事を確認してnoteに投稿
- Supabaseのデータを確認
- カスタマイズ（ペルソナ定義、RSSフィード追加等）

---

セットアップでお困りの場合は、README.mdのトラブルシューティングセクションを確認してください。
