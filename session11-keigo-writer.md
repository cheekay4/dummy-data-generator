# Session 11: 敬語メールライター（keigo-tools）

新規リポジトリ `keigo-tools` を作成してください。
masking-tools と同じ技術スタック（Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui）を使用。

---

## 完成イメージ

カジュアルな日本語や箇条書きを入力すると、相手やシーンに応じた敬語メールに変換するAIツール。
Claude APIを使用。無料3回/日、Pro月額290円で無制限。

---

## リポジトリ初期化

```bash
npx create-next-app@14 keigo-tools --typescript --tailwind --eslint --app --src-dir
cd keigo-tools
npx shadcn-ui@latest init
# shadcn コンポーネント追加: button, card, input, textarea, select, tabs, badge, alert, dialog, separator, accordion, label, switch
```

---

## ページ構成

| パス | 内容 |
|------|------|
| / | トップ（ツール説明 + 使い方 + メール作成エリア） |
| /pricing | 料金プラン（Free / Pro 比較） |
| /success | Stripe決済成功ページ |
| /tokushoho | 特定商取引法に基づく表記 |
| /privacy | プライバシーポリシー |
| /terms | 利用規約 |

---

## メインページ（/）画面構成

### ヘッダー
- サイトタイトル: 「敬語メールライター」
- サブタイトル: 「カジュアルな文章をビジネス敬語メールに瞬時変換」
- ダークモード切り替え
- 「Pro」バッジ（課金済みの場合）

### ツールエリア（メインカード）

#### Step 1: シーン設定

**送信相手（必須、セレクト）:**
- 社外（取引先・顧客）— 最も丁寧
- 社内上司 — 丁寧
- 社内同僚・後輩 — ややカジュアル敬語
- 就活（採用担当者）— フォーマル

**メールの種類（必須、セレクト）:**
- お礼・感謝
- お詫び・謝罪
- 依頼・お願い
- 報告・連絡
- 確認・問い合わせ
- 日程調整
- 催促・リマインド
- お断り・辞退
- 挨拶（着任・異動・退職）
- 見積もり・提案
- 招待・案内
- お祝い
- お悔やみ
- 自由入力

**トーン調整（任意、スライダー）:**
- 左端: フォーマル（最大限の敬語）
- 右端: ソフト（親しみやすい敬語）
- デフォルト: 中央

#### Step 2: 内容入力

**件名（任意）:**
- テキスト入力
- placeholder: 「例: 来週の打ち合わせについて」
- 入力がなければAIが自動生成

**本文（必須）:**
- テキストエリア（最低8行）
- placeholder:
```
例:
・来週の打ち合わせの日程を変更したい
・水曜か木曜の午後がいい
・場所はオンラインで
・資料は前日までに送る
```
- 文字数カウンター表示（右下）

**追加オプション（アコーディオン、デフォルト閉じ）:**
- 自分の名前: テキスト入力（署名に使用）
- 自分の所属: テキスト入力（署名に使用）
- 相手の名前: テキスト入力（宛名に使用）
- 相手の会社名: テキスト入力（宛名に使用）

#### 「敬語メールを生成」ボタン（プライマリ、大きめ）

生成中はボタンにスピナー + 「生成中...」表示

#### Step 3: 結果表示

**件名エリア:**
- 生成された件名を表示
- 「コピー」ボタン

**本文エリア:**
- 生成された敬語メールを表示（読み取り専用テキストエリア）
- 敬語のポイント解説: 重要な敬語表現にツールチップ（ホバーで解説表示）
  - 例: 「ご確認いただけますでしょうか」→ 「『いただく』は謙譲語。相手の行為を丁寧に依頼する表現」
- 「コピー」ボタン（メール全文）
- 「メールアプリで開く」ボタン（mailto: リンク、件名+本文をセット）
- 「もう少しフォーマルに」「もう少しカジュアルに」調整ボタン（再生成）

