import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "WebP画像でサイト速度とSEOを改善する方法 — 導入ガイド",
  description:
    "WebPフォーマットの仕組み、JPEG/PNGとの比較、導入手順、HTML/Next.js/WordPressでのフォールバック設定、Core Web Vitalsへの効果を実データで解説。",
  alternates: { canonical: "/guide/webp-seo" },
};

const faqs = [
  {
    question: "WebPに変換すると画質は落ちますか？",
    answer:
      "品質80以上であれば、肉眼ではJPEGとの違いはほぼわかりません。ロスレスモードを使えば完全に無劣化のまま、PNGより26%程度小さいファイルサイズが実現できます。",
  },
  {
    question: "AVIFとWebPのどちらを使うべきですか？",
    answer:
      "2026年時点ではWebPの方がブラウザ対応率が高く（約98%）、安定して利用できます。AVIFはさらに高い圧縮率を実現しますが、Safari 16以降でないと対応していません。両方を<picture>タグで併用するのが理想です。",
  },
  {
    question: "WordPressでWebPを使うにはどうすればよいですか？",
    answer:
      "WordPress 5.8以降はWebPアップロードに標準対応しています。EWWW Image Optimizerなどのプラグインを使えば、既存のJPEG/PNG画像も自動的にWebPに変換して配信できます。",
  },
  {
    question: "OGP画像（SNSシェア用）もWebPにしてよいですか？",
    answer:
      "LINEなど一部のSNSがWebPに対応していない場合があるため、OGP画像はJPEGのままにしておくのが安全です。サイト本体の画像のみWebPに変換する運用がおすすめです。",
  },
];

