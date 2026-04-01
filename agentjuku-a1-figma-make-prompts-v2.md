# agentjuku — Figma Make プロンプト集 v2

## 使い方

### Step 1: Figma Makeでデザイン生成
1. Figmaで新規ファイル「agentjuku-design」を作成
2. Figma Make（右下の星アイコン）を開く
3. 下記のプロンプトを **1ページずつ** 貼って生成
4. 気に入らなければ再生成。気に入ったら「Copy design」でキャンバスに配置
5. 全6ページ分を繰り返す

### Step 2: プロトタイプ接続（全ページ生成後）
1. Figmaの「Prototype」タブに切替
2. 下記「プロトタイプ接続マップ」に従ってページ間のリンクを設定
3. 右上「Present」ボタンでプロトタイプを確認

### Step 3: Claude Codeで上書き実装
各フレームのURLをClaude Codeに渡して既存コードを上書き（別プロンプト）

---

## 共通コンテキスト

**以下を全プロンプトの先頭にコピペしてください。**

```
Context for all pages:

agentjuku (エージェント塾) is a free browser-based developer tool for creating and validating A2A (Agent-to-Agent) protocol Agent Cards. An Agent Card is a JSON file that declares an AI agent's name, capabilities, skills, and connection info.

Target users: Japanese software developers and AI engineers aged 25-45 who build multi-agent systems. They are comfortable with JSON, APIs, and CLI tools. They value speed, precision, and utility over decoration.

Brand: "juku" means cram school in Japanese — focused, knowledgeable, efficient. The brand feels like a well-organized craftsman's workshop. Technical authority with warmth. NOT cold enterprise SaaS, NOT playful startup.

Privacy: All processing happens in the browser. No data is sent to any server. No login required.

Design direction: Must feel distinctly crafted and intentional. Avoid generic AI-generated aesthetics — no Inter/Roboto fonts, no purple gradients, no glassmorphism, no uniform rounded corners with drop shadows. Think Stripe documentation meets Japanese stationery design.

Desktop width: 1440px
```

---

## Page 1: Generator画面（メインツール）

共通コンテキストの後に続けて:

```
Design a desktop web application page at 1440px width for an "Agent Card Generator" tool.

This is the main tool page where developers build an A2A Agent Card JSON through a guided form.

Layout — 3 columns:
- Left sidebar (~130px wide): Vertical step navigation listing 6 steps: "Basic Info", "Provider", "Interfaces", "Capabilities", "I/O Modes", "Skills". Show step 1 as completed (checkmark), step 2 as active/current, steps 3-6 as upcoming. Include a segmented progress indicator at the bottom showing 2 of 6 completed.
- Center area (flexible width): The active form step content. Show "Skills" step as an example — it contains a card with form fields for skill ID (monospace font), skill name, description (multiline), and tags (as small dark chips). Below the card, a dashed "add skill" button. At the bottom, back/next navigation buttons.
- Right panel (~200px wide, dark background): Live JSON preview that updates as users fill the form. Show syntax-highlighted JSON with colored keys, string values, and a small validation status indicator at the bottom (green dot + "valid").

Top header bar spanning full width:
- Left: Small square logo mark + "agentjuku" wordmark + breadcrumb showing "/ generator"
- Center-right: A search placeholder styled like Cmd+K command palette
- Far right: "copy" button (outlined) + ".json" download button (filled dark)

Above the header: A thin 2px accent line in a warm red tone.

Below the header, in the center column top area: Pill-shaped template preset buttons — "Booking" (selected/dark), "Support", "Sales", "Analytics", "Blank" — and a GUI/Code toggle switch.

The form fields should use underline-style or minimal bordered inputs. Labels should be in a small monospace font. The overall feel should be information-dense but well-organized, like Stripe's API documentation.

Include real, realistic content — not lorem ipsum. Use Japanese text for the agent name and description (e.g., "予約管理" for a booking skill).

Make it a complete, production-ready looking interface — not a wireframe.
```

---

## Page 2: Validator画面

