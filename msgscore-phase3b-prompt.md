# MsgScore — Phase 3-B: Team Pro 自動化・連携
## Claude Code 開発プロンプト

---

## 前提
Phase 3-A（Team Pro組織学習コア）まで実装済みのプロジェクトに追加実装する。
デザインディレクション（Editorial Dashboard）は維持。
既存のフィードバック収集・組織ナレッジ・承認フローをそのまま活かすこと。

---

## Phase 3-B のゴール
Team Proの「手が離せる」を実現する自動化・外部連携機能を構築。
配信実績CSVインポートで過去データを活かしたスコアリング、Slack通知で承認フローをリアルタイム化、外部APIで既存ワークフローとの統合を可能にする。

---

## 1. 配信実績CSVインポート

### 1.1 DBテーブル

Phase 2.5のDB設計で campaign_results テーブルが定義済みの場合はそれを使用。なければ以下を追加。

```sql
-- 配信実績（CSVインポート）
create table if not exists campaign_results (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  date date,
  channel text,                     -- 'email' / 'line'
  subject text,
  body text,
  recipients int,
  open_rate decimal,
  ctr decimal,
  cv_count int,
  cv_type text,                     -- 'purchase' / 'click' / 'signup' / 'visit' / 'inquiry'
  imported_by uuid references auth.users,
  import_batch_id text,             -- 同一インポートのグルーピング用
  imported_at timestamp default now()
);

create index idx_campaign_results_team on campaign_results(team_id, date desc);
create index idx_campaign_results_batch on campaign_results(import_batch_id);

-- RLS
alter table campaign_results enable row level security;
create policy "Team members can view campaign results"
  on campaign_results for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));
```

### 1.2 CSVインポートページ

```
src/app/team/import/page.tsx
```

Team Pro管理者のみアクセス可能。

```
┌─ 📥 配信実績インポート ──────────────────────────────┐
│                                                       │
│  過去の配信実績をインポートして、組織のナレッジを強化       │
│  しましょう。インポートした実績はスコアリングの精度向上     │
│  に活用されます。                                       │
│                                                       │
│  ── CSVファイルを選択 ──                                │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │   📄 ここにCSVファイルをドロップ                     │  │
│  │   または [ファイルを選択]                            │  │
│  │                                                   │  │
│  │   対応形式: CSV (UTF-8 / Shift-JIS)               │  │
│  │   [テンプレートをダウンロード]                        │  │
│  │                                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 1.3 CSVフォーマット

テンプレートCSV（ダウンロード提供、BOM-UTF8）:

```csv
date,channel,subject,body,recipients,open_rate,ctr,cv_count,cv_type
2026-01-15,email,【限定】春コスメ50%OFF,,10000,23.4,4.7,47,purchase
2026-01-25,line,,🌸春コスメ特集！今だけ全品送料無料✨,8000,62.1,8.3,94,purchase
```

- **必須カラム**: channel, subject（LINEの場合はbodyでも可）
- **任意カラム**: date, body, recipients, open_rate, ctr, cv_count, cv_type
- **エンコーディング**: UTF-8（BOM付き/なし）とShift-JIS を自動判定

### 1.4 パース・バリデーション処理

```typescript
// src/lib/csv-import.ts