export default function WebpSeoPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WebP画像でサイト速度とSEOを改善する方法 — 導入ガイド",
            description:
              "WebPフォーマットの仕組み、JPEG/PNGとの比較、導入手順、フォールバック設定、Core Web Vitalsへの効果を解説。",
            datePublished: "2026-03-20",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/webp-seo" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "WebPでSEO改善" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          WebP画像でサイト速度とSEOを改善する方法
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月20日 ・ 読了時間: 約6分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          Webページの総データ量のうち、画像が占める割合は約50%と言われています。
          画像をJPEG/PNGからWebPに変換するだけで、ページの読み込み時間を大幅に短縮でき、
          Core Web Vitalsのスコア改善 → Google検索順位の向上が期待できます。
          この記事では、WebPの仕組みから導入手順、注意点までを網羅的に解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">WebPとは何か</h2>
        <p className="text-muted-foreground leading-relaxed">
          WebP（ウェッピー）は、2010年にGoogleが開発したモダンな画像フォーマットです。
          VP8ビデオコーデックの技術をベースにしており、ロッシー（非可逆）圧縮とロスレス（可逆）圧縮の
          両方に対応しています。2023年にSafariが正式対応したことで、
          全ての主要ブラウザで利用可能になりました。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">フォーマット別の比較</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">指標</th>
                <th className="text-left py-2 pr-4">JPEG</th>
                <th className="text-left py-2 pr-4">PNG</th>
                <th className="text-left py-2 pr-4">WebP</th>
                <th className="text-left py-2">AVIF</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">写真（500KB JPEG比）</td>
                <td className="py-2 pr-4">500KB</td>
                <td className="py-2 pr-4">〜1.5MB</td>
                <td className="py-2 pr-4 font-medium text-foreground">〜350KB（-30%）</td>
                <td className="py-2">〜280KB（-44%）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">透過サポート</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2 pr-4 font-medium text-foreground">対応</td>
                <td className="py-2">対応</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">アニメーション</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2 pr-4 font-medium text-foreground">対応</td>
                <td className="py-2">対応</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">ブラウザ対応率</td>
                <td className="py-2 pr-4">100%</td>
                <td className="py-2 pr-4">100%</td>
                <td className="py-2 pr-4 font-medium text-foreground">約98%</td>
                <td className="py-2">約92%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Core Web VitalsへのWebPの効果</h2>
        <p className="text-muted-foreground leading-relaxed">
          Googleが検索ランキングに使用するCore Web Vitalsのうち、画像の最適化が特に影響するのは以下の指標です。
        </p>
        <div className="space-y-4 not-prose mt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">LCP（Largest Contentful Paint）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              ページ内で最も大きなコンテンツ（多くの場合はヒーロー画像）の表示完了時間。
              画像をWebPに変換してファイルサイズを30%削減すると、LCPが0.5〜1.5秒改善されるケースがあります。
              Googleは2.5秒以内を「良好」としています。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">CLS（Cumulative Layout Shift）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              画像にwidth/height属性を設定していない場合、読み込み後にレイアウトがずれるCLSの原因になります。
              WebPへの変換時にサイズ情報を正しく設定することで、CLSの改善にもつながります。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">WebP導入の3つの方法</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="font-semibold text-foreground">tools24.jpで一括変換（最も簡単）</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              <Link href="/webp-converter" className="text-primary hover:underline">WebP変換ツール</Link>
              に画像をドロップするだけ。品質調整・リサイズも同時に行え、一括20枚まで対応。
              ブラウザ内処理なので画像データがサーバーに送信されることはありません。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-semibold text-foreground">ビルドツールで自動変換</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              Next.jsの<code>&lt;Image&gt;</code>コンポーネントはデフォルトでWebP配信に対応。
              Viteでは<code>vite-plugin-image-optimizer</code>、webpackでは<code>image-minimizer-webpack-plugin</code>で自動変換が可能です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="font-semibold text-foreground">CDN/サーバーで自動変換</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              Cloudflare（Polish機能）、Vercel（Image Optimization）、AWS CloudFront（Lambda@Edge）など、
              CDN側でリクエスト時にWebP変換を行う方法。ブラウザのAcceptヘッダーを見て自動的にフォーマットを切り替えます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">HTMLでのフォールバック設定</h2>
        <div className="bg-muted/50 rounded-lg p-4 not-prose">
          <pre className="text-xs text-muted-foreground overflow-x-auto"><code>{`<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="説明文" width="800" height="600"
       loading="lazy" decoding="async">
</picture>`}</code></pre>
          <p className="text-muted-foreground text-xs mt-2">
            ブラウザは上から順に対応フォーマットを確認し、最初に対応したものを使用します。
            非対応ブラウザでは最後の<code>&lt;img&gt;</code>（JPEG）が表示されます。
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">WebP導入時の注意点</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">品質設定</strong> — 写真は品質75〜85が最適バランス。
            ロゴやテキスト画像はロスレスモードで。品質70以下はアーティファクトが目立ちます
          </li>
          <li>
            <strong className="text-foreground">OGP画像はJPEGのまま</strong> — LINE・Facebook等の一部SNSクローラーが
            WebPに対応していない可能性があるため、OGP用はJPEGを維持
          </li>
          <li>
            <strong className="text-foreground">メール内の画像もJPEG/PNG</strong> — メールクライアント（Outlook等）の
            WebP対応は不完全なため、HTMLメールの画像はJPEG/PNGが安全
          </li>
          <li>
            <strong className="text-foreground">width/heightを必ず指定</strong> — CLS防止のため、
            <code>&lt;img&gt;</code>タグにはwidth/height属性を必ず設定
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">まとめ</h2>
        <p className="text-muted-foreground leading-relaxed">
          WebPはファイルサイズを25〜35%削減し、Core Web Vitals（特にLCP）を改善する最も手軽な方法です。
          <Link href="/webp-converter" className="text-primary hover:underline">tools24.jpのWebP変換ツール</Link>
          を使えば、ブラウザ上で簡単に一括変換できます。
          まだWebPを導入していないサイトは、まずヒーロー画像やサムネイルなど表示頻度の高い画像から始めてみてください。
        </p>
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/csv-mojibake" className="text-primary hover:underline">ExcelのCSV文字化けを3秒で直す方法</Link> — ファイルエンコーディングの基礎知識</li>
          <li><Link href="/guide/json-api-debug" className="text-primary hover:underline">JSON整形ツールでAPIデバッグを効率化する方法</Link> — Web開発の効率化テクニック</li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateGuides['/guide/webp-seo']} />
    </>
  );
}