**敬語チェック結果（本文の下、カード形式）:**
- 入力文 → 出力文の変更点を差分ハイライトで表示
- 使用された敬語テクニックのリスト
  - 例: 「〜したい → 〜いたしたく存じます」（謙譲語化）
  - 例: 「送る → お送りいたします」（謙譲語+丁寧語）
  - 例: 「いい → よろしい」（丁寧語化）

---

## テンプレート機能

メール種類ごとにワンクリックでテンプレートを入力欄にセットするボタン群。
ツールエリアの上部に横スクロール可能なチップ形式で配置。

```typescript
const TEMPLATES = [
  {
    id: 'meeting-reschedule',
    label: '日程変更',
    category: 'schedule',
    recipient: 'external',
    type: 'request',
    subject: '打ち合わせ日程変更のお願い',
    body: '・来週の打ち合わせの日程を変更したい\n・水曜か木曜の午後が都合がいい\n・ご迷惑をおかけして申し訳ない',
  },
  {
    id: 'thank-you-meeting',
    label: 'お礼（打ち合わせ後）',
    category: 'thanks',
    recipient: 'external',
    type: 'thanks',
    subject: '',
    body: '・本日はお時間をいただきありがとうございました\n・提案内容を社内で検討します\n・来週中に回答します',
  },
  {
    id: 'apology-delay',
    label: 'お詫び（納期遅延）',
    category: 'apology',
    recipient: 'external',
    type: 'apology',
    subject: '',
    body: '・納品が予定より3日遅れる\n・原因はシステム障害\n・○月○日までに納品する\n・再発防止策を講じる',
  },
  {
    id: 'inquiry',
    label: '問い合わせ',
    category: 'inquiry',
    recipient: 'external',
    type: 'inquiry',
    subject: '',
    body: '・御社のサービスについて質問がある\n・料金プランの詳細を知りたい\n・デモの手配は可能か',
  },
  {
    id: 'reminder',
    label: '催促',
    category: 'reminder',
    recipient: 'external',
    type: 'reminder',
    subject: '',
    body: '・先週お送りした見積もりの件\n・ご検討状況を確認したい\n・ご不明点があればお知らせください',
  },
  {
    id: 'decline',
    label: 'お断り',
    category: 'decline',
    recipient: 'external',
    type: 'decline',
    subject: '',
    body: '・ご提案いただいた件について\n・社内で検討した結果、今回は見送りたい\n・理由は予算の都合\n・また機会があればお願いしたい',
  },
  {
    id: 'job-thank-you',
    label: '就活お礼',
    category: 'job',
    recipient: 'recruiter',
    type: 'thanks',
    subject: '',
    body: '・本日の面接のお礼\n・御社の事業に強い関心を持った\n・選考結果をお待ちしています',
  },
  {
    id: 'sick-leave',
    label: '体調不良連絡',
    category: 'report',
    recipient: 'boss',
    type: 'report',
    subject: '',
    body: '・体調が悪いので今日は休みたい\n・熱が38度ある\n・明日は出社できると思う\n・急ぎの案件は○○さんに引き継ぎ済み',
  },
];
```

---

## Claude API連携

