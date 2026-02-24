import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '機能一覧 | MsgScore',
  description: 'MsgScoreの各機能について詳しく説明します。Free・Pro・Team・Team Proで使える機能の違いを確認できます。',
};

// ─────────────────────────────────────────────────────────────────────
// ⚠️ MAINTENANCE NOTE
// このページは料金ページ（PricingSection.tsx）の機能行と同期が必要です。
// 機能を追加・変更したときは必ずここも更新してください。
// 最終更新: 2026-02-23
// ─────────────────────────────────────────────────────────────────────

interface FeatureItem {
  name: string;
  desc: string;
  plan: 'free' | 'pro' | 'team' | 'team_pro';
}

const features: FeatureItem[] = [

  // ── 基本AI機能（全プラン共通） ─────────────────────────────────
  {
    name: 'AI 5軸スコアリング',
    desc: 'メール件名・メール本文・LINE配信文を5つの評価軸でAIが0〜100点でスコアリングします。\n\n• 開封誘引力（重み25%）：セグメントの読者が開きたくなるか。年代・性別に合ったフックがあるか\n• 読了性（重み20%）：最後まで読んでもらえるか。モバイル率を考慮した構造か\n• CTA強度（重み20%）：購入・クリック・申込など配信目的に応じた行動喚起の強さ\n• ターゲット適合度（重み20%）：セグメントのトーン・年代・敬語レベルとの整合性\n• 配信適正（重み15%）：スパム判定リスク・文字数・チャネル固有の制約への準拠\n\n配信先の性別・年代・モバイル率・既存顧客率を設定するほど評価の精度が上がります。',
    plan: 'free',
  },
  {
    name: 'A/Bバリアント + 改善案 3点',
    desc: '入力テキストの課題を踏まえた具体的な改善案を3点と、A/Bテスト用の改善バリアント2パターン（A案・B案）を生成します。\n\nA案・B案にはそれぞれ予測開封率・CTR・コンバージョン率が付いているので、どちらを採用するか定量的に判断できます。「緊急性訴求重視」「パーソナル語りかけ重視」など異なるアプローチで生成されるため、A/Bテストの候補文として直接使えます。',
    plan: 'free',
  },
  {
    name: '予測インパクト（開封率・CTR・CV数）',
    desc: '現在のテキストと改善後のテキストで、それぞれ期待できる指標を予測します。\n\n• 開封率・開封数\n• CTR（クリック率）・クリック数\n• コンバージョン率・CV数（購入数 / クリック数 / 申込数など目的によって変化）\n\n配信母数を入力しておくことで、改善によって「あと何件売れそうか」まで可視化できます。',
    plan: 'free',
  },
  {
    name: 'メール件名 / メール本文 / LINE対応',
    desc: '3つのチャネルに対応しています。\n\n• メール件名：15〜25文字が最適とされる件名の文字数を色でガイド\n• メール本文：任意で件名も合わせて評価。本文全体の読了性・CTAを採点\n• LINE配信文：500文字制限（LINE公式アカウントの1吹き出し）を超えると警告\n\nチャネルごとに評価基準が異なるため、同じテキストでも適切な視点で採点されます。',
    plan: 'free',
  },

  // ── 利用制限・保存 ──────────────────────────────────────────────
  {
    name: '利用回数：1日5回（Free）→ 無制限（Pro以上）',
    desc: 'Freeプランは1日5回まで無料でスコアリングできます。Pro以上は回数制限なしで何回でも使えます。チームメンバーもPro相当の無制限利用が可能です。\n\n日次の利用回数は日本時間の0:00にリセットされます。',
    plan: 'free',
  },
  {
    name: 'スコアリング履歴：7日間（Free）→ 無制限（Pro以上）',
    desc: 'スコアリング結果は自動的に履歴として保存されます。\n\n• Freeプラン：直近7日間のみ保存。8日前以前の結果は閲覧不可\n• Pro以上：無制限保存。過去すべての結果を振り返れる\n\n履歴から過去の件名・スコアを見返すことで、自分の傾向や改善パターンを把握できます。',
    plan: 'free',
  },
  {
    name: 'CSV出力',
    desc: 'スコアリング履歴をCSV形式でダウンロードできます。チャネル・テキスト・スコア・5軸スコア・日時が含まれ、Excelでの集計や社内レポートに使えます。BOM付きUTF-8で出力するためExcelで文字化けしません。',
    plan: 'pro',
  },
  {
    name: 'セグメント保存（カスタムセグメント）',
    desc: 'よく使うオーディエンス設定に名前を付けて保存できます。「EC女性30代層」「BtoB IT担当者」など商品・ターゲットごとのセグメントをワンクリックで呼び出せます。\n\n保存上限：Pro・Team：10個 / Team Pro：20個\n\nチームプランでは管理者が「共有プリセット」としてメンバー全員が使えるセグメントを登録することもできます（20個まで）。',
    plan: 'pro',
  },

  // ── Pro個人機能 ───────────────────────────────────────────────
  {
    name: 'プレビュー（iPhone / Gmail / LINE）',
    desc: '実際のデバイス・アプリでどう見えるかをモックで確認できます。\n\n• メール件名：iPhone標準メールの受信トレイ風 / Gmailの受信トレイ風\n• LINE配信文：LINEトーク画面風\n\n文字の切れ方・絵文字の表示・改行のタイミングを配信前に確認でき、「件名が途中で切れていた」「改行が崩れていた」などのミスを防げます。',
    plan: 'pro',
  },
  {
    name: 'スコア推移グラフ',
    desc: '過去のスコアリング結果を時系列で折れ線グラフに可視化します。総合スコアの推移に加え、5軸（開封誘引力・読了性・CTA強度・ターゲット適合度・配信適正）ごとの変化も確認できます。\n\n「件名力は上がっているがCTAが弱い」「先月より全体的にスコアが上がっている」などの傾向把握に使えます。',
    plan: 'pro',
  },

  // ── チーム機能 ────────────────────────────────────────────────
  {
    name: 'チームワークスペース',
    desc: 'メンバーを招待して組織として使えます。管理者（オーナー）がメンバーのスコアリング結果を一元管理できます。\n\n• Team S：5名まで（¥4,980/月）\n• Team M：10名まで（¥8,980/月）\n• Team L：30名まで（¥19,800/月）\n• Team Pro：30名まで（¥39,800/月）\n\nメンバーはメールで招待リンクを受け取り、アカウント登録後に参加できます。',
    plan: 'team',
  },
  {
    name: 'ブランドガイドライン',
    desc: '管理者が設定したルールが、チームメンバーのスコアリングに自動で反映されます。\n\n• ブランドボイス：「丁寧でポジティブなトーンで評価してください」などAIへの指針\n• NGワード：「最安値」「絶対」「保証」など景表法リスクのある言葉を登録すると検出時に配信適正スコアを減点\n• 件名ルール：「【 】で区切った角括弧書き必須」などのルール\n• 共有プリセット：チーム全員が使い回せるセグメント設定を20個まで登録可能',
    plan: 'team',
  },
  {
    name: 'スコア品質管理',
    desc: 'チームの配信品質を維持するための管理機能セットです。\n\n• 最低スコアライン：設定点数を下回った場合に警告表示またはバッジを付与。「70点未満は要注意」などのルールを設定可能\n• 修正依頼：管理者がメンバーのスコアリング結果に「要修正」コメントを送れる。メンバーには通知が届き、修正・再採点を促せる\n• メンバー別統計：メンバーごとの平均スコア・実行回数・軸別の強み弱みをダッシュボードで確認できる',
    plan: 'team',
  },

  // ── Team Pro自動化 ────────────────────────────────────────────
  {
    name: '配信実績の学習（CSVインポート）',
    desc: '過去の配信実績データのCSVをインポートするとAIが傾向分析を行い、組織固有のインサイトを蓄積します。\n\nインポートできる項目：チャネル・配信日・件名・本文・配信数・開封率・CTR・CV数・CV種別\n\n分析例：「件名に数字を入れると開封率が平均+3.2pt高い」「既存顧客向けLINEは絵文字ありで開封率62%台」\n\n蓄積されたインサイトは以降のスコアリングプロンプトに自動注入され、類似配信の実績が予測数値の精度向上に活用されます。',
    plan: 'team_pro',
  },
  {
    name: 'Slack通知',
    desc: 'Slack Incoming Webhookを設定することで、MsgScoreのイベントをSlackチャンネルにリアルタイムで通知できます。\n\n通知できる条件（ON/OFFを個別設定）：\n• 最低スコアライン未達時\n• 承認リクエスト発生時\n• 管理者が承認 / 修正依頼を完了したとき\n• 全スコアリング実行時（チーム全体、高頻度注意）\n• フィードバック投稿時\n\nSlackアプリの「Incoming Webhooks」からWebhook URLを取得して貼り付けるだけで設定完了。OAuth不要。',
    plan: 'team_pro',
  },
  {
    name: '外部API連携（1,000回/日）',
    desc: 'APIキーを発行してMsgScoreのスコアリングを外部から呼び出せます。\n\n活用例：\n• MAツールのシナリオ作成画面にスコアリングを組み込む\n• CMSの入稿フローにスコアチェックを追加する\n• 自社メール配信システムの送信前バリデーションに使う\n\nAPIキーは最大5個まで発行可能。1日1,000回まで利用できます（超過時はHTTP 429）。\n\nチームのブランドボイス・組織ナレッジが外部APIにも自動反映されます。',
    plan: 'team_pro',
  },
];

