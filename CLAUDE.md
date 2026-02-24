# tools24.jp — Claude Code 運用ルール

## プロジェクト概要

tools24.jp の開発ルート。複数の Next.js プロジェクトを含むモノレポ構成。

```
my-first-project/
├── kakutei-tools/     # 確定申告かんたんツール集（tools24.jp にデプロイ済み）
├── masking-tools/     # 個人情報マスキングツール（開発中）
├── tools24/           # 開発者ツール群（開発中）
├── character-counter/ # 文字数カウンター（スタンドアロン）
├── dummy-data-generator/
├── news-context-bot/
├── STATUS.md          # ← プロジェクト状態のSST（毎セッション読むこと）
└── CLAUDE.md          # ← このファイル
```

---

## セッション開始時のルール

1. **STATUS.md を必ず読む**
   `Read /c/Users/cheek/Desktop/my-first-project/STATUS.md`
   現在のデプロイ状況・実装状況・収益化ステータスを把握してから作業を開始する。

---

## デプロイ時のルール

2. **URL・ステータスを即 STATUS.md に反映する**
   Vercel デプロイが完了したら、STATUS.md のセクション1（デプロイ済みツール一覧）を即時更新する。
   - URL（カスタムドメインまたは `.vercel.app`）
   - ステータスを `🔧 未デプロイ` → `✅ LIVE` に変更
   - Vercel Project ID（`.vercel/project.json` から取得）

---

## セッション終了時のルール

3. **変更履歴に1行追記する**
   STATUS.md のセクション7（変更履歴）の先頭行に追記する。
   形式: `| YYYY-MM-DD | 作業内容の1行要約 | Claude Code |`

---

## 各サブプロジェクトの CLAUDE.md

各プロジェクトディレクトリにも個別の CLAUDE.md がある場合はそちらも参照する。
- `kakutei-tools/CLAUDE.md` — 確定申告ツールの設計原則・UIルール・SEO要件
