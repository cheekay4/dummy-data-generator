# Claude Code プロンプト（更新版）：個人情報マスキングツール for tools24.jp

以下をそのままClaude Codeにコピペしてください。

---

```
Next.js 14 (App Router) + Tailwind CSS + shadcn/ui で、
tools24.jp の「個人情報マスキングツール」をゼロから作成してください。

## プロジェクト概要

tools24.jp は日本語の無料Webツール集サイト。
本ツールはその中の /personal-data-masking に配置する。
将来的に /json-formatter, /regex-tester, /keigo-email-writer 等の
兄弟ツールが追加される前提で、共通レイアウト・共通コンポーネントを意識すること。

## コンセプト
「ChatGPTやClaudeに送る前に、個人情報を安全にマスク」
テキストを貼り付けるだけで、名前・電話番号・メール・住所・マイナンバーを
自動検出し、ダミーデータに置換するツール。

**最大の訴求ポイント：** 全処理がブラウザ内で完結。サーバーにデータは送信しない。
ターゲットユーザーは、AIツールに社内文書を投げたい日本のビジネスパーソン・エンジニア。

---

## 画面構成

### ヘッダー（共通コンポーネント）
- 左: 「tools24.jp」テキストロゴ（クリックで / に遷移）
- 右: ダークモードトグル
- ヘッダー下に薄い区切り線

### パンくずリスト
ホーム > 個人情報マスキングツール

### 信頼バッジエリア（パンくず下）
- 「🔒 サーバー送信なし」「💻 ブラウザ内で完結」「✨ 登録不要で使える」
- 3つを横並びの小さなバッジで表示

### メインエリア（2カラム。モバイルは縦積み）

#### 左カラム：入力エリア
- テキストエリア（モノスペース、最低20行）
- プレースホルダー:
  「個人情報を含むテキストを貼り付けてください\n\n例:\n田中太郎様\n電話: 090-1234-5678\nメール: tanaka@example.com\n住所: 東京都渋谷区神宮前1-2-3」
- ボタン群（テキストエリアの下）：
  - 「サンプルを貼り付け」— 上記例文を自動挿入
  - 「クリア」— テキストを全消去
  - ファイルアップロード（.txt, .csv 対応。ドラッグ&ドロップ可）

#### 右カラム：出力エリア
- マスク済みテキストの表示（読み取り専用テキストエリア、同サイズ）
- 検出された個人情報のハイライト（マスク前後を色分け）
- ボタン群：
  - 「コピー」→ クリック後「コピーしました ✓」2秒表示
  - 「ダウンロード」→ .txtファイルとしてダウンロード

### 中央コントロール（2カラムの間。モバイルでは入力と出力の間に配置）

- **「マスクする →」ボタン**（メインアクション。大きく目立つ色）
- 検出サマリー（処理後に表示）：
  ```
  検出結果:
  ✓ 氏名 3件
  ✓ 電話番号 2件
  ✓ メールアドレス 1件
  ✓ 住所 1件
  ```

### マスク設定パネル（メインエリアの下。アコーディオン形式）

「⚙️ マスク設定」をクリックで開閉。

#### 検出対象（チェックボックス。デフォルト全ON）
- ☑ 氏名（漢字）
- ☑ 電話番号（090/080/070/03 等）
- ☑ メールアドレス
- ☑ 住所（都道府県から始まる文字列）
- ☑ 郵便番号（〒xxx-xxxx）
- ☑ マイナンバー（12桁数字）
- ☑ クレジットカード番号（Luhnチェック準拠）
- ☑ IPアドレス

#### マスク方式（ラジオボタン）
- ◉ ダミーデータ置換（デフォルト。田中太郎 → 山田花子） — **Proのみ**
- ○ 伏字マスク（田中太郎 → ●●●●） — **Free/Pro共通**
- ○ ハッシュ化（田中太郎 → a3f2b8...） — **Free/Pro共通**
- ○ 固定値置換（田中太郎 → [氏名]） — **Free/Pro共通**

※ 「ダミーデータ置換」にFreeユーザーが触れた場合、Pro導線モーダルを表示

### 回数表示バー（メインエリアの上）

ログインしていない場合・Freeユーザーの場合に表示：
```
本日の残り回数: ●●●●●●●○○○ 7/10 回
```
（プログレスバー形式。残り0になったらPaywallモーダル表示）

### Paywall モーダル（回数切れ or Pro機能タップ時）

```
┌──────────────────────────────────────┐
│  本日の無料枠を使い切りました          │
│                                      │
│  マスキング Pro — 月額190円            │
│                                      │
│  ✅ 回数無制限                        │
│  ✅ AI高精度検出モード                 │
│  ✅ ダミーデータ置換（●●●じゃなくリアルなダミー）│
│  ✅ カスタムルール登録                 │
│  ✅ 一括処理（複数テキスト）           │
│  ✅ 復元機能（マスク⇄元テキスト）      │
│  ✅ 履歴保存（30日間）                │
│  ✅ おまけ: tools24.jp 全ページ広告なし │
│                                      │
│  [ アカウント作成して課金する ]          │
│  [ 明日また無料で使う ]                │
└──────────────────────────────────────┘
```

### 関連ツールセクション
- 「その他の便利ツール」見出し
- カード形式で3〜4個:
  - 文字数カウンター（/character-counter）
  - JSON整形ツール（/json-formatter）— 「近日公開」
  - 敬語メールアシスタント（/keigo-email-writer）— 「近日公開」
  - ダミーデータ生成（/dummy-data-generator）— 「近日公開」

### SEOコンテンツ + FAQ セクション

#### 「個人情報マスキングツールとは」
2〜3段落で、以下を含む:
- AIツールに社内文書を送る前に個人情報を除去する必要性
- このツールがブラウザ内で完結する安全性
- 対応する個人情報の種類

#### FAQ
- 「データはサーバーに送信されますか？」→「いいえ、全てブラウザ内で処理されます。ネットワーク通信は一切行いません。」
- 「無料で使えますか？」→「はい、1日10回まで無料でお使いいただけます。Proプラン（月額190円）で回数無制限になります。」
- 「検出精度はどのくらいですか？」→「正規表現ベースで一般的な日本の個人情報フォーマットを高い精度で検出します。Proプランではさらに高精度なAI検出モードが利用できます。」
- 「マスクした後、元に戻せますか？」→「Proプランの復元機能で、マスク前後の対応表を保持し、元のテキストに復元できます。」

### フッター（共通コンポーネント）
- 左: 「© 2026 tools24.jp」
- 中央: プライバシーポリシー（/privacy）、特商法表記（/tokushoho）、お問い合わせ（/contact）
- 右: 「tools24.jp — 便利なWebツールを無料で」

---

## 検出ロジック（src/lib/detectors/）

### 氏名検出（name-detector.ts）
- 日本語の氏名パターンを正規表現で検出
- 姓辞書（上位200姓: 佐藤、鈴木、高橋、田中、伊藤...）を内蔵
- 「姓 + 1〜3文字の名」パターンにマッチ
- 「〜様」「〜氏」「〜さん」が後続する場合は高確信度
- ※ 誤検知を減らすため、辞書マッチ + パターンマッチの2段階

### 電話番号検出（phone-detector.ts）
```typescript
// 携帯: 090/080/070-XXXX-XXXX
// 固定: 03-XXXX-XXXX, 06-XXXX-XXXX 等
// ハイフンあり/なし両対応
const patterns = [
  /0[789]0[-\s]?\d{4}[-\s]?\d{4}/g,
  /0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{4}/g,
];
```

### メールアドレス検出（email-detector.ts）
```typescript
const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
```

### 住所検出（address-detector.ts）
```typescript
// 都道府県から始まる住所パターン
const prefectures = '(北海道|青森県|岩手県|...|沖縄県)';
const pattern = new RegExp(prefectures + '[\\u4e00-\\u9faf\\d\\-ー−]+', 'g');
```

### 郵便番号検出（zipcode-detector.ts）
```typescript
const pattern = /〒?\d{3}[-−]\d{4}/g;
```

### マイナンバー検出（mynumber-detector.ts）
```typescript
// 12桁の連続数字（チェックデジット検証付き）
const pattern = /\d{12}/g;
// マッチ後にチェックデジット検証で誤検知を減らす
```

### クレジットカード検出（creditcard-detector.ts）
```typescript
// 13〜19桁の数字列（ハイフン/スペース区切り対応）
// Luhnアルゴリズムでバリデーション
```

### IPアドレス検出（ip-detector.ts）
```typescript
const pattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
```

---

## 置換ロジック（src/lib/replacers/）

### ダミーデータ置換（dummy-replacer.ts）— Pro専用
- 氏名 → ダミー辞書からランダム選択（田中太郎 → 山田花子）
- 電話 → ランダム生成（090-XXXX-XXXX形式）
- メール → ランダム英字@example.com
- 住所 → 住所辞書からランダム選択
- ※ ダミー辞書は src/lib/dictionaries/ に内蔵

### 伏字マスク（redact-replacer.ts）— Free/Pro共通
- 検出箇所を文字数分の●で置換（田中太郎 → ●●●●）

### ハッシュ化（hash-replacer.ts）— Free/Pro共通
- SHA-256の先頭8文字に置換

### 固定値置換（fixed-replacer.ts）— Free/Pro共通
- 検出種別に応じた固定ラベルに置換（田中太郎 → [氏名]、090-... → [電話番号]）

---

## ダミーデータ辞書（src/lib/dictionaries/）

### names.ts
```typescript
export const lastNames = [
  "佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤",
  "吉田", "山田", "佐々木", "松本", "井上", "木村", "林", "斎藤", "清水", "山口",
  // ... 少なくとも100姓
];
export const firstNamesMale = [
  "太郎", "一郎", "健太", "翔太", "大輝", "拓海", "蓮", "悠人", "陽翔", "朝陽",
  // ... 少なくとも50名
];
export const firstNamesFemale = [
  "花子", "美咲", "陽菜", "結衣", "さくら", "葵", "凛", "楓", "莉子", "芽依",
  // ... 少なくとも50名
];
```

### addresses.ts
```typescript
export const dummyAddresses = [
  { prefecture: "東京都", city: "千代田区", town: "丸の内1-1-1" },
  { prefecture: "大阪府", city: "大阪市北区", town: "梅田2-2-2" },
  { prefecture: "愛知県", city: "名古屋市中区", town: "栄3-3-3" },
  // ... 少なくとも47件（各都道府県1つ以上）
];
```

---

## Free / Pro の実装

### 回数制限（src/lib/usage.ts）

Free ユーザーは **1日10回まで** 利用可能。
回数カウントは以下の優先度で管理：

1. **ログイン済みユーザー** → Supabase の profiles テーブルで管理
2. **未ログインユーザー** → localStorage で管理（日付が変わったらリセット）

```typescript
const FREE_DAILY_LIMIT = 10;

