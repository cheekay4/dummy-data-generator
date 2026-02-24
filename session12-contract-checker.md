# Session 12: 契約書チェッカー（contract-tools）

新規リポジトリ `contract-tools` を作成してください。
keigo-tools と同じ技術スタック（Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui + Anthropic SDK + Stripe）。

---

## 完成イメージ

契約書のテキストを貼り付けると、AIが要約・リスク検出・不利条項ハイライト・改善提案を行うツール。
Claude APIを使用。無料2件/月、Pro月額490円で無制限。

---

## リポジトリ初期化

```bash
npx create-next-app@14 contract-tools --typescript --tailwind --eslint --app --src-dir
cd contract-tools
npx shadcn-ui@latest init
# shadcn コンポーネント追加: button, card, input, textarea, select, tabs, badge, alert, dialog, separator, accordion, label, switch, progress, tooltip
npm install @anthropic-ai/sdk stripe
```

---

## ページ構成

| パス | 内容 |
|------|------|
| / | トップ（ツール説明 + 契約書分析エリア） |
| /pricing | 料金プラン（Free / Pro 比較） |
| /success | Stripe決済成功ページ |
| /tokushoho | 特定商取引法に基づく表記 |
| /privacy | プライバシーポリシー |
| /terms | 利用規約 |

---

## メインページ（/）画面構成

### ヘッダー
- サイトタイトル: 「契約書チェッカー」
- サブタイトル: 「AIが契約書のリスクと不利条項を瞬時にチェック」
- ダークモード切り替え
- 「Pro」バッジ（課金済みの場合）

### 免責バナー（常時表示、ページ上部）
⚠️「本ツールはAIによる参考分析です。法的助言ではありません。重要な契約は必ず弁護士にご相談ください。」

### ツールエリア

#### Step 1: 契約書タイプ選択（任意）

セレクト:
- 自動判定（デフォルト）
- 業務委託契約
- 秘密保持契約（NDA）
- 売買契約
- 賃貸借契約
- 雇用契約・労働契約
- ライセンス契約
- 利用規約・サービス契約
- その他

**立場選択（必須）:**
- 受注側（契約を受ける側）
- 発注側（契約を出す側）
- どちらでもない / 不明

#### Step 2: 契約書テキスト入力

**入力方法（タブ切り替え）:**

タブ1: テキスト貼り付け
- テキストエリア（最低20行、モノスペースフォント）
- placeholder: 「契約書の全文または確認したい条項をここに貼り付けてください」
- 文字数カウンター表示
- 「サンプル契約書を読み込む」ボタン（デモ用）

タブ2: ファイルアップロード
- ドラッグ&ドロップエリア
- 対応形式: .txt, .pdf（テキスト抽出）
- 最大ファイルサイズ: 500KB
- PDF読み込み: pdf.js を使用してクライアントサイドでテキスト抽出
- 「※画像PDFやスキャンPDFはテキスト抽出できません」の注記

#### 「契約書をチェック」ボタン（プライマリ、大きめ）

生成中はプログレスバー + 「分析中... AIが契約書を読み込んでいます」

#### Step 3: 分析結果

**3つのタブで結果表示:**

---

**タブA: 概要・要約**

**契約書タイプ:** （自動判定結果）「業務委託契約」

**リスクスコア:**
- ビジュアルゲージ（0-100）
- 0-30: 🟢 低リスク「標準的な契約内容です」
- 31-60: 🟡 中リスク「いくつか注意すべき条項があります」
- 61-100: 🔴 高リスク「不利な条項が複数含まれています」

**要約（3-5行）:**
契約の全体像を平易な日本語で要約。当事者、契約期間、主な義務、支払条件を含む。

**重要ポイント（箇条書き）:**
- 契約期間: ○年○月○日〜○年○月○日
- 自動更新: あり / なし
- 報酬: ○○円（税別 / 税込）
- 支払条件: 月末締め翌月末払い
- 解約条件: ○ヶ月前通知

---

**タブB: リスク・不利条項の詳細**

条項ごとのカード形式で表示。リスクレベル順（高→低）でソート。

各カード:
```
┌─────────────────────────────────────┐
│ 🔴 高リスク  第○条 損害賠償           │
│                                       │
│ 【該当箇所】                          │
│ 「乙は甲に生じた一切の損害を賠償する  │
│ ものとする」                          │
│                                       │
│ 【問題点】                            │
│ 損害賠償の上限が定められていません。    │
│ 受注側が無制限の賠償責任を負う可能性が  │
│ あります。                            │
│                                       │
│ 【改善案】                            │
│ 「乙の損害賠償の累計額は、本契約に     │
│ 基づき甲が乙に支払った直近12ヶ月の     │
│ 報酬総額を上限とする」                │
│                                       │
│ 【一般的な慣行】                      │
│ 業務委託契約では賠償上限を報酬額の     │
│ 1〜12ヶ月分とするのが一般的です。      │
└─────────────────────────────────────┘
```

