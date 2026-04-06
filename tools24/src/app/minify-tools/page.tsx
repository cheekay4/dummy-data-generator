import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import MinifyToolsMain from '@/components/minify-tools/minify-tools-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: 'HTML/CSS/JS 圧縮ツール — オンラインMinify | tools24.jp',
  description:
    'HTML・CSS・JavaScriptのソースコードをブラウザだけで圧縮（Minify）。コメント削除、空白圧縮、変数名短縮に対応。一括変換・ZIPダウンロード可能。データはサーバーに送信されません。',
  alternates: { canonical: '/minify-tools' },
};

const faqs = [
  {
    question: '圧縮するとコードが壊れることはありますか？',
    answer:
      '基本オプション（コメント削除・空白圧縮）ではまず壊れません。変数名短縮（マングリング）は動作が変わる可能性があるため、必ずテスト環境で動作確認してからデプロイしてください。',
  },
  {
    question: 'Prettify（整形・フォーマット）はできますか？',
    answer: 'このツールは圧縮（Minify）専用です。整形にはJSON整形ツール（JSON）やお使いのエディタ（VSCode, Prettier等）のフォーマット機能をご利用ください。',
  },
  {
    question: 'データはサーバーに送信されますか？',
    answer: 'いいえ、全てブラウザ内のJavaScriptで処理されます。ソースコードが外部に送信されることは一切ありません。社内のプロプライエタリなコードも安心して圧縮できます。',
  },
  {
    question: 'どのくらい圧縮できますか？',
    answer:
      'HTMLは5〜30%、CSSは10〜40%、JavaScriptはコメント・空白削除で10〜50%、変数名短縮を加えるとさらに20〜40%削減できます。コメントが多いコードほど圧縮率が高くなります。',
  },
  {
    question: 'Gzip/Brotli圧縮との違いは何ですか？',
    answer:
      'Minify（このツール）はソースコードから不要な文字を除去する「テキストレベルの圧縮」です。Gzip/Brotliはサーバーがファイル転送時に行う「バイナリレベルの圧縮」です。両方を組み合わせることで最大の効果が得られます。',
  },
  {
    question: 'Source Mapは生成されますか？',
    answer:
      'このツールでは Source Map の生成には対応していません。本番ビルドで Source Map が必要な場合は、webpack・Vite・esbuild などのビルドツールをご利用ください。',
  },
  {
    question: '複数ファイルをまとめて圧縮できますか？',
    answer:
      'はい、一括変換に対応しています。複数のファイルをまとめて処理し、ZIPファイルとしてダウンロードできます。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。',
  },
];

export default function MinifyToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "HTML/CSS/JS 圧縮ツール",
            url: "https://tools24.jp/minify-tools",
            description:
              "HTML・CSS・JavaScriptのソースコードをブラウザだけで圧縮（Minify）。コメント削除、空白圧縮、変数名短縮に対応。一括変換・ZIPダウンロード可能。データはサーバーに送信されません。",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: 'ホーム', href: '/' },
          { label: 'HTML/CSS/JS 圧縮ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">HTML/CSS/JS 圧縮ツール</h1>
      <p className="text-muted-foreground mb-6">
        ソースコードをブラウザだけで圧縮（Minify）。データは送信されません。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <MinifyToolsMain />

      {/* 教育コンテンツ */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">コード圧縮（Minify）とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          コード圧縮（Minification / Minify）とは、HTML・CSS・JavaScriptのソースコードから、
          プログラムの動作に影響しない不要な文字（コメント、空白、改行、インデント）を除去し、
          ファイルサイズを小さくする最適化手法です。
          ファイルサイズが小さくなることで、Webページの読み込み速度が向上し、
          ユーザー体験とSEOの両方に好影響を与えます。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">圧縮の種類と効果</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">圧縮手法</th>
                <th className="text-left py-2 pr-4">対象</th>
                <th className="text-left py-2 pr-4">削減率の目安</th>
                <th className="text-left py-2">リスク</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">コメント削除</td>
                <td className="py-2 pr-4">HTML / CSS / JS</td>
                <td className="py-2 pr-4">5〜20%</td>
                <td className="py-2">なし</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">空白・改行削除</td>
                <td className="py-2 pr-4">HTML / CSS / JS</td>
                <td className="py-2 pr-4">10〜30%</td>
                <td className="py-2">ほぼなし</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">セレクタ短縮</td>
                <td className="py-2 pr-4">CSS</td>
                <td className="py-2 pr-4">5〜15%</td>
                <td className="py-2">低い</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">変数名短縮（マングリング）</td>
                <td className="py-2 pr-4">JS</td>
                <td className="py-2 pr-4">20〜40%</td>
                <td className="py-2">要テスト</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">なぜコード圧縮が重要なのか</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Core Web Vitals への影響</h3>
            <p className="text-muted-foreground text-sm mt-1">
              GoogleはCore Web Vitals（LCP・FID・CLS）をランキングシグナルとして使用しています。
              CSS/JSファイルのサイズ削減は、特にLCP（Largest Contentful Paint）の改善に直結します。
              未圧縮の大きなJSファイルはパース時間も長くなり、FID/INPにも悪影響を及ぼします。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">帯域幅とコスト削減</h3>
            <p className="text-muted-foreground text-sm mt-1">
              特にモバイルユーザーや低速回線の環境では、ファイルサイズの削減がページ読み込み時間に大きく影響します。
              CDNの転送量課金を受けている場合、圧縮によるコスト削減効果も無視できません。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">ビルドパイプラインとの関係</h3>
            <p className="text-muted-foreground text-sm mt-1">
              本番環境では webpack・Vite・esbuild などのビルドツールが自動的にMinifyを行います。
              このツールは、ビルドツールを使わない静的サイトや、個別のコードスニペットを手軽に圧縮したい場面で特に便利です。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">圧縮の前に知っておくべきこと</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">元ファイルは必ず保管</strong> — 圧縮後のコードは可読性がなくなるため、
            開発用の元ファイルは必ず別途管理してください
          </li>
          <li>
            <strong className="text-foreground">Gzip/Brotliと併用</strong> — Minifyはテキストレベルの最適化、
            Gzip/Brotliはバイナリレベルの圧縮です。両方を組み合わせることで最大60〜80%のサイズ削減が可能です
          </li>
          <li>
            <strong className="text-foreground">CSSの!importantに注意</strong> — セレクタの短縮やプロパティの統合で、
            意図しないスタイルの上書きが起きる場合があります。圧縮後の表示を必ず確認してください
          </li>
        </ul>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/minify-tools']} />
    </>
  );
}
