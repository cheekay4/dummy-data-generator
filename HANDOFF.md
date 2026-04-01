# agentjuku.com 引き継ぎプロンプト

## 新セッションの最初に貼るプロンプト

```
agentjuku.com（エージェント塾）の開発を引き継いでください。

## プロジェクト場所
C:\Users\cheek\agentjuku

## 完了済みの作業

### Phase 1-A/B: コア実装（完了）
- Next.js 14 (App Router, SSG `output: 'export'`)
- TypeScript strict, Tailwind v3, Zod v4, React Hook Form v7
- 和色パレット（shu朱/sumi墨/kinari生成り/washi和紙/fude筆）
- Sora + JetBrains Mono ローカルフォント（CSP font-src 'self'）
- G1 Generator: 6ステップGUIフォーム + 5プリセット + GUI/Codeトグル + JSONライブプレビュー
- G2 Validator: JSON貼り付け → エラー/警告/情報の3段階表示
- ブログ: /blog/what-is-a2a-agent-card（解説記事）+ 一覧ページ
- SEO: OG tags, JSON-LD, canonical, robots.txt, sitemap.xml
- セキュリティ: CSP connect-src 'none', unsafe-eval排除, vercel.json二重防御

### A0: UI/ロジック分離リファクタ（完了）
全UIコンポーネントがpropsのみで動作する形に分離済み。
ロジック（hooks/、lib/）とUI（_components/、components/）が物理的に分離。

Figma上書き対象（UIコンポーネント）:
- src/app/(tools)/tools/agent-card/_components/ 内の全 .tsx
- src/components/layout/Header.tsx, Footer.tsx
- src/components/ui/ 内の全 .tsx

上書き禁止（ロジック層）:
- src/hooks/ 内の全 .ts
- src/lib/ 内の全 .ts
- src/types/agent-card.ts

### A1途中: ランディングページ + Header/Footer更新（完了）
- src/app/page.tsx: リダイレクトからフルランディングページに変更済み
  - Hero（「Agent Card を、ブラウザだけで。」）
  - 2ツールカード（Generator / Validator）
  - 3特徴（プライベート / 即座に開始 / A2A準拠）
  - Agent Cardとは セクション
- Header: Tools / Blog ナビリンク追加済み
- Footer: Shield + A2A Protocol v1.0バッジ + リンク群追加済み

## 次にやること（A1の残り）

### 参照ファイル
`C:\Users\cheek\agentjuku\agentjuku-a1-figma-make-prompts-v2.md` にデザインスペックあり。

### 残タスク
1. **Figma MCPでデザイン確認・適用**: figma MCP (`claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp`) が設定済み。Figma Make で生成したデザインがあれば、そのフレームURLを使ってUIコンポーネントを上書き。
2. **Generator/Validatorのデザイン細部調整**: プロンプト集のPage 1/Page 2の指示に合わせて微調整
3. **Vercelデプロイ**: `npm run build` は成功済み。あとはVercelに接続してデプロイ
4. **STATUS.md更新**: デプロイ後にルートリポジトリの STATUS.md に反映

## 技術詳細
- 41ファイル構成（UI 19 / Logic 13 / Page 9）
- ビルド: `npm run build` → 成功（5ページSSG export）
- セキュリティ: fetch/XHR/eval検出ゼロ
- CSP: connect-src 'none'（外部通信完全ブロック）
- Zod v4 + @hookform/resolvers v5 互換性: `as any` ワークアラウンドで動作
- CodeMirror 6: next/dynamic ssr:false で動的読込
```

## ファイル構造
```
src/
├── app/
│   ├── layout.tsx               # ルート（CSP meta, JSON-LD, フォント）
│   ├── page.tsx                 # ランディングページ ← A1で更新済み
│   ├── not-found.tsx
│   ├── globals.css              # @font-face, CM overrides
│   ├── (tools)/
│   │   ├── layout.tsx           # Header + Footer シェル
│   │   └── tools/agent-card/
│   │       ├── page.tsx         # SEO metadata
│   │       └── _components/     # UI（Figma上書き対象）
│   │           ├── AgentCardWorkspace.tsx  # 接着剤（hooks呼出→UIにprops渡し）
│   │           ├── GeneratorForm.tsx
│   │           ├── ValidatorPanel.tsx
│   │           ├── SkillsFieldArray.tsx
│   │           ├── InterfacesFieldArray.tsx
│   │           ├── JsonPreview.tsx
│   │           ├── CodeEditor.tsx
│   │           ├── ExportActions.tsx
│   │           ├── PresetSelector.tsx
│   │           └── StepNav.tsx
│   └── (marketing)/
│       └── blog/
│           ├── page.tsx
│           └── what-is-a2a-agent-card/page.tsx
├── components/
│   ├── layout/ (Header.tsx, Footer.tsx)
│   └── ui/ (Button, Input, Textarea, Select, Tabs, Toggle, CopyButton)
├── hooks/                       # ロジック（上書き禁止）
│   ├── useAgentCardForm.ts
│   ├── useWorkspaceState.ts
│   ├── useValidator.ts
│   ├── useFieldArrays.ts
│   ├── useClipboard.ts
│   ├── useDebounce.ts
│   └── useDownload.ts
├── lib/                         # ロジック（上書き禁止）
│   ├── schema.ts (Zod v4 A2A Agent Card)
│   ├── constants.ts
│   ├── generator.ts
│   ├── presets.ts (5テンプレート)
│   ├── validator.ts
│   └── json-tokenizer.ts
└── types/
    └── agent-card.ts (全props型定義)
```
