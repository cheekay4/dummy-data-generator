import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { FeatureTabs } from "@/components/json-formatter/feature-tabs";
import { Faq } from "@/components/json-formatter/faq";
import { RelatedTools } from "@/components/common/related-tools";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "JSON整形ツール - オンラインでJSON変換・バリデーション",
  description:
    "無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。データはサーバーに送信されません。",
  keywords: ["json 整形", "json フォーマッター", "json 変換", "json バリデーション", "json csv 変換", "json 圧縮"],
  openGraph: {
    title: "JSON整形ツール - オンラインでJSON変換・バリデーション | tools24.jp",
    description:
      "無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。データはサーバーに送信されません。",
    url: "https://tools24.jp/json-formatter",
    type: "website",
  },
  alternates: {
    canonical: "https://tools24.jp/json-formatter",
  },
  other: {
    // 構造化データ (WebApplication schema)
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "JSON整形ツール",
      url: "https://tools24.jp/json-formatter",
      description:
        "無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      inLanguage: "ja",
    }),
  },
};

export default function JsonFormatterPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 広告: ヘッダー直下 */}
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      {/* パンくずリスト */}
      <Breadcrumb items={[{ label: "JSON整形ツール" }]} />

      {/* ページタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">JSON整形ツール</h1>
        <p className="text-sm text-muted-foreground">
          整形・圧縮・バリデーション・各種変換をブラウザで完結。データの送信なし。
        </p>
      </div>

      {/* メイン機能エリア */}
      <FeatureTabs />

      {/* 広告: サイドバー代替 */}
      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      {/* 関連ツール */}
      <RelatedTools currentPath="/json-formatter" />

      {/* SEOコンテンツ */}
      <section className="mt-12 space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">JSON整形ツールとは</h2>
          <p>
            JSON整形ツール（JSONフォーマッター）は、読みにくいJSON文字列を見やすく整形（インデント整理）したり、
            逆に空白を取り除いて1行に圧縮したりするためのオンラインツールです。
            APIレスポンスの確認、設定ファイルの編集、データ変換など、Webエンジニアの日常業務を効率化します。
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">使い方</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>左のテキストエリアにJSONを貼り付けるか、.jsonファイルをドラッグ&ドロップします</li>
            <li>上部のタブから実行する操作を選択します（整形・圧縮・変換など）</li>
            <li>右のエリアに結果が表示されます。「コピー」または「ダウンロード」で取り出せます</li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <Faq />

      {/* 広告: フッター上 */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
