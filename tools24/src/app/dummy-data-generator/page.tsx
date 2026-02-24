import type { Metadata } from "next";
import { DummyDataGenerator } from "@/components/dummy-data-generator/dummy-data-generator";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { RelatedTools } from "@/components/common/related-tools";

export const metadata: Metadata = {
  title: "ダミーデータ生成ツール - 日本の住所・名前・電話番号をテスト用に自動生成 | tools24.jp",
  description:
    "日本の氏名・住所・電話番号・メール・会社名・マイナンバーなど22種類のテストデータをブラウザだけで瞬時に生成。CSV/JSON/TSV/SQL形式でダウンロード可能。データは送信されません。",
  openGraph: {
    title: "ダミーデータ生成ツール - 日本の住所・名前・電話番号をテスト用に自動生成 | tools24.jp",
    description:
      "日本の氏名・住所・電話番号・メール・会社名・マイナンバーなど22種類のテストデータをブラウザだけで瞬時に生成。CSV/JSON/TSV/SQL形式でダウンロード可能。データは送信されません。",
    url: "https://tools24.jp/dummy-data-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ダミーデータ生成ツール",
  description:
    "日本の氏名・住所・電話番号・メール・会社名・マイナンバーなど22種類のテストデータをブラウザで生成",
  url: "https://tools24.jp/dummy-data-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function DummyDataGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <AdPlaceholder slot="top-banner" width={728} height={90} />
        </div>

        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "ホーム", href: "/" },
              { label: "ダミーデータ生成ツール" },
            ]}
          />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">ダミーデータ生成ツール</h1>
            <p className="text-muted-foreground">
              日本のリアルなテストデータを瞬時に生成。氏名・住所・電話番号・会社名など22種類。全てブラウザ完結、データ送信なし。
            </p>
          </div>

          <DummyDataGenerator />

          <div className="flex justify-center my-8">
            <AdPlaceholder slot="middle-rect" width={336} height={280} />
          </div>

          {/* SEO コンテンツ */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">生成できるデータの種類</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 not-prose mb-6">
              {[
                {
                  category: "個人情報",
                  items: ["氏名（漢字・カタカナ・ローマ字）", "性別", "年齢・生年月日", "メールアドレス", "電話番号"],
                },
                {
                  category: "住所",
                  items: ["郵便番号", "都道府県（全47都道府県）", "市区町村・町名", "番地", "建物名・部屋番号"],
                },
                {
                  category: "ビジネス",
                  items: ["会社名（株式会社/合同会社）", "部署名", "役職"],
                },
                {
                  category: "Web/IT",
                  items: ["ユーザーID", "パスワード", "IPアドレス", "MACアドレス", "クレジットカード番号（テスト用）", "マイナンバー"],
                },
              ].map((group) => (
                <div key={group.category} className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">{group.category}</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {group.items.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">出力フォーマット</h2>
            <div className="overflow-x-auto not-prose mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-3 py-2 text-left">形式</th>
                    <th className="border px-3 py-2 text-left">用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-3 py-2 font-mono">テーブル</td>
                    <td className="border px-3 py-2">ブラウザ上でのプレビュー・確認</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2 font-mono">JSON</td>
                    <td className="border px-3 py-2">APIモックデータ・JavaScriptアプリのテスト</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2 font-mono">CSV</td>
                    <td className="border px-3 py-2">Excel・スプレッドシートへのインポート</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2 font-mono">TSV</td>
                    <td className="border px-3 py-2">タブ区切り形式・各種データベースツール</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2 font-mono">SQL</td>
                    <td className="border px-3 py-2">MySQLやPostgreSQLへの直接インポート（INSERT文生成）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "生成されたデータは実在の個人情報ですか？",
                  a: "いいえ。全てアルゴリズムで生成されるフィクションデータです。実在の人物・住所・電話番号とは一切関係ありません。",
                },
                {
                  q: "クレジットカード番号は本物ですか？",
                  a: "いいえ。「9999」「9998」「9997」「9996」で始まるテスト専用プレフィックスを使用しており、実在のカードネットワークには属しません。Luhnチェックは通りますが、決済には使用できません。",
                },
                {
                  q: "マイナンバーは実在のものですか？",
                  a: "いいえ。マイナンバーの公式チェックデジットアルゴリズムに基づいて生成した架空の番号です。実在のマイナンバーとは一切関係ありません。",
                },
                {
                  q: "データはサーバーに送信されますか？",
                  a: "送信されません。全ての処理はお使いのブラウザ内で完結しています。",
                },
                {
                  q: "一度に何件まで生成できますか？",
                  a: "最大500件まで生成できます。",
                },
              ].map((faq, i) => (
                <details key={i} className="border rounded-md">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-muted/50">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedTools currentPath="/dummy-data-generator" />
        </div>

        <div className="flex justify-center mt-12">
          <AdPlaceholder slot="bottom-rect" width={336} height={280} />
        </div>
      </div>
    </>
  );
}