### API Route: /api/generate（src/app/api/generate/route.ts）

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { recipient, emailType, tone, subject, content, senderName, senderCompany, recipientName, recipientCompany, adjustment } = body;

  // 利用回数チェック（簡易版: ヘッダーのX-Usage-Countで受け取る）
  // 本格版ではサーバーサイドでIP or セッションベースのカウントが必要

  const systemPrompt = buildSystemPrompt(recipient, emailType, tone, adjustment);
  const userPrompt = buildUserPrompt({ subject, content, senderName, senderCompany, recipientName, recipientCompany });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  // レスポンスをパース
  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  return Response.json({ result: responseText });
}
```

### システムプロンプト（src/lib/keigo/prompts.ts）

```typescript
export function buildSystemPrompt(
  recipient: string,
  emailType: string,
  tone: number, // 0-100, 0=最フォーマル, 100=ソフト
  adjustment?: 'more-formal' | 'more-casual'
): string {
  const toneLevel = adjustment === 'more-formal' ? Math.max(0, tone - 20)
    : adjustment === 'more-casual' ? Math.min(100, tone + 20)
    : tone;

  return `あなたは日本語ビジネスメールの専門家です。
ユーザーが入力したカジュアルな文章や箇条書きを、適切な敬語のビジネスメールに変換してください。

## 相手との関係
${getRecipientDescription(recipient)}

## メールの種類
${getEmailTypeDescription(emailType)}

## トーンレベル: ${toneLevel}/100
${toneLevel < 30 ? '最大限フォーマルな敬語を使用。二重敬語にならない範囲で最も丁寧に。' : ''}
${toneLevel >= 30 && toneLevel < 70 ? '標準的なビジネス敬語。堅すぎず、かつ失礼にならないバランス。' : ''}
${toneLevel >= 70 ? '親しみやすい敬語。「です・ます」調を基本としつつ、柔らかい表現を使用。' : ''}

## 出力形式
以下のJSON形式で出力してください。JSON以外の文字は一切出力しないでください。

{
  "subject": "件名（ユーザーが指定していない場合は自動生成）",
  "body": "メール本文（改行は\\nで表現）",
  "techniques": [
    {
      "original": "元の表現",
      "converted": "変換後の表現",
      "explanation": "使用した敬語テクニックの解説"
    }
  ]
}

## ルール
1. 宛名（○○様）、挨拶文、本文、結び、署名の構成を守る
2. 「お忙しいところ恐れ入りますが」等のクッション言葉を適切に使用
3. 二重敬語（「おっしゃられる」等）は使わない
4. 「させていただく」の乱用を避ける（許可が不要な場面では使わない）
5. 相手の行為には尊敬語、自分の行為には謙譲語を正しく使い分ける
6. 件名は30文字以内で内容が分かるようにする
7. 署名は名前・所属が提供されている場合のみ付ける`;
}
```

---

## 課金システム（masking-tools と同じ構成）

### 利用制限
- 無料: 3回/日（localStorageでカウント管理）
- Pro: 無制限

### Stripe連携（masking-tools と同じパターン）

**API Routes:**
- /api/checkout — Stripe Checkoutセッション作成
- /api/webhook — Webhook受信
- /api/portal — カスタマーポータル

**環境変数:**
```
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_KEIGO_PRO=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
```

**pricing ページ:**

| | Free | Pro |
|--|------|-----|
| 月額 | 0円 | 290円 |
| 生成回数 | 3回/日 | 無制限 |
| テンプレート | ✅ | ✅ |
| 敬語解説 | ✅ | ✅ |
| メールアプリ連携 | ✅ | ✅ |
| トーン調整 | ❌ | ✅ |
| 広告 | あり | なし |

### 利用回数チェック（src/lib/keigo/usage.ts）

```typescript
const FREE_DAILY_LIMIT = 3;
const STORAGE_KEY = 'keigo_usage';

export function getUsageToday(): number {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return 0;
  const parsed = JSON.parse(data);
  const today = new Date().toISOString().split('T')[0];
  if (parsed.date !== today) return 0;
  return parsed.count;
}