interface CsvParseResult {
  records: CampaignRecord[];
  errors: CsvError[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    channels: { email: number; line: number };
    dateRange: { from: string; to: string } | null;
    avgOpenRate: number | null;
    avgCtr: number | null;
  };
}
```

バリデーションルール:
- channel が 'email' / 'line' のいずれか（大文字小文字不問、メール/LINE等の日本語も許容→変換）
- subject or body のいずれかが必須（空の場合はエラー行としてスキップ）
- open_rate: 0-100 の範囲（%）。100超はエラー
- ctr: 0-100 の範囲
- cv_count: 0以上の整数
- date: YYYY-MM-DD or YYYY/MM/DD（空OK）
- recipients: 正の整数（空OK）

### 1.5 プレビュー画面

パース完了後、インポート確定前にプレビューを表示:

```
┌─ 📊 インポートプレビュー ────────────────────────────┐
│                                                       │
│  ファイル: campaign_data_2025.csv                      │
│  有効行数: 47件 / 全50行（3件スキップ）                  │
│                                                       │
│  ── サマリー ──                                        │
│  期間: 2025-01-15 〜 2026-01-25                       │
│  チャネル: メール 32件 / LINE 15件                      │
│  平均開封率: 24.2%（メール）/ 63.8%（LINE）             │
│  平均CTR: 5.1%（メール）/ 8.7%（LINE）                  │
│                                                       │
│  ── スキップされた行 ──                                 │
│  行3: channelが不正（"instagram"）                      │
│  行28: subject と body の両方が空                       │
│  行45: open_rate が 150%（範囲外）                      │
│                                                       │
│  ── プレビュー（先頭5件）──                              │
│  | 日付       | CH   | 件名              | 開封率 | CTR |│
│  | 2025-01-15 | email | 【限定】春コスメ... | 23.4% | 4.7%|│
│  | 2025-01-25 | line  | 🌸春コスメ特集... | 62.1% | 8.3%|│
│  | ...                                                |│
│                                                       │
│  [インポートを実行]  [キャンセル]                        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 1.6 インポート実行 + 傾向分析

「インポートを実行」クリック時:

1. campaign_results テーブルに全レコードをバルクINSERT（import_batch_id付き）
2. Claude APIで傾向分析を非同期実行
3. 分析結果を organization_knowledge テーブルに保存（source: 'csv_import'）

傾向分析プロンプト:

```
以下は過去の配信実績データです。
配信文の傾向を分析し、今後のスコアリングに活かせるインサイトを抽出してください。

## 実績データ（{count}件）
{records を channel ごとにグルーピングして列挙}

## 分析観点
- 件名/本文に含まれるキーワードと開封率の相関
- チャネル別の平均値と特徴
- 曜日・時期の傾向（dateがある場合）
- 高パフォーマンス配信の共通点
- 低パフォーマンス配信の共通点
- コンバージョンタイプ別の傾向

## 出力形式
箇条書きで、スコアリングプロンプトに注入できる形式にしてください。
具体的な数値（平均開封率、件数）を必ず含めてください。

【配信実績から得られたインサイト（{count}件の実績から）】
- インサイト1
- インサイト2
...
```

### 1.7 インポート履歴

```
src/app/team/import/history/page.tsx
```

```
┌─ 📥 インポート履歴 ──────────────────────────────────┐
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ 2026-02-22  campaign_data_2025.csv  47件        │   │
│  │ 分析済み ✅  [分析結果を見る]  [データを削除]      │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ 2026-02-15  line_results_jan.csv  12件          │   │
│  │ 分析済み ✅  [分析結果を見る]  [データを削除]      │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 2. 実績ベーススコアリング

### 2.1 スコアリングプロンプトへの注入

チームに campaign_results が存在する場合、スコアリング時に類似配信の実績をプロンプトに含める。

```typescript
// src/lib/scoring.ts の buildSystemPrompt() に追加

async function findSimilarCampaigns(teamId: string, channel: string, text: string) {
  // 1. 同チーム・同チャネルの campaign_results を取得（直近100件）
  // 2. テキストのキーワード類似度で上位3件を抽出（簡易: 件名のキーワードマッチ）
  // 3. 実績データを返す
}
```

プロンプト注入:

```
## 類似配信の過去実績（参考データ）

以下は同組織で過去に配信された類似コンテンツの実績です。
スコアリングの参考にしてください。

【類似配信1】
件名: 「{subject}」
チャネル: {channel}
開封率: {open_rate}% / CTR: {ctr}%
配信数: {recipients}件 / CV数: {cv_count}件

【類似配信2】
...