**チェック対象の条項カテゴリ:**

1. **損害賠償** — 上限の有無、範囲（直接損害のみ/間接損害含む）
2. **契約解除** — 解除条件の対称性、解除後の清算
3. **知的財産権** — 成果物の帰属、共同著作の扱い
4. **秘密保持** — 期間の妥当性、範囲の広さ
5. **競業避止** — 期間・地域・範囲の妥当性
6. **自動更新** — 更新条件、解約通知期間
7. **支払条件** — 遅延利率、支払いサイト
8. **瑕疵担保/契約不適合** — 期間、範囲
9. **不可抗力** — 定義の範囲
10. **裁判管轄** — 管轄裁判所の指定
11. **再委託** — 可否、条件
12. **反社会的勢力排除** — 条項の有無

---

**タブC: 条項対照表**

全条項を一覧表で表示:

| # | 条項名 | リスク | ステータス | 概要 |
|---|--------|--------|----------|------|
| 1 | 目的 | 🟢 | 問題なし | 委託業務の内容を定義 |
| 2 | 契約期間 | 🟢 | 問題なし | 2026年4月〜2027年3月 |
| 3 | 報酬 | 🟡 | 注意 | 支払サイトが60日と長い |
| 4 | 損害賠償 | 🔴 | 要確認 | 上限なし |
| ... | | | | |

---

## サンプル契約書（デモ用）

「サンプル契約書を読み込む」ボタンで読み込まれるデモデータ:

```typescript
export const SAMPLE_CONTRACT = `業務委託基本契約書

株式会社ABC（以下「甲」という）と○○○○（以下「乙」という）は、甲が乙に業務を委託するにあたり、以下のとおり契約を締結する。

第1条（目的）
甲は乙に対し、甲が別途指定するWebサイト開発業務（以下「本業務」という）を委託し、乙はこれを受託する。

第2条（契約期間）
本契約の有効期間は、2026年4月1日から2027年3月31日までとする。ただし、期間満了の1ヶ月前までに甲乙いずれからも書面による解約の申し出がない場合、同一条件でさらに1年間自動的に更新されるものとし、以後も同様とする。

第3条（報酬及び支払条件）
1. 甲は乙に対し、本業務の対価として月額500,000円（税別）を支払う。
2. 支払は、毎月末日締め、翌々月末日払いとする。
3. 振込手数料は乙の負担とする。

第4条（知的財産権）
本業務により生じた成果物に関する一切の知的財産権（著作権法第27条及び第28条の権利を含む）は、乙から甲に移転するものとする。乙は、甲に対して著作者人格権を行使しないものとする。

第5条（秘密保持）
乙は、本契約に関連して知り得た甲の技術上、営業上の秘密情報を、本契約終了後10年間、第三者に漏洩してはならない。

第6条（損害賠償）
乙は、本契約に違反し、又は故意若しくは過失により甲に損害を与えた場合、甲に生じた一切の損害（逸失利益を含む）を賠償するものとする。

第7条（契約解除）
甲は、乙が本契約のいずれかの条項に違反した場合、催告なく直ちに本契約を解除することができる。

第8条（競業避止）
乙は、本契約期間中及び契約終了後2年間、甲の事前の書面による承諾なく、甲と競合する事業を行ってはならない。

第9条（再委託の禁止）
乙は、甲の事前の書面による承諾なく、本業務の全部又は一部を第三者に再委託してはならない。

第10条（反社会的勢力の排除）
甲及び乙は、自ら又はその役員が反社会的勢力に該当しないことを表明し、保証する。

第11条（合意管轄）
本契約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とする。`;
```

このサンプルには意図的に以下のリスクを含めてある:
- 第3条: 支払サイトが翌々月末（60日超）と長い、振込手数料が受注側負担
- 第4条: 著作者人格権の不行使（一方的）
- 第5条: 秘密保持10年は長すぎる
- 第6条: 損害賠償の上限なし、逸失利益含む
- 第7条: 解除権が甲のみで非対称
- 第8条: 競業避止2年は長すぎる

---

## Claude API連携

