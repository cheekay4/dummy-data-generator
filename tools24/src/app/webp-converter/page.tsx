import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import WebpConverterMain from '@/components/webp-converter/webp-converter-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: 'WebP変換ツール — PNG・JPGからWebPに一括変換 | tools24.jp',
  description:
    'PNG・JPG・GIF画像をWebPに一括変換。WebPからPNG・JPGへの逆変換も可能。品質・リサイズ設定付き。全てブラウザ内で処理、データはサーバーに送信されません。',
  alternates: { canonical: '/webp-converter' },
};

const faqs = [
  {
    question: '変換後の画質は劣化しますか？',
    answer:
      '品質80以上であれば、肉眼ではほぼ判別できない程度です。ロスレスモードを使えば完全に無劣化で変換できます。写真は品質80、ロゴやテキスト画像はロスレスモードがおすすめです。',
  },
  {
    question: 'GIFアニメーションは変換できますか？',
    answer:
      '現在、アニメーションGIFの変換には対応していません。静止画のGIFは変換可能です。アニメーションWebPの作成にはffmpegなどのコマンドラインツールをご利用ください。',
  },
  {
    question: 'データはサーバーに送信されますか？',
    answer: 'いいえ、全てブラウザ内のCanvas APIで処理されます。画像データが外部に送信されることは一切ないため、社内資料や個人写真も安心して変換できます。',
  },
  {
    question: '最大何枚まで一括変換できますか？',
    answer:
      '20枚までです。ブラウザのメモリに依存しますが、1枚あたり数MB程度の画像であれば問題ありません。大量の画像を変換する場合は、20枚ずつに分けてご利用ください。',
  },
  {
    question: 'WebPからJPGやPNGに逆変換できますか？',
    answer:
      'はい、WebPからPNG・JPGへの逆変換にも対応しています。WebP形式で受け取った画像を、WebP非対応のソフトウェアで使いたい場合などにご活用ください。',
  },
  {
    question: 'リサイズも同時にできますか？',
    answer:
      'はい、変換時にリサイズ（幅・高さの指定）も同時に行えます。アスペクト比を維持したまま縮小できるので、サムネイル生成にも便利です。',
  },
  {
    question: 'WebPはどのブラウザで表示できますか？',
    answer:
      'Chrome、Firefox、Safari（14以降）、Edge、Operaなど、現在の主要ブラウザは全て対応しています。IE11のみ非対応ですが、2022年にサポート終了しています。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。変換した画像はそのままダウンロードできます。',
  },
];

export default function WebpConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "WebP変換ツール",
            url: "https://tools24.jp/webp-converter",
            description:
              "PNG・JPG・GIF画像をWebPに一括変換。WebPからPNG・JPGへの逆変換も可能。品質・リサイズ設定付き。全てブラウザ内で処理、データはサーバーに送信されません。",
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
          { label: 'WebP変換ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">WebP変換ツール</h1>
      <p className="text-muted-foreground mb-6">
        PNG・JPG⇔WebPをブラウザで一括変換。データは送信されません。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <WebpConverterMain />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">WebPとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          WebP（ウェッピー）はGoogleが2010年に開発したモダンな画像フォーマットです。
          同等の画質でJPGより約25〜35%、PNGより約26%ファイルサイズが小さくなります。
          2023年以降、Safari を含む全ての主要ブラウザ（Chrome・Firefox・Safari・Edge）が対応しており、
          Webサイトの画像フォーマットとして事実上の標準になりつつあります。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">画像フォーマット比較表</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">形式</th>
                <th className="text-left py-2 pr-4">圧縮方式</th>
                <th className="text-left py-2 pr-4">透過</th>
                <th className="text-left py-2 pr-4">アニメーション</th>
                <th className="text-left py-2">最適な用途</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">WebP</td>
                <td className="py-2 pr-4">ロッシー / ロスレス</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2">Web全般（推奨）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">JPEG</td>
                <td className="py-2 pr-4">ロッシーのみ</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2">写真（レガシー互換）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">PNG</td>
                <td className="py-2 pr-4">ロスレスのみ</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2">ロゴ・スクリーンショット</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">GIF</td>
                <td className="py-2 pr-4">ロスレス（256色）</td>
                <td className="py-2 pr-4">1bit</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2">シンプルなアニメーション</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">AVIF</td>
                <td className="py-2 pr-4">ロッシー / ロスレス</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2">次世代（対応ブラウザ拡大中）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">WebPを使うメリット</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">ページ速度とSEO</h3>
            <p className="text-muted-foreground text-sm mt-1">
              画像はWebページの総データ量の約50%を占めます。WebPへの変換でファイルサイズを25〜35%削減すると、
              Core Web Vitals（特にLCP）が改善し、Google検索でのランキング向上が期待できます。
              PageSpeed Insightsのスコア改善にも直結します。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">帯域幅とコスト削減</h3>
            <p className="text-muted-foreground text-sm mt-1">
              CDNの転送量課金を受けている場合、画像サイズの削減は直接的なコスト削減になります。
              特にECサイトや画像が多いブログでは、月間の転送量が大幅に減少します。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">透過とアニメーション</h3>
            <p className="text-muted-foreground text-sm mt-1">
              WebPはPNGのような透過（アルファチャンネル）とGIFのようなアニメーションの両方に対応しています。
              つまり、WebP一つで JPEG・PNG・GIF の3フォーマットの役割をカバーできます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">WebP導入時の注意点</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">品質設定</strong> — 品質80が写真の最適バランス。
            75未満ではアーティファクト（圧縮ノイズ）が目立ち始めます。ロゴやテキスト画像にはロスレスモードを推奨
          </li>
          <li>
            <strong className="text-foreground">フォールバック</strong> — ごく古いブラウザ向けに
            <code>&lt;picture&gt;</code> タグでJPG/PNGフォールバックを用意するのがベストプラクティスです
          </li>
          <li>
            <strong className="text-foreground">SNSシェア画像</strong> — OGP画像にWebPを使用する場合、
            一部のSNS（LINE等）が対応していない可能性があるため、OGP用はJPGを維持することを推奨します
          </li>
        </ul>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/webp-converter']} />
    </>
  );
}