これらの実績を踏まえ、予測数値をより現実的に調整してください。
特に開封率とCTRの予測は、類似実績の数値を基準として±5%の範囲内で調整してください。
```

### 2.2 結果表示への反映

スコアリング結果画面の予測インパクトセクションに参考表示:

```
── 予測インパクト ──
現在: 開封率 23.4%（2,340件）
改善後: 開封率 28.7%（2,870件）

📊 類似配信の実績（参考）
  「【限定】春コスメ50%OFF」→ 開封率 23.4%
  「🌸春の新作コスメご紹介」→ 開封率 26.1%
```

デザイン: 小さめのテキスト、bg-stone-50 rounded-lg p-3、text-xs text-stone-500

---

## 3. Slack通知

### 3.1 Slack連携設定

```
src/app/team/settings/slack/page.tsx
```

Slack Incoming Webhookを使用（最もシンプル）。OAuth不要。

```
┌─ 🔔 Slack連携設定 ───────────────────────────────────┐
│                                                       │
│  Slackに通知を送信して、チームのスコアリング状況を        │
│  リアルタイムに把握できます。                             │
│                                                       │
│  ── Webhook URL ──                                    │
│  [ https://hooks.slack.com/services/T.../B.../xxx ]   │
│                                                       │
│  Slackアプリの設定方法:                                  │
│  1. Slack で「Incoming Webhooks」アプリを追加            │
│  2. 通知を受け取るチャンネルを選択                        │
│  3. Webhook URLをコピーしてここに貼り付け                 │
│  [設定ガイドを見る]                                      │
│                                                       │
│  ── 通知する条件 ──                                     │
│  ☑ 最低スコアライン未達時                                │
│  ☑ 承認リクエスト発生時                                  │
│  ☑ 承認完了 / 修正依頼時                                 │
│  ☐ 全スコアリング実行時（チーム全体）                      │
│  ☐ フィードバック投稿時                                   │
│                                                       │
│  [テスト送信]  [保存]                                    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 3.2 DBカラム追加

brand_voice テーブル or 新テーブル:

```sql
-- Slack設定をteams テーブルに追加するか、別テーブルを作成
-- シンプルにteamsへカラム追加を推奨
alter table teams add column if not exists slack_webhook_url text;
alter table teams add column if not exists slack_notifications jsonb default '{"min_score": true, "approval_request": true, "approval_complete": true, "all_scoring": false, "feedback": false}';
```

### 3.3 通知メッセージフォーマット

```typescript
// src/lib/slack.ts

interface SlackNotification {
  type: 'min_score' | 'approval_request' | 'approval_complete' | 'approval_revision' | 'all_scoring' | 'feedback';
  teamId: string;
}

// 最低スコア未達
{
  blocks: [
    {
      type: "header",
      text: { type: "plain_text", text: "⚠️ 最低スコアライン未達" }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*メンバー*\n木村 遼" },
        { type: "mrkdwn", text: "*スコア*\n58 / 65（最低ライン）" }
      ]
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: "*チャネル*: メール件名\n*テキスト*: 「【激安】春セール開始！」" }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "結果を確認" },
          url: "https://msg-scorer.vercel.app/history/{scoreId}"
        }
      ]
    }
  ]
}

// 承認リクエスト
{
  blocks: [
    {
      type: "header",
      text: { type: "plain_text", text: "📋 承認リクエスト" }
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: "木村 遼さんのスコアリング結果が最低ラインを下回りました。承認または修正依頼をしてください。" }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "承認画面を開く" },
          url: "https://msg-scorer.vercel.app/team/approvals",
          style: "primary"
        }
      ]
    }
  ]
}
```

### 3.4 送信処理

```typescript
// src/lib/slack.ts
export async function sendSlackNotification(teamId: string, notification: SlackNotification) {
  const team = await getTeamById(teamId);
  if (!team.slack_webhook_url) return;

  const settings = team.slack_notifications;
  if (!settings[notification.type]) return;

  const message = buildSlackMessage(notification);
  
  await fetch(team.slack_webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}
```

### 3.5 通知トリガーの組込み

各API Routeに通知呼び出しを追加:

| トリガー | 場所 | 通知タイプ |
|---------|------|----------|
| スコアリング結果が最低ライン未達 | /api/score | min_score |
| 承認リクエスト自動生成 | /api/score | approval_request |
| 管理者が承認 | /api/team/approvals | approval_complete |
| 管理者が修正依頼 | /api/team/approvals | approval_revision |
| 全スコアリング（オプション） | /api/score | all_scoring |
| フィードバック投稿（オプション） | /api/feedback/submit | feedback |

---

## 4. 外部APIアクセス

### 4.1 APIキー管理

```sql
-- APIキーテーブル
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  key_hash text not null,           -- SHA-256ハッシュ（平文は表示時のみ）
  key_prefix text not null,         -- 先頭8文字（表示用）
  name text not null default 'Default',  -- キーの名前
  created_by uuid references auth.users not null,
  last_used_at timestamp,
  created_at timestamp default now(),
  revoked_at timestamp              -- NULLでない場合は無効化済み
);

create index idx_api_keys_team on api_keys(team_id);
create index idx_api_keys_hash on api_keys(key_hash);

alter table api_keys enable row level security;
create policy "Team owners can manage api keys"
  on api_keys for all
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active' and role = 'owner'
  ));
```

### 4.2 APIキー管理画面

```
src/app/team/settings/api/page.tsx
```

Team Pro管理者のみアクセス可能。

```
┌─ 🔑 APIキー管理 ─────────────────────────────────────┐
│                                                       │
│  MsgScoreのスコアリングAPIを外部から呼び出せます。        │
│  MAツール連携や自動化スクリプトに利用してください。        │
│                                                       │
│  ── アクティブなキー ──                                 │
│  ┌────────────────────────────────────────────────┐   │
│  │ 📌 本番用                                       │   │
│  │ msk_prod_xxxxxxxx...  作成: 2026-02-22          │   │
│  │ 最終利用: 2026-02-22 14:30                      │   │
│  │ [無効化]                                         │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  [+ 新しいAPIキーを生成]                                │
│                                                       │
│  ── APIドキュメント ──                                  │
│  エンドポイント: POST https://msg-scorer.vercel.app/api/v1/score │
│  [APIドキュメントを見る]                                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

APIキー生成時:
1. crypto.randomUUID() でキーを生成（プレフィックス `msk_` 付き）
2. SHA-256ハッシュをDBに保存
3. 平文はこの1回のみ表示（コピー用モーダル）

```
⚠️ このAPIキーは一度しか表示されません。安全な場所に保存してください。

msk_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

[コピー]
```

### 4.3 外部スコアリングAPI

```
src/app/api/v1/score/route.ts
```

**認証**: `Authorization: Bearer msk_xxxxx` ヘッダー

**リクエスト**:
```json
POST /api/v1/score
Content-Type: application/json
Authorization: Bearer msk_xxxxx

{
  "channel": "email_subject",
  "text": "【限定】春コスメ50%OFF",
  "audience": {
    "presetName": "女性誌読者",
    "totalRecipients": 10000,
    "gender": { "female": 70, "male": 25, "other": 5 },
    "age": { "under20": 5, "twenties": 30, "thirties": 35, "forties": 20, "fifties": 8, "sixtiesPlus": 2 },
    "deviceMobile": 75,
    "existingCustomer": 60,
    "avgOpenRate": 23,
    "avgCtr": 4.5
  },
  "conversionGoal": "purchase"
}
```

**audience** は任意。省略時はデフォルトセグメント（EC全体プリセット相当）を使用。

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "totalScore": 72,
    "axes": [
      { "name": "開封誘引力", "score": 82, "feedback": "..." },
      ...
    ],
    "improvements": ["改善案1", "改善案2", "改善案3"],
    "abVariants": [...],
    "currentImpact": { "openRate": 23.4, "openCount": 2340, "ctr": 4.7, "clickCount": 468 },
    "improvedImpact": { "openRate": 28.7, "openCount": 2870, "ctr": 6.3, "clickCount": 631 }
  }
}
```

**エラーレスポンス**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "APIキーが無効です。"
  }
}
```

エラーコード:
| コード | HTTPステータス | 説明 |
|--------|-------------|------|
| INVALID_API_KEY | 401 | キーが無効 or 無効化済み |
| TEAM_NOT_PRO | 403 | Team Proプランではない |
| RATE_LIMITED | 429 | レート制限（1,000回/日） |
| INVALID_INPUT | 400 | リクエストボディ不正 |
| SCORING_FAILED | 500 | AI処理エラー |

### 4.4 レート制限

Team ProのAPIアクセスは1,000回/日。daily_usage テーブルで管理。

```typescript
// api_key ごとの日次利用数チェック
const today = new Date().toISOString().split('T')[0];
const usage = await getApiUsage(apiKeyId, today);
if (usage >= 1000) {
  return Response.json({ success: false, error: { code: 'RATE_LIMITED', message: 'API利用上限（1,000回/日）に達しました' } }, { status: 429 });
}
```

### 4.5 APIドキュメントページ

```
src/app/team/settings/api/docs/page.tsx
```

シンプルな静的ページ。以下のセクション:
- 認証方法
- エンドポイント一覧（v1/score のみ）
- リクエスト/レスポンスの仕様
- サンプルコード（curl / JavaScript / Python）
- エラーコード一覧
- レート制限

```
── サンプルコード ──