```
Design a desktop web application page at 1440px width for an "Agent Card Validator" tool.

Same 3-column layout shell as the Generator page (same header, same left sidebar), but:

Left sidebar: The navigation now shows a "VALIDATOR" section below the generator steps. "JSON Validation" is the active item.

Center area: A full-width code editor area where users paste JSON. Show it with some example Agent Card JSON already pasted, with line numbers on the left side. The editor has a dark or light theme consistent with the overall design.

Right panel (dark background): Instead of JSON preview, it now shows validation results in 3 categories:
- 2 Errors (red accent): Each shows a field path like "skills[0].id" and a specific error message
- 1 Warning (warm yellow accent): "Provider information recommended"
- 1 Info (blue accent): "Adding examples improves discoverability"

Each result item has a small icon, the severity label, the field path in monospace, and the message.

At the top of the right panel: A summary — "2 errors, 1 warning, 1 info" with colored dots.

The center area bottom should have a link: "← Back to Generator"

Same header as Generator page but breadcrumb shows "/ validator".

Use realistic JSON content and realistic validation messages.
```

---

## Page 3: トップページ

```
Design a desktop landing page at 1440px width for agentjuku.com — a developer tool for A2A Agent Cards.

This is NOT a typical SaaS marketing page with hero images. This is a developer tool homepage. Developers want to understand what it does and start using it within 5 seconds.

Layout from top to bottom:

1. Same header as tool pages (logo + nav)

2. Hero section (centered, generous vertical padding):
   - Small label/badge: "A2A Protocol v1.0"
   - Large heading (one line or two): Something that communicates "Create Agent Cards in your browser" in a compelling way
   - One line of supporting text about no login, no data sent, browser-only
   - Primary CTA button: "Start Building" or equivalent
   - Below CTA: Small text "No sign-up required"

3. Two tool cards side by side (not full width, centered):
   - Card 1: "Generator" — icon, title, brief description ("Create a new Agent Card with a guided form"), arrow or link
   - Card 2: "Validator" — icon, title, brief description ("Check your existing Agent Card against the spec"), arrow or link

4. Three feature highlights in a row:
   - "Private" — browser-only processing, shield icon
   - "Fast" — no sign-up, instant start, lightning icon
   - "Compliant" — A2A v1.0 spec, checkmark icon
   Each with a short one-line description.

5. A subtle section: "What is an Agent Card?" — 3-4 sentences explaining A2A protocol briefly, with a link to the blog article.

6. Footer (same as all pages)

The page should feel confident and minimal. No decorative illustrations. The content itself is the hero. Think of how Vercel.com or Linear.app present their landing pages — direct, confident, minimal.
```

---

## Page 4: ブログ記事ページ

```
Design a desktop blog article page at 1440px width for a technical article titled "A2Aエージェントカードとは？ 完全ガイド" (What is an A2A Agent Card? Complete Guide).

Same header as all other pages.

Content area: Single column, centered, max-width ~720px.

Article header:
- Title in large text
- Metadata line: "2026年3月30日 · 読了時間 8分"
- Optional: subtle separator line

Article body (show realistic content for each element type):
- Paragraph text (readable body font, comfortable line height ~1.7)
- H2 section heading: "Agent Cardの構造"
- A JSON code block with syntax highlighting (showing an Agent Card example)
- A data table with columns: "フィールド名", "型", "必須", "説明" — showing 4-5 rows of Agent Card fields
- H2 section heading: "A2A vs MCP 比較"
- A comparison table: A2A vs MCP with 4-5 comparison rows
- A callout/note box: "A2Aプロトコルは2025年にGoogleが発表したオープン標準です"
- Final paragraph with CTA: "Agent Cardを作成してみましょう → Generator"

Sidebar or bottom area:
- "Related Articles" section (can show 1-2 placeholder article links)
- CTA card: "Agent Card Generator を試す" with a button

Footer: same as all pages.

The typography should prioritize readability. Code blocks should be clearly distinguished. Tables should be clean and not cramped. The overall feel should be like Stripe's technical blog posts or MDN documentation.
```

---

## Page 5: ブログ一覧ページ

```
Design a desktop blog index page at 1440px width.

Same header as all pages.

Page title: "ブログ" or "Articles" — simple, not decorative.

Content: Centered, max-width ~800px.

Show 3 article cards in a vertical list (not a grid — the article count is small):
- Article 1: "A2Aエージェントカードとは？ 完全ガイド" — 2-line excerpt, date "2026年3月30日", read time "8分"
- Article 2: "Agent CardのJSON構造を理解する" — 2-line excerpt, date, read time
- Article 3: "A2A vs MCP: プロトコル比較" — 2-line excerpt, date, read time

Each card should be a simple horizontal layout with title, excerpt, and metadata. Subtle hover state. Link to the full article.

Keep it extremely clean and minimal. No featured images, no categories, no tags. Just titles, excerpts, and dates.

Footer: same as all pages.
```

---