export function getUsageCount(): number {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('masking_usage');
  if (!stored) return 0;
  const { date, count } = JSON.parse(stored);
  return date === today ? count : 0;
}

export function incrementUsage(): void {
  const today = new Date().toISOString().split('T')[0];
  const current = getUsageCount();
  localStorage.setItem('masking_usage', JSON.stringify({ date: today, count: current + 1 }));
}

export function canUse(): boolean {
  return getUsageCount() < FREE_DAILY_LIMIT;
}
```

### Pro判定（src/lib/subscription.ts）

```typescript
// 将来 Supabase + Stripe と連携する。
// 今は常に false を返すスタブ実装にしておく。
// ただし、UIのPro導線（モーダル、バッジ）は全て実装する。

export function useSubscription() {
  // TODO: Supabase から取得
  const isPro = false;
  const isLoggedIn = false;
  return { isPro, isLoggedIn };
}
```

### Pro機能のUI表現

- ダミーデータ置換のラジオボタンに「✨ Pro」バッジ
- Paywall モーダルは上述の通り実装
- Pro限定機能をFreeユーザーがクリック → Paywall モーダル表示
- 課金ボタンのリンク先は `/pricing`（今は空ページでOK。後でStripe Checkout連携）

---

## 広告枠

3箇所に <AdPlaceholder /> コンポーネントを配置：
- ヘッダー直下（728×90）
- SEOコンテンツ上（336×280）
- サイドバーまたはモバイル時コンテンツ下（300×250）

AdPlaceholder コンポーネント仕様：
- props: slot: string, width: number, height: number, isPro?: boolean
- isPro === true の場合は何も表示しない（return null）
- isPro === false or undefined の場合はグレー背景+破線+「広告」テキスト

---

## SEO対策

### メタデータ
- title: 「個人情報マスキングツール - テキストの個人情報を自動検出・置換 | tools24.jp」
- description: 「テキストに含まれる氏名、電話番号、メールアドレス、住所、マイナンバーを自動検出してマスク。ChatGPTやClaudeに送る前の個人情報除去に。全てブラウザ内で処理、サーバー送信なし。」
- keywords: 「個人情報 マスキング, 個人情報 除去, テキスト 匿名化, ChatGPT 個人情報, マイナンバー マスク」
- canonical: https://tools24.jp/personal-data-masking
- OGP設定
- 構造化データ（WebApplication schema、price: 0）

### sitemap.ts / robots.ts
- /personal-data-masking を含むsitemap生成
- robots.txt で全ページ許可

---

## ディレクトリ構造

```
src/
  app/
    layout.tsx                          # 共通レイアウト
    page.tsx                            # トップページ（ツール一覧）
    personal-data-masking/
      page.tsx                          # ★ マスキングツール本体
    pricing/
      page.tsx                          # 料金ページ（簡易版。後でStripe連携）
    privacy/page.tsx                    # プライバシーポリシー
    tokushoho/page.tsx                  # 特商法表記
    contact/page.tsx                    # お問い合わせ
    sitemap.ts
    robots.ts
  components/
    layout/
      header.tsx                        # 共通ヘッダー
      footer.tsx                        # 共通フッター
      breadcrumb.tsx                    # パンくずリスト
    common/
      ad-placeholder.tsx                # 広告プレースホルダー（isPro対応）
      theme-toggle.tsx                  # ダークモード
      related-tools.tsx                 # 関連ツールカード
      paywall-modal.tsx                 # 回数切れ/Pro導線モーダル
      usage-bar.tsx                     # 残り回数プログレスバー
      trust-badges.tsx                  # 信頼バッジ（サーバー送信なし等）
    masking/
      masking-input.tsx                 # 左カラム（入力エリア）
      masking-output.tsx                # 右カラム（出力エリア）
      masking-controls.tsx              # 中央コントロール（マスクボタン+検出サマリー）
      masking-settings.tsx              # マスク設定パネル（アコーディオン）
      detection-summary.tsx             # 検出結果サマリー
      faq.tsx                           # FAQ
  lib/
    detectors/
      index.ts                          # 全検出器の統合エントリ
      name-detector.ts
      phone-detector.ts
      email-detector.ts
      address-detector.ts
      zipcode-detector.ts
      mynumber-detector.ts
      creditcard-detector.ts
      ip-detector.ts
    replacers/
      index.ts                          # 全置換器の統合エントリ
      dummy-replacer.ts                 # Pro専用
      redact-replacer.ts                # ●●●
      hash-replacer.ts                  # SHA-256
      fixed-replacer.ts                 # [氏名] 等
    dictionaries/
      names.ts                          # 姓100+名100のダミー辞書
      addresses.ts                      # 47都道府県ダミー住所
    usage.ts                            # 回数制限管理
    subscription.ts                     # Pro判定（スタブ）
    types.ts                            # 型定義