const planMeta = {
  free:     { label: 'Free',     color: 'bg-stone-100 text-stone-600',     bar: 'bg-stone-200' },
  pro:      { label: 'Pro以上',  color: 'bg-indigo-100 text-indigo-700',   bar: 'bg-indigo-200' },
  team:     { label: 'Team以上', color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-200' },
  team_pro: { label: 'Team Pro', color: 'bg-violet-100 text-violet-700',   bar: 'bg-violet-200' },
};

const sections = [
  { key: 'free'     as const, heading: '── 全プランで使える機能', note: 'Free・Pro・Team・Team Pro すべてで利用可能' },
  { key: 'pro'      as const, heading: '── Pro・Team・Team Pro で使える機能', note: '月¥980のProプランから' },
  { key: 'team'     as const, heading: '── Team・Team Pro で使える機能', note: '月¥4,980〜のTeamプランから' },
  { key: 'team_pro' as const, heading: '── Team Pro 専用機能', note: '自動化・外部連携。月¥39,800' },
];

export default function FeaturesPage() {
  const grouped = sections.map(s => ({
    ...s,
    items: features.filter(f => f.plan === s.key),
  }));

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-stone-400 text-xs uppercase tracking-widest mb-3">Features</p>
          <h1 className="font-outfit font-bold text-3xl text-stone-900 mb-4">機能一覧</h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            MsgScoreの各機能について詳しく説明します。
            どのプランで使えるかも確認できます。
          </p>
        </div>

        {/* Feature sections */}
        <div className="space-y-14">
          {grouped.map(section => (
            <div key={section.key}>
              {/* Section header */}
              <div className="mb-5">
                <h2 className="text-sm font-bold text-stone-800 mb-0.5">{section.heading}</h2>
                <p className="text-xs text-stone-400">{section.note}</p>
              </div>

              <div className="space-y-4">
                {section.items.map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-stone-900 leading-snug">{f.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${planMeta[f.plan].color}`}>
                        {planMeta[f.plan].label}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to pricing */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            料金プランを確認する →
          </Link>
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
