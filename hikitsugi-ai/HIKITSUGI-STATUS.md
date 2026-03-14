# hikitsugi-ai 開発ログ

## プロジェクト概要

- **URL**: https://hikitsugi-ai.vercel.app
- **Vercel Project**: cheekays-projects/hikitsugi-ai
- **ディレクトリ**: `hikitsugi-ai/`
- **スタック**: Next.js 16.1.6 + Tailwind v4 + Zustand v5 + Framer Motion v12 + Claude API (claude-sonnet-4-6)

---

## フェーズ進捗

### Phase 1-A: UI基盤 ✅ 完了（2026-03-05）

実装済みファイル:
- `src/app/globals.css` — Tailwind v4 + CSS vars + Noto Sans JP
- `src/lib/types.ts` — 全型定義
- `src/lib/templates.ts` — 4業種テンプレート（飲食店/美容室/士業事務所/汎用）+ PHASE_LABELS
- `src/lib/motion.ts` — Framer Motion共有variants
- `src/stores/interviewStore.ts` — Zustand v5 flat store
- `src/app/layout.tsx` + `ClientLayout.tsx` — Header/Footer条件分岐
- `src/components/layout/Header.tsx` / `Footer.tsx`
- LPセクション8本（Hero/Problems/Steps/InputMethods/TemplateShowcase/Pricing/FAQ/CTA）
- `src/app/interview/new/page.tsx` — テンプレート選択
- `src/app/interview/[id]/page.tsx` — チャットUI
- インタビューコンポーネント5本（ChatBubble/KnowledgeBadge/ProgressBar/KnowledgeSidebar/InputArea）
- SEO: robots.ts, sitemap.ts, icon.tsx, apple-icon.tsx, manifest.json
- 静的ページ: /pricing, /privacy, /terms, /tokushoho

### Phase 1-B: AI連携 ✅ 完了（2026-03-06）

- `src/app/api/chat/route.ts` — Claude AIインタビュー（XMLメタデータ解析・フェーズ自動進行）
- `src/app/api/generate/route.ts` — マニュアル生成（ストリーミング・max_tokens 4096）
- `src/app/manual/[id]/page.tsx` — ReactMarkdown表示 + 目次 + 編集 + MDダウンロード
- `src/components/interview/GeneratingOverlay.tsx` — 生成中アニメーションオーバーレイ

### Phase 1-B バグ修正 + UI改善（2026-03-06）

**バグ修正:**
- インタビューが始まらない → `new/page.tsx`の`handleStart`で`reset()`を追加
- チャット中央揃えでない → `max-w-2xl mx-auto`でセンタリング

**UI/UX改善（デザイナーレビュー相当）:**
- グローバルHeader非表示（インタビュー/マニュアルページ） → `ClientLayout.tsx`で`usePathname`条件分岐
- チャット文字 13px → 14px（text-sm）
- バブルpadding px-4 py-3 → px-5 py-3.5
- メッセージ間隔 space-y-4 → space-y-5
- ユーザーバブル色 neutral-800 → neutral-700
- ナレッジバッジ slate灰 → emeraldグリーン + バブル下に移動 + CheckCircle2アイコン
- 進捗バー h-1 → h-1.5、ラベル 9px → 11px
- disabled「録音アップロード」「その場で録音」リンクを削除
- モバイルFAB → InputArea上のインラインバーに変更
- フェーズ遷移時にemeraldトースト表示（「○○のヒアリング完了」）
- 「マニュアル生成」ボタン → Phase 3以降のみ表示
- Zustand storeに`phaseJustAdvanced`/`previousPhaseName`追加
- KnowledgeSidebar: `desktopOnly`/`mobileOnly` props化（ダブルレンダリング解消）

---

## 環境変数

| キー | 用途 | 設定場所 |
|------|------|---------|
| `ANTHROPIC_API_KEY` | Claude API | Vercel Production ✅ |
| その他（Supabase, Stripe等） | Phase 1-C以降 | 未設定 |

---

## 残タスク

### Phase 1-C: 認証 + 課金 ✅ 完了（2026-03-07）

- Supabase Auth（Googleログイン + マジックリンク）
- Stripe（Pro ¥1,980/月 / Team ¥4,980/月）+ Webhook
- 利用制限（無料: マニュアル3件 / 10ターン）
- ダッシュボード（/dashboard: マニュアル一覧・ステータスバッジ）
- マニュアルDB永続化（conversation/markdown自動保存）
- 共有リンク（/share/[token]: ログイン不要閲覧）
- 設定ページ（/settings: プラン管理・Stripe Portal連携）
- PDF出力（Pro: ブラウザ印刷方式）
- テンプレート制限（無料: 汎用のみ / Pro: 全4業種）
- AuthModal（Google OAuth + マジックリンク）
- proxy.ts（認証ミドルウェア）

### Phase 1-D: 音声 + 高度機能 ✅ 完了（2026-03-14）
- 音声チャット（Web Speech API, ja-JP, SSR対応）→ VoiceRecorder.tsx + InputArea.tsx マイクボタン
- /api/transcribe: Supabase Auth認証 + Groq Whisper対応（TRANSCRIBE_PROVIDER=groq で有効化）
- GA4設定: NEXT_PUBLIC_GA_ID 環境変数で条件付き有効化
- チャットUIデザイン改善: AIバブル(bg-white/shadow)・ユーザーバブル(indigo-600)・bg-neutral-50

### Phase 1-A/B 手作業での設定 🔴 未完了（後でやる）

| 設定項目 | 内容 | 備考 |
|---------|------|------|
| カスタムドメイン | hikitsugi-ai用のドメイン取得・Vercel紐付け | 現在は vercel.app のみ |
| GA4 | `NEXT_PUBLIC_GA_ID` を Vercel環境変数に設定 | .env.local は空欄 |
| Google Search Console | サイト登録・所有権確認・sitemap送信 | GA4設定後に実施 |

### デザイン改善 🔴 TODO（後回し）
- チャット画面の見た目がまだ良くない（ユーザー指摘、2026-03-06）
- 具体的な改善点は未定義。次のデザインレビューセッションで再検討

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-03-14 | Phase 1-D完了（音声入力UI/Web Speech API・Transcribe API/Groq Whisper・GA4・チャットUIデザイン改善）Agent Teams 3体構成で実装 |
| 2026-03-07 | Phase 1-C完了・Vercelデプロイ（Supabase Auth + Stripe + DB永続化 + Dashboard + 共有リンク + 利用制限） |
| 2026-03-06 | Phase 1-B完了・Vercelデプロイ・UIデザイン改善（Header非表示・バブル改善・emeraldバッジ等） |
| 2026-03-05 | Phase 1-A完了（UI基盤・LP・インタビューチャット・SEO） |