### API Route: /api/analyze（src/app/api/analyze/route.ts）

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const { contractText, contractType, position } = await request.json();

  const systemPrompt = buildSystemPrompt(contractType, position);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: contractText }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  return Response.json({ result: JSON.parse(responseText) });
}
```

### システムプロンプト（src/lib/contract/prompts.ts）

```typescript
export function buildSystemPrompt(contractType: string, position: string): string {
  return `あなたは日本の契約書レビューの専門家です。
ユーザーが入力した契約書テキストを分析し、リスクと不利条項を検出してください。

## ユーザーの立場
${position === 'receiver' ? '受注側（契約を受ける側）です。受注側にとって不利な条項を重点的にチェックしてください。' : ''}
${position === 'orderer' ? '発注側（契約を出す側）です。発注側にとってのリスクを重点的にチェックしてください。' : ''}
${position === 'neutral' ? '立場は不明です。双方の観点からバランスよく分析してください。' : ''}

## 契約書タイプ
${contractType === 'auto' ? '自動判定してください。' : contractType}

## 分析観点
以下の12カテゴリの条項を必ずチェックしてください:
1. 損害賠償（上限の有無、範囲）
2. 契約解除（解除条件の対称性）
3. 知的財産権（成果物の帰属）
4. 秘密保持（期間・範囲の妥当性）
5. 競業避止（期間・地域・範囲）
6. 自動更新（更新条件、解約通知期間）
7. 支払条件（遅延利率、支払いサイト）
8. 瑕疵担保/契約不適合（期間、範囲）
9. 不可抗力（定義の範囲）
10. 裁判管轄（管轄裁判所の指定）
11. 再委託（可否、条件）
12. 反社会的勢力排除（条項の有無）

## 出力形式
以下のJSON形式で出力してください。JSON以外の文字は一切出力しないでください。

{
  "contractType": "判定された契約書タイプ",
  "riskScore": 0-100の数値,
  "summary": "契約書全体の要約（3-5文）",
  "keyPoints": [
    { "label": "契約期間", "value": "2026年4月〜2027年3月（自動更新あり）" },
    { "label": "報酬", "value": "月額500,000円（税別）" }
  ],
  "risks": [
    {
      "articleNumber": "第○条",
      "articleTitle": "条項名",
      "riskLevel": "high" | "medium" | "low",
      "excerpt": "該当箇所の原文引用",
      "issue": "問題点の説明",
      "suggestion": "改善案の具体的な文言",
      "commonPractice": "一般的な慣行の説明"
    }
  ],
  "articles": [
    {
      "number": "第○条",
      "title": "条項名",
      "riskLevel": "high" | "medium" | "low" | "none",
      "status": "要確認" | "注意" | "問題なし",
      "summary": "条項の概要（1文）"
    }
  ],
  "missingClauses": [
    {
      "clause": "不可抗力条項",
      "importance": "high" | "medium",
      "explanation": "なぜ必要か"
    }
  ]
}

## ルール
1. 法的助言ではなく、あくまで「チェックポイントの指摘」として出力する
2. リスクレベルは客観的に判断する（ユーザーに過度な不安を与えない）
3. 改善案は具体的な条文案で示す
4. 欠落している重要条項（不可抗力、瑕疵担保等）があれば missingClauses で指摘する
5. 契約書でないテキストが入力された場合は、riskScore: -1 として "summary" にその旨を記載する`;
}
```

---

## 課金システム

### 利用制限
- 無料: 2件/月（localStorageでカウント管理）
- Pro: 無制限

### 利用回数管理（src/lib/contract/usage.ts）

```typescript
const FREE_MONTHLY_LIMIT = 2;
const STORAGE_KEY = 'contract_usage';

export function getUsageThisMonth(): number {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return 0;
  const parsed = JSON.parse(data);
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  if (parsed.month !== currentMonth) return 0;
  return parsed.count;
}

export function incrementUsage(): void {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const current = getUsageThisMonth();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ month: currentMonth, count: current + 1 }));
}

export function canUse(): boolean {
  if (isProUser()) return true;
  return getUsageThisMonth() < FREE_MONTHLY_LIMIT;
}

export function isProUser(): boolean {
  return !!localStorage.getItem('contract_subscription_id');
}