▼ curl
curl -X POST https://msg-scorer.vercel.app/api/v1/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer msk_xxxxx" \
  -d '{
    "channel": "email_subject",
    "text": "【限定】春コスメ50%OFF",
    "conversionGoal": "purchase"
  }'

▼ JavaScript (fetch)
const response = await fetch('https://msg-scorer.vercel.app/api/v1/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer msk_xxxxx',
  },
  body: JSON.stringify({
    channel: 'email_subject',
    text: '【限定】春コスメ50%OFF',
    conversionGoal: 'purchase',
  }),
});
const data = await response.json();

▼ Python (requests)
import requests

response = requests.post(
    'https://msg-scorer.vercel.app/api/v1/score',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer msk_xxxxx',
    },
    json={
        'channel': 'email_subject',
        'text': '【限定】春コスメ50%OFF',
        'conversionGoal': 'purchase',
    },
)
data = response.json()
```

---

## 5. ナビゲーション更新

チーム設定ページにサブナビ追加:

```
⚙️ チーム設定
  ├ 基本情報
  ├ プラン・請求
  ├ 🔔 Slack連携     ← NEW
  ├ 🔑 APIキー       ← NEW
  └ 📥 CSVインポート  ← NEW（またはチームダッシュボードのタブ）
```

チームダッシュボードのタブ:

```
Team Pro: [📊 統計] [👥 メンバー] [🎨 ブランド設定] [🧠 ナレッジ] [📋 承認] [📈 FB傾向] [📥 インポート] [⚙️ 設定]
```

---

## 6. 新規ページ・ルート一覧

```
src/app/
  team/
    import/
      page.tsx                          — CSVインポート画面
      history/page.tsx                  — インポート履歴
    settings/
      slack/page.tsx                    — Slack連携設定
      api/
        page.tsx                        — APIキー管理
        docs/page.tsx                   — APIドキュメント
  api/
    v1/
      score/route.ts                    — 外部スコアリングAPI
    team/
      import/route.ts                   — CSVインポート処理
      import/analyze/route.ts           — 傾向分析（非同期）
      import/history/route.ts           — インポート履歴
      import/template/route.ts          — テンプレートCSVダウンロード
      settings/
        slack/route.ts                  — Slack設定CRUD + テスト送信
        api-keys/route.ts              — APIキー生成・一覧・無効化