## Page 6: 共通コンポーネント

```
Design a component sheet at 1440px width showing the design system components for agentjuku.

This is NOT a page — it's a reference sheet of reusable UI components.

Show each component with its variants on a clean background:

1. Header: Full-width, showing logo + nav + action buttons. Show two states:
   - Tool page header (with copy/download buttons)
   - Content page header (without action buttons)

2. Footer: Full-width. Contains copyright "© 2026 agentjuku", privacy statement with shield icon: "All data stays in your browser", and "A2A Protocol v1.0" badge.

3. Buttons: Show variants —
   - Primary (dark filled)
   - Secondary (outlined)
   - Accent (warm red filled, for CTAs like download)
   - Ghost (text only)
   Each in default, hover, and disabled states.

4. Form inputs: Show —
   - Text input (with label in small monospace)
   - Textarea
   - Select dropdown
   - Toggle switch (on/off)
   - Tag chips (dark, with × to remove, + to add)

5. Cards: Show —
   - Skill card (form card with fields inside)
   - Article card (for blog listing)
   - Feature card (icon + title + description)

6. Navigation: Show —
   - Step nav item: completed (checkmark), active (highlighted), upcoming (dimmed)
   - Template preset pills: selected and unselected states

7. Validation indicators: Show —
   - Error (red dot + message)
   - Warning (yellow dot + message)
   - Info (blue dot + message)
   - Valid status (green dot + "valid")

8. Code block: A small JSON snippet with syntax highlighting on dark background.

Label each component group clearly. This sheet will be used as the source of truth for consistent implementation.
```

---

## プロトタイプ接続マップ

全ページをFigmaキャンバスに配置した後、以下のリンクを「Prototype」モードで設定:

```
Landing Page (トップ)
├── "Start Building" ボタン → Generator画面
├── "Generator" カード → Generator画面
├── "Validator" カード → Validator画面
├── ヘッダー "Blog" リンク → ブログ一覧
└── "What is Agent Card?" リンク → ブログ記事

Generator画面
├── 左ナビ "Validator" → Validator画面
├── ヘッダー "agentjuku" ロゴ → Landing Page
└── ヘッダー "Blog" → ブログ一覧

Validator画面
├── 左ナビ Generator各ステップ → Generator画面
├── "← Back to Generator" → Generator画面
├── ヘッダー "agentjuku" ロゴ → Landing Page
└── ヘッダー "Blog" → ブログ一覧

ブログ一覧
├── 各記事カード → ブログ記事
├── ヘッダー "agentjuku" ロゴ → Landing Page
└── ヘッダー "Tools" → Generator画面

ブログ記事
├── "Generator を試す" CTA → Generator画面
├── ヘッダー "agentjuku" ロゴ → Landing Page
├── ヘッダー "Blog" → ブログ一覧
└── ヘッダー "Tools" → Generator画面
```

### Figmaでのプロトタイプ設定手順

1. 右サイドバーの「Prototype」タブをクリック
2. フレーム内のボタンやリンク要素を選択
3. 右側に表示される「+」（interaction）をドラッグして遷移先フレームに接続
4. Trigger: "On click" / Action: "Navigate to" / Animation: "Smart animate" or "Instant"
5. 右上の「▶ Present」ボタンでプロトタイプを確認

---

## 生成順序（推奨）

1. **Page 6: コンポーネントシート**（先にデザインシステムを確定）
2. **Page 1: Generator画面**（メインツール、最重要）
3. **Page 2: Validator画面**（Generatorのバリエーション）
4. **Page 3: トップページ**（ランディング）
5. **Page 4: ブログ記事**
6. **Page 5: ブログ一覧**

コンポーネントシートを先に生成し、そのデザイントーンに合わせて各ページを生成すると統一感が出る。

---

## 生成後のチェックリスト

- [ ] 全ページでHeader/Footerのデザインが統一されている
- [ ] Generator画面の3カラムが明確に区別できる
- [ ] 右カラムのダークJSONパネルが読みやすい
- [ ] フォームフィールドのスタイルが統一されている
- [ ] ボタンのスタイルが統一されている（Primary/Secondary/Accent）
- [ ] プロトタイプの全リンクが正しく動作する
- [ ] 「▶ Present」で全画面を遷移して確認した
- [ ] AI生成っぽさが排除されている（紫グラデ、blur、均一丸角等）
- [ ] 開発者ツールとしての信頼感がある
- [ ] 日本語テキストが自然（不自然な翻訳調でない）