export function getRemainingUses(): number {
  if (isProUser()) return Infinity;
  return FREE_MONTHLY_LIMIT - getUsageThisMonth();
}
```

### Stripe連携

masking-tools / keigo-tools と同じパターン。

**環境変数:**
```
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_CONTRACT_PRO=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
```

**pricing ページ:**

| | Free | Pro |
|--|------|-----|
| 月額 | 0円 | 490円 |
| 分析回数 | 2件/月 | 無制限 |
| リスク検出 | ✅ | ✅ |
| 改善案提示 | ✅ | ✅ |
| 条項対照表 | ✅ | ✅ |
| PDF読み込み | ❌ | ✅ |
| 分析履歴保存 | ❌ | ✅（ローカル） |
| 広告 | あり | なし |

---

## 回数制限到達時のUI

無料回数を使い切ったら:
- 「今月の無料枠（2件）を使い切りました」のバナー表示
- 「Pro プランにアップグレード（月額490円）」ボタン → /pricing へ
- 分析ボタンを無効化
- 「来月1日にリセットされます」のテキスト

---

## PDF読み込み（Pro機能）

```bash
npm install pdfjs-dist
```

```typescript
// src/lib/contract/pdf-reader.ts
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join('') + '\n';
  }
  return text;
}
```

Free ユーザーがPDFをアップロードしようとした場合:
- 「PDF読み込みはProプラン限定機能です」のメッセージ
- テキストの直接貼り付けを案内

---

## SEOコンテンツ（フッター上部、アコーディオン形式）

**「契約書チェックとは」**
契約書チェック（契約書レビュー）とは、契約書に記載された条項を精査し、不利な条件やリスクがないかを確認する作業。特にフリーランスや中小企業にとって、不利な契約条件を見逃すことは事業に大きな影響を与える可能性がある。

**「チェックすべき重要ポイント」**
- 損害賠償の上限: 無制限の賠償責任は受注側にとって大きなリスク
- 支払条件: 支払サイト60日超は資金繰りに影響
- 知的財産権: 成果物の帰属を明確にする
- 競業避止: 過度な制限はフリーランスの生計に影響
- 自動更新: 解約通知期間を見落とすと自動延長

**「よくある質問（FAQ）」**
- Q: 法的助言として使えますか？ → A: いいえ。本ツールはAIによる参考分析であり、法的助言ではありません。重要な契約については必ず弁護士にご相談ください。
- Q: 契約書のデータはサーバーに保存されますか？ → A: いいえ。分析のためにAI（Claude）に一時的に送信されますが、分析後にデータは破棄されます。サーバーへの永続的な保存は行いません。
- Q: どのような契約書に対応していますか？ → A: 業務委託、NDA、売買、賃貸借、雇用、ライセンスなど、日本法に基づく一般的な契約書に対応しています。
- Q: 英語の契約書も分析できますか？ → A: 現在は日本語の契約書のみ対応しています。

---

## SEO対策

メタデータ:
- title: 「契約書チェッカー | AIが契約書のリスク・不利条項を自動検出」
- description: 「契約書を貼り付けるだけで、AIがリスクスコア・不利条項・改善案を瞬時に分析。業務委託・NDA・売買契約など全12カテゴリの条項をチェック。フリーランス・中小企業の契約書レビューに。」
- keywords: 「契約書 チェック, 契約書 レビュー, 契約書 リスク, 業務委託 契約書, NDA チェック」

構造化データ: WebApplication schema
OGP設定
sitemap.xml 生成

---

## tokushoho（特定商取引法に基づく表記）

keigo-tools と同じ構成で販売価格を「Pro プラン 月額490円（税込）」に変更。

---

## ディレクトリ構造

```
contract-tools/
  src/
    app/
      layout.tsx
      page.tsx
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
        analyze/
          route.ts
        checkout/
          route.ts
        webhook/
          route.ts
        portal/
          route.ts
    components/
      contract/
        contract-checker.tsx    # メインコンポーネント
        type-selector.tsx       # Step 1: 契約書タイプ・立場選択
        contract-input.tsx      # Step 2: テキスト入力 / ファイルアップロード
        analysis-result.tsx     # Step 3: 分析結果（タブ管理）
        summary-tab.tsx         # タブA: 概要・要約
        risks-tab.tsx           # タブB: リスク詳細カード
        articles-tab.tsx        # タブC: 条項対照表
        risk-gauge.tsx          # リスクスコアゲージ
        risk-card.tsx           # 個別リスクカード
        usage-banner.tsx        # 利用回数表示
        pricing-table.tsx       # 料金比較テーブル
      common/
        header.tsx
        footer.tsx
        theme-toggle.tsx
        disclaimer-banner.tsx   # 免責バナー
    lib/
      contract/
        prompts.ts
        usage.ts
        types.ts
        sample-contract.ts     # サンプル契約書データ
        pdf-reader.ts          # PDF テキスト抽出
      stripe/
        client.ts
  public/
    pdf.worker.min.js          # pdfjs-dist のワーカーファイル
```

---

## 注意事項

- npm install: `@anthropic-ai/sdk`, `stripe`, `pdfjs-dist`
- pdfjs-dist のワーカーファイルを public/ に配置（ビルド時にコピー）
- Claude APIのmax_tokensは4000（契約書分析は出力が長いため）
- JSON パースに失敗した場合のフォールバック表示を実装
- 免責バナーは全ページで常時表示（閉じるボタンなし）
- API Route は Node.js Runtime
- UIテキストは全て日本語
- npm run build が通ることを確認
- Stripe連携のテストはローカルで .env.local 設定後に行う（デプロイは別セッション）
