import type { Metadata } from "next";
import { MermaidViewerMain } from "@/components/mermaid-viewer/mermaid-viewer-main";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title:
    "Mermaid ダイアグラムビューア — フローチャート・シーケンス図をオンラインで作成",
  description:
    "Mermaid記法でフローチャート、シーケンス図、ER図、ガントチャートをリアルタイムプレビュー。SVG/PNGエクスポート対応。日本語テンプレート付き。登録不要・無料・ブラウザ内で完結。",
  openGraph: {
    title: "Mermaid ダイアグラムビューア | tools24.jp",
    description:
      "Mermaid記法でフローチャート・シーケンス図をリアルタイムプレビュー。SVG/PNGエクスポート対応。",
    url: "https://tools24.jp/mermaid-viewer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mermaid ダイアグラムビューア",
  description:
    "Mermaid記法でフローチャート、シーケンス図、ER図をリアルタイムプレビュー。SVG/PNGエクスポート対応。",
  url: "https://tools24.jp/mermaid-viewer",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
};

export default function MermaidViewerPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <AdPlaceholder position="header" />

        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[{ label: "Mermaid ダイアグラムビューア" }]}
          />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Mermaid ダイアグラムビューア
            </h1>
            <p className="text-base text-blue-600 dark:text-blue-400 font-medium">
              テキストから図を生成。フローチャート、シーケンス図、ER図をリアルタイムプレビュー
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              登録不要 · 完全無料 · データ送信なし
            </p>
          </div>

          <MermaidViewerMain />

          <AdPlaceholder position="content" className="my-8" />

          {/* SEO content */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">Mermaid記法とは</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Mermaidはテキストからダイアグラムを自動生成するDSL（ドメイン固有言語）です。
              GitHubのREADME、Notion、Confluenceなどで標準サポートされており、
              コードブロックに記述するだけで図を表示できます。
            </p>

            <h2 className="text-xl font-semibold mb-3">
              主な構文チートシート
            </h2>
            <div className="overflow-x-auto not-prose mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-3 py-2 text-left">図の種類</th>
                    <th className="border px-3 py-2 text-left">開始キーワード</th>
                    <th className="border px-3 py-2 text-left">用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border px-3 py-2">フローチャート</td><td className="border px-3 py-2"><code>graph TD</code></td><td className="border px-3 py-2">業務フロー・処理フロー</td></tr>
                  <tr><td className="border px-3 py-2">シーケンス図</td><td className="border px-3 py-2"><code>sequenceDiagram</code></td><td className="border px-3 py-2">API連携・通信フロー</td></tr>
                  <tr><td className="border px-3 py-2">ER図</td><td className="border px-3 py-2"><code>erDiagram</code></td><td className="border px-3 py-2">DB設計・テーブル関連</td></tr>
                  <tr><td className="border px-3 py-2">ガントチャート</td><td className="border px-3 py-2"><code>gantt</code></td><td className="border px-3 py-2">スケジュール管理</td></tr>
                  <tr><td className="border px-3 py-2">クラス図</td><td className="border px-3 py-2"><code>classDiagram</code></td><td className="border px-3 py-2">オブジェクト設計</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                { q: "GitHubのREADMEで使えますか？", a: "はい、コードブロックに ```mermaid と書くだけで自動レンダリングされます。" },
                { q: "日本語テキストは使えますか？", a: "ノードのラベルに日本語を使えます。必要に応じて引用符で囲んでください。" },
                { q: "生成した図はダウンロードできますか？", a: "SVGとPNG（2x解像度）でダウンロード可能です。" },
                { q: "データはサーバーに送信されますか？", a: "いいえ、全てブラウザ内で処理されます。" },
              ].map((faq, i) => (
                <details key={i} className="border rounded-md">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-muted/50">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <AdPlaceholder position="content" className="mt-12" />
      </div>
    </>
  );
}
