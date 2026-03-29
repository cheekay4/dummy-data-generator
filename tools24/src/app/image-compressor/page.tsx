import type { Metadata } from "next";
import { ImageCompressorMain } from "@/components/image-compressor/image-compressor-main";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { RelatedTools } from "@/components/common/related-tools";

export const metadata: Metadata = {
  title: "画像圧縮・リサイズ — PNG/JPG/WebPをブラウザで圧縮 | tools24.jp",
  description:
    "PNG、JPG、WebP画像をブラウザ内で圧縮・リサイズ。複数ファイル一括処理、品質調整、サイズプリセット対応。登録不要・無料・データ送信なし。",
  openGraph: {
    title: "画像圧縮・リサイズ — PNG/JPG/WebPをブラウザで圧縮 | tools24.jp",
    description:
      "PNG、JPG、WebP画像をブラウザ内で圧縮・リサイズ。複数ファイル一括処理、品質調整、サイズプリセット対応。登録不要・無料・データ送信なし。",
    url: "https://tools24.jp/image-compressor",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "画像圧縮・リサイズ",
  description:
    "PNG、JPG、WebP画像をブラウザ内で圧縮・リサイズ。複数ファイル一括処理、品質調整、サイズプリセット対応。",
  url: "https://tools24.jp/image-compressor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function ImageCompressorPage(): React.ReactElement {
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
            items={[{ label: "画像圧縮・リサイズ" }]}
          />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">画像圧縮・リサイズ</h1>
            <p className="text-muted-foreground">
              PNG、JPG、WebP画像をブラウザだけで圧縮・リサイズ。品質調整やサイズプリセットで最適化。データはサーバーに送信されません。
            </p>
          </div>

          <ImageCompressorMain />

          <div className="flex justify-center my-8">
            <AdPlaceholder slot="middle-rect" width={336} height={280} />
          </div>

          {/* SEO コンテンツ */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">主な機能</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-6">
              {[
                {
                  title: "ブラウザ完結",
                  desc: "画像データはサーバーに送信されません。全ての処理がブラウザ内で完結するため、機密画像も安心して圧縮できます。",
                },
                {
                  title: "複数ファイル一括処理",
                  desc: "複数の画像をまとめてドラッグ&ドロップ。一括で圧縮してZIPダウンロードが可能です。",
                },
                {
                  title: "品質・形式・サイズ調整",
                  desc: "品質スライダー、出力形式（JPEG/PNG/WebP）切替、リサイズプリセットで柔軟に最適化。",
                },
              ].map((feature) => (
                <div key={feature.title} className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">こんな時に便利</h2>
            <div className="not-prose mb-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>・Webサイトの表示速度を改善したい（ページの画像を軽量化）</li>
                <li>・SNS投稿やブログ用に画像サイズを調整したい</li>
                <li>・OGP画像を推奨サイズ（1200x630）にリサイズしたい</li>
                <li>・メール添付用に画像のファイルサイズを小さくしたい</li>
                <li>・機密性のある画像をアップロードせずにローカルで圧縮したい</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "画像データはサーバーに送信されますか？",
                  a: "いいえ。全ての圧縮・リサイズ処理はお使いのブラウザ内で完結しています。画像データがサーバーに送信されることはありません。",
                },
                {
                  q: "対応している画像形式は？",
                  a: "PNG、JPEG（JPG）、WebP の3形式に対応しています。入力と出力で異なる形式を選ぶことも可能です（例: PNGをWebPに変換して圧縮）。",
                },
                {
                  q: "圧縮後の画質はどうなりますか？",
                  a: "品質スライダーで1%〜100%の範囲で調整できます。80%程度であれば見た目の劣化はほとんどなく、大幅なファイルサイズ削減が期待できます。",
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

          <RelatedTools currentPath="/image-compressor" />
        </div>

        <div className="flex justify-center mt-12">
          <AdPlaceholder slot="bottom-rect" width={336} height={280} />
        </div>
      </div>
    </>
  );
}