```

---

## トップページ（app/page.tsx）

```tsx
const tools = [
  {
    title: '個人情報マスキング',
    description: 'テキストの個人情報を自動検出・マスク。ChatGPTに送る前に。',
    href: '/personal-data-masking',
    icon: '🔒',
    status: 'live',
  },
  {
    title: '文字数カウンター',
    description: '文字数・単語数・行数をリアルタイムカウント',
    href: '/character-counter',
    icon: '📝',
    status: 'live',
  },
  {
    title: 'JSON整形ツール',
    description: 'JSONの整形・圧縮・変換をブラウザだけで',
    href: '/json-formatter',
    icon: '{ }',
    status: 'coming-soon',
  },
  {
    title: '敬語メールアシスタント',
    description: 'カジュアルな文をビジネス敬語メールに変換',
    href: '/keigo-email-writer',
    icon: '✉️',
    status: 'coming-soon',
  },
  {
    title: 'ダミーデータ生成',
    description: '日本のリアルなテストデータを瞬時に生成',
    href: '/dummy-data-generator',
    icon: '🗂️',
    status: 'coming-soon',
  },
];
```

トップページのメタデータ:
- title: 「tools24.jp — 便利なWebツールを無料で」
- description: 「個人情報マスキング、JSON整形、文字数カウント、敬語メール変換など、開発者・ビジネスパーソン向けの便利ツールが全て無料・ブラウザ完結で使えます。」

---

## pricing/page.tsx（料金ページ簡易版）

マスキングツールの Free / Pro 比較表を表示するページ。

| 機能 | Free（0円） | Pro（月額190円） |
|------|-----------|----------------|
| マスキング回数 | 10回/日 | 無制限 |
| 正規表現ベース検出 | ✅ | ✅ |
| AI高精度検出 | — | ✅ |
| 伏字マスク（●●●） | ✅ | ✅ |
| ハッシュ化 | ✅ | ✅ |
| 固定値置換 | ✅ | ✅ |
| ダミーデータ置換 | — | ✅ |
| カスタムルール | — | ✅ |
| 一括処理 | — | ✅ |
| 復元機能 | — | ✅ |
| 履歴保存（30日） | — | ✅ |
| 全ページ広告なし | — | ✅ |

- 「Pro プランに申し込む」ボタン → 今は # リンク（後でStripe Checkout）
- 「無料で使い始める →」ボタン → /personal-data-masking にリンク

---

## privacy/page.tsx, tokushoho/page.tsx, contact/page.tsx

JSON formatterプロンプトと同じ内容で作成：
- privacy: Google Analytics、AdSense、Cookie使用の記載。改定日2026年2月。
- tokushoho: プレースホルダーテキスト（名前・住所・メール）。Stripe経由クレカ決済。
- contact: Googleフォーム埋め込みプレースホルダー + メールリンク。

---

## 注意事項

- UIテキストは全て日本語
- エラーメッセージも日本語
- shadcn/ui: `npx shadcn@latest init` → `npx shadcn@latest add button card alert badge dialog tabs checkbox radio-group accordion progress separator`
- `next.config.js` でStandalone出力設定（Vercelデプロイ用）
- 全てTypeScript（.tsx/.ts）で記述
- 外部API呼び出しは一切なし（Free版のマスキング処理は全てクライアントサイド）
- package.json に必要な依存関係を全て含めること
- 共通コンポーネント（header, footer, breadcrumb, ad-placeholder, theme-toggle, related-tools, paywall-modal, usage-bar）は後から追加するツールページでも使い回す前提で汎用的に作ること
- Pro機能（AI高精度検出、復元、履歴）のUI要素は全て作成する。ただし実際の処理はスタブ（TODO コメント付き）でOK
- Pro機能のボタン/ラジオは「✨ Pro」バッジを表示し、Freeユーザーがクリックした場合はPaywallモーダルを表示する
- ダミーデータ辞書は十分な量を入れること（姓100+名100で1万通りの組み合わせ）
- 住所ダミー辞書は47都道府県カバー
- メールのダミーは必ず example.com / example.jp ドメインを使用（RFC 2606準拠）
```
