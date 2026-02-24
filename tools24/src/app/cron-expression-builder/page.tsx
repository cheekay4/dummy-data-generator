import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CronBuilder } from "@/components/cron-builder/cron-builder";
import { RelatedTools } from "@/components/common/related-tools";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "Cron式ビルダー - ビジュアルでcron式を作成・日本語で説明",
  description:
    "Cron式をビジュアルで簡単に作成。日本語で実行スケジュールを説明、次回実行日時をJSTで表示。サーバー設定やタスクスケジューラーの設定に。",
  keywords: [
    "cron式",
    "cronビルダー",
    "cron 作成",
    "cron 日本語",
    "cron expression builder",
    "スケジューラー",
  ],
  openGraph: {
    title: "Cron式ビルダー - ビジュアルでcron式を作成・日本語で説明 | tools24.jp",
    description:
      "Cron式をビジュアルで簡単に作成。日本語で実行スケジュールを説明、次回実行日時をJSTで表示。",
    url: "https://tools24.jp/cron-expression-builder",
    type: "website",
  },
  alternates: {
    canonical: "https://tools24.jp/cron-expression-builder",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Cron式ビルダー",
        url: "https://tools24.jp/cron-expression-builder",
        description:
          "Cron式をビジュアルで作成・日本語説明・次回実行日時をJSTで表示。ブラウザ完結。",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
        inLanguage: "ja",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "このツールは無料ですか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "はい、完全無料です。会員登録も不要です。",
            },
          },
          {
            "@type": "Question",
            name: "データはサーバーに送信されますか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "いいえ、全てブラウザ内で処理されます。入力したデータは外部に一切送信されません。",
            },
          },
        ],
      },
    ]),
  },
};

export default function CronExpressionBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 広告: ヘッダー直下 */}
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      {/* パンくずリスト */}
      <Breadcrumb items={[{ label: "Cron式ビルダー" }]} />

      {/* ページタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Cron式ビルダー</h1>
        <p className="text-sm text-muted-foreground">
          ビジュアルでcron式を作成・日本語説明・次回実行日時をJSTで確認。データの送信なし。
        </p>
      </div>

      {/* メイン機能 */}
      <CronBuilder />

      {/* 広告 */}
      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      {/* 関連ツール */}
      <RelatedTools currentPath="/cron-expression-builder" />

      {/* SEOコンテンツ */}
      <section className="mt-12 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Cron式とは</h2>
          <p>
            Cron式（cronジョブ）は、Unix系サーバーでタスクを自動的に定期実行するためのスケジュール記法です。
            「毎日深夜2時にバックアップを実行」「平日9時にメールを送信」といったスケジュールを、
            5つの数値フィールドで簡潔に表現できます。
            AWSのEventBridge、GitHub Actions、Vercel Cron、Laravelのスケジューラーなど、
            多くのシステムで標準的に採用されています。
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Cron式の書き方</h2>
          <p className="mb-3">Cron式は左から順に「分・時・日・月・曜日」の5フィールドをスペースで区切ります。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground">フィールド</th>
                  <th className="px-3 py-2 border font-medium text-foreground">範囲</th>
                  <th className="px-3 py-2 border font-medium text-foreground">説明</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["分（Minute）", "0〜59", "0 = 0分（毎時0分）"],
                  ["時（Hour）", "0〜23", "0 = 0時（深夜）、9 = 午前9時（JST）"],
                  ["日（Day of Month）", "1〜31", "1 = 毎月1日"],
                  ["月（Month）", "1〜12", "1 = 1月、12 = 12月"],
                  ["曜日（Day of Week）", "0〜6", "0または7 = 日曜日、1 = 月曜日"],
                ].map(([field, range, desc]) => (
                  <tr key={field} className="border-b">
                    <td className="px-3 py-2 border font-mono text-foreground">{field}</td>
                    <td className="px-3 py-2 border">{range}</td>
                    <td className="px-3 py-2 border">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 mb-2">特殊文字の使い方:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground">文字</th>
                  <th className="px-3 py-2 border font-medium text-foreground">意味</th>
                  <th className="px-3 py-2 border font-medium text-foreground">例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["*", "すべての値", "* = 毎分、毎時、毎日..."],
                  [",", "複数値の列挙", "1,4,7,10 = 1月・4月・7月・10月"],
                  ["-", "範囲指定", "1-5 = 月曜〜金曜"],
                  ["/", "間隔（ステップ）", "*/5 = 5分ごと、*/2 = 2時間ごと"],
                ].map(([char, meaning, example]) => (
                  <tr key={char} className="border-b">
                    <td className="px-3 py-2 border font-mono text-xl text-foreground">{char}</td>
                    <td className="px-3 py-2 border">{meaning}</td>
                    <td className="px-3 py-2 border font-mono">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">よく使うCron式一覧</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground">Cron式</th>
                  <th className="px-3 py-2 border font-medium text-foreground">説明</th>
                  <th className="px-3 py-2 border font-medium text-foreground">備考</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["* * * * *", "毎分実行", ""],
                  ["0 * * * *", "毎時0分に実行", "1時間ごと"],
                  ["0 0 * * *", "毎日0時0分に実行", "JSTで午前0時（UTCの0時）"],
                  ["0 0 * * 1", "毎週月曜0時0分に実行", "JSTで月曜深夜"],
                  ["0 0 1 * *", "毎月1日0時0分に実行", "月初め"],
                  ["0 0 * * 1-5", "平日（月〜金）0時0分に実行", "平日のみ"],
                  ["*/5 * * * *", "5分ごとに実行", ""],
                  ["0 0 28 * *", "毎月28日0時0分に実行", "全月に存在する月末付近"],
                  ["0 0 1 1,4,7,10 *", "四半期初日0時0分に実行", "1・4・7・10月の1日"],
                  ["0 */2 * * *", "2時間ごとに実行", "0時・2時・4時..."],
                ].map(([expr, desc, note]) => (
                  <tr key={expr} className="border-b">
                    <td className="px-3 py-2 border font-mono text-foreground">{expr}</td>
                    <td className="px-3 py-2 border">{desc}</td>
                    <td className="px-3 py-2 border text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">よくある質問（FAQ）</h2>
          <div className="space-y-3">
            {[
              {
                q: "このツールは無料ですか？",
                a: "はい、完全無料です。会員登録も不要で、全ての機能を無制限でご利用いただけます。",
              },
              {
                q: "データはサーバーに送信されますか？",
                a: "いいえ、全てブラウザ内で処理されます。入力したデータは外部に一切送信されません。",
              },
              {
                q: "JSTとUTCの違いは何ですか？",
                a: "JST（日本標準時）はUTCより9時間進んでいます。多くのクラウドサーバー（AWS、GCPなど）はUTCで動作するため、「JSTの午前9時に実行」したい場合はcron式の時フィールドに「0」（UTC 0時 = JST 9時）を設定します。",
              },
              {
                q: "月の最終日に実行するにはどうすればいいですか？",
                a: "標準的なcron式には「最終日」を表す直接的な記法がありません。28日（全月に存在）を使うか、cronの拡張記法をサポートするシステム（AWSのEventBridgeなど）では「L」記法が使えます。",
              },
              {
                q: "GitHub ActionsのCronはどのタイムゾーンですか？",
                a: "GitHub ActionsのCronはUTC基準です。JSTの午前9時（9:00 JST）に実行したい場合は「0 0 * * *」（UTC 0:00）と設定します。",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="border rounded-lg group" open={i === 0}>
                <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none text-foreground">
                  <span>Q. {q}</span>
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-3 border-t pt-3">A. {a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 広告: フッター上 */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
