# tools24.jp — AI開発組織 運用ルール

<!-- 用途: Claude Codeの行動規範。200行以下厳守。詳細は .claude/rules/ に分割 -->

## プロジェクト概要

tools24.jp モノレポ。複数SaaS（確定申告ツール・MsgScore・MyReplyTone・ScanLingo・hikitsugi-ai等）を1人+AI組織で並行開発・運営。

```
my-first-project/
├── kakutei-tools/          # 確定申告ツール集（tools24.jp）
├── msg-scorer/             # MsgScore（メッセージスコアリング）
├── review-reply-ai/        # MyReplyTone（AI口コミ返信）
├── japandoc-ai/            # ScanLingo（書類スキャンアプリ）
├── japandoc-api/           # ScanLingo API
├── hikitsugi-ai/           # 引き継ぎAI
├── sales-agent/            # 営業自動化CLI
├── sales-agent-web/        # 営業ダッシュボード
├── demo-forge/             # DemoForge（デモ動画自動生成）
├── STATUS.md               # デプロイ状況SST
└── CLAUDE.md               # このファイル
```

## チーム構成（1人AI組織）

| 役割 | モデル | 切り替え | 用途 |
|------|--------|----------|------|
| 設計判断・レビュー・複雑なリファクタ | Opus 4.6 | `/model opus` | 全体の10-20% |
| 実装・テスト・ドキュメント | Sonnet 4.6 | デフォルト | 全体の80-90% |
| 軽量サブタスク | Haiku 4.5 | サブエージェント指定 | 分類・FAQ等 |

## セッション開始ルール

1. **STATUS.md を必ず読む** — デプロイ状況・実装進捗を把握してから作業開始
2. 各サブプロジェクトの CLAUDE.md があれば参照（例: `kakutei-tools/CLAUDE.md`）

## ビルド・テストコマンド

```bash
# 各サブプロジェクト共通
npm run build          # ビルド（デプロイ前に必ず実行）
npm run dev            # 開発サーバー
npm run lint           # ESLint
npm run test           # テスト（Vitest）
```

- テスト失敗時は必ず修正してからコミット
- `npm run build` 成功を確認してからデプロイ

## 禁止事項

- `.env` / `.env.local` の内容を出力・コミットしない
- `APIkeys.txt` を絶対にコミットしない
- production DB への直接操作禁止（Supabase Dashboard経由のみ）
- 1つのコミットに無関係な変更を混ぜない
- `node_modules/` / `.next/` をコミットしない
- `git reset --hard` はWindows DLLロックで失敗する → `git update-ref` を使う

## コーディング規約

- TypeScript strict mode 必須
- 1関数30行以下、1関数1責務
- エラーハンドリングは具体的なエラー型を使用
- API認証は各プロジェクトの auth middleware を必ず通す
- Stripe webhook のシグネチャ検証を省略しない

## STATUS.md 読み書きルール

- **デプロイ時**: URL・ステータスを即反映（`🔧 未デプロイ` → `✅ LIVE`）
- **セッション終了時**: 変更履歴の先頭行に追記
  - 形式: `| YYYY-MM-DD | 作業内容の1行要約 | Claude Code |`

## コスト最適化

- デフォルトモデル: `ANTHROPIC_MODEL=claude-sonnet-4-6`
- Opus切り替え: `/model opus`（設計判断・セキュリティ監査時のみ）
- 早期コンパクション: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=60`
- コンテキスト50-70%で手動 `/compact` 推奨
- タスク切り替え時は `/clear` でコンテキストリセット

## 詳細ルール（.claude/rules/）

- `code-quality.md` — lint・テスト・型安全
- `commit.md` — Conventional Commits 規約
- `security.md` — シークレット管理・依存関係チェック
- `deploy.md` — Vercelデプロイ手順・STATUS.md更新

## 技術スタック共通

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| 状態管理 | Zustand v5 |
| UI | shadcn/ui + lucide-react |
| DB/認証 | Supabase |
| 決済 | Stripe |
| AI | Claude API (claude-sonnet-4-6) |
| デプロイ | Vercel |
| DNS | Cloudflare / さくらインターネット |