```

---

## 7. スコアリングAPI更新

`/api/score` の追加更新:

1. Team Proチームで campaign_results が存在する場合:
   - findSimilarCampaigns() で類似配信を検索
   - システムプロンプトに類似実績を注入
2. Slack通知:
   - 最低スコアライン未達時に sendSlackNotification() を呼び出し
   - 承認リクエスト生成時にも通知

---

## 8. Team Pro機能ゲーティング追加

Team（非Pro）プランで以下にアクセスした場合:
- CSVインポートページ
- Slack連携設定
- APIキー管理
- APIドキュメント

→ ぼかし + アップグレードオーバーレイ（Phase 3-Aと同様のパターン）

---

## 9. 料金ページ更新

Team vs Team Pro の比較テーブルに追加:

| 機能 | Team | Team Pro |
|------|------|----------|
| 配信実績CSVインポート | — | ✓ |
| 過去実績ベースのスコアリング | — | ✓ |
| Slack通知 | — | ✓ |
| 外部API（1,000回/日） | — | ✓ |

---

## 10. 技術的な注意事項

- CSVパース: PapaParseライブラリを使用（`npm install papaparse`）。Shift-JIS対応には `encoding-japanese` or `iconv-lite` を使用
- CSVインポートのファイルサイズ上限: 5MB（Vercel Serverless Functionの制限を考慮）
- 傾向分析のClaude API呼び出しは非同期。インポート完了画面で「分析中...」を表示し、完了後にナレッジページで確認可能
- Slack Webhook URLはサーバーサイドのみで使用。クライアントに露出させない
- APIキーの平文はDB保存しない。SHA-256ハッシュのみ保存。表示は生成時の1回のみ
- 外部APIのレスポンスにはbrandVoice/orgKnowledgeの影響を含める（チームの学習が外部連携にも反映）
- CSVインポート時のバルクINSERTはトランザクションで実行（途中失敗時にロールバック）
- APIドキュメントはSSGで静的生成（頻繁に変わらない）
- デザインはEditorial Dashboardテイスト維持

---

## 11. 最終チェックリスト

### CSVインポート
- [ ] テンプレートCSVがダウンロードできる
- [ ] UTF-8 / Shift-JIS の両方が正しくパースされる
- [ ] バリデーションエラーがプレビューに表示される
- [ ] インポート実行で campaign_results にデータが保存される
- [ ] 傾向分析が自動実行され organization_knowledge に保存される
- [ ] インポート履歴が表示される
- [ ] データ削除が動作する

### 実績ベーススコアリング
- [ ] campaign_results がある場合、類似配信が検索される
- [ ] 類似実績がスコアリングプロンプトに注入される
- [ ] 結果画面に類似配信の参考表示がある

### Slack通知
- [ ] Webhook URL設定・保存が動作する
- [ ] テスト送信が動作する
- [ ] 通知条件のチェックボックスが保存される
- [ ] 最低スコア未達時にSlack通知が送信される
- [ ] 承認リクエスト時にSlack通知が送信される
- [ ] 承認/修正依頼時にSlack通知が送信される
- [ ] Webhook URL未設定の場合にエラーにならない（静かにスキップ）

### 外部API
- [ ] APIキー生成・表示（1回のみ）が動作する
- [ ] APIキー無効化が動作する
- [ ] Bearer認証が正しく動作する
- [ ] スコアリングが正常に実行される（brandVoice/orgKnowledge反映含む）
- [ ] レート制限（1,000回/日）が動作する
- [ ] エラーレスポンスが仕様通り
- [ ] APIドキュメントページが表示される
- [ ] サンプルコード（curl/JS/Python）が正確

### ゲーティング
- [ ] Team（非Pro）で上記機能にアクセス → ぼかし+オーバーレイ
- [ ] 料金ページにCSVインポート/Slack/APIの比較行が追加されている
