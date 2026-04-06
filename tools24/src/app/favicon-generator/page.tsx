import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import FaviconGeneratorMain from '@/components/favicon-generator/favicon-generator-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: 'ファビコン一括生成ツール — ICO・PNG・PWAアイコン・manifest.json | tools24.jp',
  description:
    '画像・テキスト・絵文字からファビコンを一括生成。ICO/PNG全サイズ/Apple Touch Icon/PWAアイコン/manifest.jsonをZIPでダウンロード。全てブラウザ内で処理、データは送信されません。',
  alternates: { canonical: '/favicon-generator' },
};

const faqs = [
  {
    question: 'ICOファイルとPNGファイルの違いは？',
    answer:
      'ICO（.ico）は複数のサイズ（16×16, 32×32, 48×48等）を1ファイルに格納できるWindows由来の形式です。モダンブラウザはPNGファビコンを優先しますが、古いブラウザとの互換性のためにICOも用意するのがベストプラクティスです。',
  },
  {
    question: '推奨の元画像サイズは？',
    answer: '512×512px以上の正方形PNGが推奨です。SVG形式があればベストで、どのサイズに縮小してもシャープな仕上がりになります。写真やグラデーションを含む場合はPNG、ロゴやアイコンの場合はSVGが最適です。',
  },
  {
    question: 'PWAのアイコンはファビコンと別ですか？',
    answer:
      'はい、技術的には別です。PWAはmanifest.jsonで指定する192×192と512×512のアイコンが必要です。このツールではファビコンとPWAアイコンを同時に一括生成し、manifest.jsonも自動で作成します。',
  },
  {
    question: 'データはサーバーに送信されますか？',
    answer: 'いいえ、全てブラウザ内のCanvas APIで処理されます。アップロードした画像が外部に送信されることは一切ありません。',
  },
  {
    question: 'manifest.jsonとは何ですか？',
    answer:
      'Web App Manifest（manifest.json）は、PWAの名前・アイコン・テーマカラーなどを定義するJSONファイルです。ブラウザの「ホーム画面に追加」機能で使用されます。このツールではアイコンと一緒に自動生成されます。',
  },
  {
    question: '絵文字やテキストからも作成できますか？',
    answer:
      'はい、画像ファイルだけでなく、絵文字やテキスト（1〜2文字）を入力して、それをベースにしたファビコンを生成できます。背景色やフォントサイズもカスタマイズ可能です。',
  },
  {
    question: 'apple-touch-iconとは？',
    answer:
      'iPhoneやiPadでWebサイトをホーム画面に追加した際に表示されるアイコンです。180×180pxのPNG形式で、角丸処理はiOSが自動的に適用するため、正方形の画像を用意すればOKです。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。生成されたZIPファイルをダウンロードして解凍し、サーバーにアップロードしてください。',
  },
];

export default function FaviconGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ファビコン一括生成ツール",
            url: "https://tools24.jp/favicon-generator",
            description:
              "画像・テキスト・絵文字からファビコンを一括生成。ICO/PNG全サイズ/Apple Touch Icon/PWAアイコン/manifest.jsonをZIPでダウンロード。全てブラウザ内で処理、データは送信されません。",
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
          { label: 'ファビコン生成ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">ファビコン一括生成ツール</h1>
      <p className="text-muted-foreground mb-6">
        ICO・PNG全サイズ・PWAアイコン・manifest.jsonをまとめて生成。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <FaviconGeneratorMain />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">ファビコンとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          ファビコン（favicon = favorite icon）とは、ブラウザのタブ・ブックマーク・スマートフォンのホーム画面などに表示される小さなアイコンです。
          Webサイトのブランドを視覚的に識別するための重要な要素であり、ユーザーが複数のタブを開いている際に
          目的のサイトを素早く見つけるための手がかりになります。
          PWA（Progressive Web App）ではホーム画面に追加した際のアプリアイコンとしても使われます。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">必要なファイル形式とサイズ一覧</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">ファイル</th>
                <th className="text-left py-2 pr-4">サイズ</th>
                <th className="text-left py-2 pr-4">用途</th>
                <th className="text-left py-2">必須度</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">favicon.ico</td>
                <td className="py-2 pr-4">16×16, 32×32</td>
                <td className="py-2 pr-4">ブラウザタブ（レガシー）</td>
                <td className="py-2">必須</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">favicon-32x32.png</td>
                <td className="py-2 pr-4">32×32</td>
                <td className="py-2 pr-4">モダンブラウザのタブ</td>
                <td className="py-2">必須</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">apple-touch-icon.png</td>
                <td className="py-2 pr-4">180×180</td>
                <td className="py-2 pr-4">iOS ホーム画面</td>
                <td className="py-2">必須</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">icon-192x192.png</td>
                <td className="py-2 pr-4">192×192</td>
                <td className="py-2 pr-4">Android / PWA</td>
                <td className="py-2">推奨</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">icon-512x512.png</td>
                <td className="py-2 pr-4">512×512</td>
                <td className="py-2 pr-4">PWA スプラッシュ</td>
                <td className="py-2">推奨</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm mt-2">
          このツールでは上記の全サイズを1枚の画像から一括生成し、manifest.json と一緒にZIPでダウンロードできます。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">設置方法</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Next.js（App Router）の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              生成した画像を <code>public/</code> フォルダに配置し、
              <code>app/layout.tsx</code> の <code>metadata</code> に icons 設定を追加します。
              または <code>app/icon.tsx</code> / <code>app/apple-icon.tsx</code> で動的生成も可能です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">通常のHTML の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              ダウンロードしたHTMLスニペットをコピーして <code>&lt;head&gt;</code> タグ内に貼り付け、
              画像ファイルをルートディレクトリに配置してください。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">WordPress の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              「外観」→「カスタマイズ」→「サイト基本情報」→「サイトアイコン」から512×512pxの画像をアップロードすれば、
              WordPressが自動的に各サイズを生成します。より細かくコントロールしたい場合は、
              このツールで生成したファイルをテーマの <code>header.php</code> に追加してください。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">ファビコン作成のコツ</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">シンプルなデザイン</strong> — 16×16pxでも視認できるよう、
            細かいディテールは避けてシンプルな形状・配色にしましょう
          </li>
          <li>
            <strong className="text-foreground">ブランドカラーを使う</strong> — サイトのメインカラーと合わせることで、
            多数のタブの中でもすぐに見つけられます
          </li>
          <li>
            <strong className="text-foreground">SVG元画像が最適</strong> — ベクター形式のSVGから生成すると、
            どのサイズでもシャープな仕上がりになります。512×512px以上のPNGでもOKです
          </li>
          <li>
            <strong className="text-foreground">ダークモード対応</strong> — 最近のブラウザはダークモードのタブバーを使用するため、
            背景が暗くても見えるデザインにしておくと安心です
          </li>
        </ul>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/favicon-generator']} />
    </>
  );
}