export function incrementUsage(): void {
  const today = new Date().toISOString().split('T')[0];
  const current = getUsageToday();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

export function canUse(): boolean {
  if (isProUser()) return true;
  return getUsageToday() < FREE_DAILY_LIMIT;
}

export function isProUser(): boolean {
  return !!localStorage.getItem('keigo_subscription_id');
}

export function getRemainingUses(): number {
  if (isProUser()) return Infinity;
  return FREE_DAILY_LIMIT - getUsageToday();
}
```

---

## 回数制限到達時のUI

無料回数を使い切ったら:
- 「本日の無料枠（3回）を使い切りました」のバナー表示
- 「Pro プランにアップグレード（月額290円）」ボタン → /pricing へ
- 生成ボタンを無効化
- 「明日またご利用いただけます」のテキスト

---

## トップページ下部: SEOコンテンツ

**「敬語メールの基本」（アコーディオン）**
- 尊敬語・謙譲語・丁寧語の違い
- ビジネスメールの基本構成（宛名→挨拶→本文→結び→署名）
- よくある敬語の間違い

**「シーン別メール例」（アコーディオン）**
- 日程調整: 「ご都合のよろしい日時をお知らせいただけますでしょうか」
- お詫び: 「ご迷惑をおかけし、誠に申し訳ございません」
- 催促: 「ご多忙のところ恐縮ですが、ご確認いただけますと幸いです」

**「よくある質問（FAQ）」（アコーディオン）**
- Q: 入力した文章はサーバーに保存されますか？ → A: いいえ。AIによる変換処理のみ行い、入力内容・生成結果ともにサーバーに保存しません。
- Q: 生成された敬語は正確ですか？ → A: AIによる生成のため、まれに不自然な表現が含まれる可能性があります。重要なメールは送信前にご自身で確認してください。
- Q: 英語のメールも書けますか？ → A: 現在は日本語の敬語メールのみ対応しています。

---

## SEO対策

メタデータ:
- title: 「敬語メールライター | カジュアル文章をビジネス敬語メールに変換」
- description: 「箇条書きやカジュアルな文章を入力するだけで、相手やシーンに合った敬語ビジネスメールを自動生成。お礼・お詫び・依頼・催促など全14シーン対応。敬語の使い方も解説付き。」
- keywords: 「敬語 メール, ビジネスメール 書き方, 敬語 変換, メール 敬語, ビジネス メール テンプレート」

構造化データ: WebApplication schema
OGP設定
sitemap.xml 生成

---

## tokushoho（特定商取引法に基づく表記）ページ

masking-tools の tokushoho ページと同じ構成で以下を表示:

- 販売事業者名: （個人名）
- 運営責任者: （個人名）
- 所在地: 「請求があったら遅滞なく開示します」
- 電話番号: 「請求があったら遅滞なく開示します」
- メールアドレス: お問い合わせフォームへのリンク
- 販売価格: Pro プラン 月額290円（税込）
- 支払方法: クレジットカード（Stripe経由）
- 解約方法: マイページからいつでも解約可能
- 返金ポリシー: デジタルサービスの性質上、原則として返金不可

---

## ディレクトリ構造

```
keigo-tools/
  src/
    app/
      layout.tsx
      page.tsx              # メインページ（ツール + SEOコンテンツ）
      pricing/
        page.tsx
      success/
        page.tsx
      tokushoho/
        page.tsx
      privacy/
        page.tsx
      terms/
        page.tsx
      api/
        generate/
          route.ts          # Claude API連携
        checkout/
          route.ts          # Stripe Checkout
        webhook/
          route.ts          # Stripe Webhook
        portal/
          route.ts          # Stripe カスタマーポータル
    components/
      keigo/
        keigo-writer.tsx    # メインコンポーネント
        scene-settings.tsx  # Step 1: シーン設定
        content-input.tsx   # Step 2: 内容入力
        result-display.tsx  # Step 3: 結果表示
        template-chips.tsx  # テンプレート選択チップ
        usage-banner.tsx    # 利用回数表示/制限バナー
        pricing-table.tsx   # 料金比較テーブル
      common/
        header.tsx
        footer.tsx
        theme-toggle.tsx
    lib/
      keigo/
        prompts.ts          # システムプロンプト構築
        usage.ts            # 利用回数管理
        templates.ts        # テンプレート定義
        types.ts            # 型定義
      stripe/
        client.ts           # Stripe ユーティリティ
```

---

## 注意事項

- Anthropic SDK: `npm install @anthropic-ai/sdk`
- Stripe SDK: `npm install stripe`
- UIテキストは全て日本語
- Claude APIのレスポンスはJSON形式を期待するが、パースに失敗した場合はプレーンテキストとして表示
- API Route は Edge Runtime ではなく Node.js Runtime を使用（Anthropic SDKの互換性のため）
- 環境変数 ANTHROPIC_API_KEY が未設定の場合、generate API はエラーを返す（「APIキーが設定されていません」）
- ローカル開発では .env.local に全環境変数を設定
- npm run build が通ることを確認
- Stripe連携のテストはローカルで .env.local 設定後に行う（デプロイは別セッション）
