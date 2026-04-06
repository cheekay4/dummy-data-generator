import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import ImageCompressorMain from '@/components/image-compressor/ImageCompressorMain';

export const metadata: Metadata = {
  title: '画像圧縮・リサイズツール — 指定サイズ・容量に変換 | tools24.jp',
  description:
    'ブラウザだけで画像を圧縮・リサイズ・トリミング。指定サイズ・指定容量への変換に対応。JPEG/PNG/WebP対応。データはサーバーに送信されません。',
  keywords: [
    '画像圧縮',
    '画像リサイズ',
    'オンライン',
    '無料',
    'JPEG圧縮',
    'PNG圧縮',
    'WebP変換',
    'トリミング',
  ],
  alternates: { canonical: '/image-compressor' },
};

const faqs = [
  {
    question: '画像はサーバーに送信されますか？',
    answer:
      'いいえ、全てブラウザ内のCanvas APIで処理されます。画像データが外部に送信されることは一切ないため、社内資料や個人写真も安心してご利用いただけます。',
  },
  {
    question: '対応している画像形式は？',
    answer:
      '入力はJPEG、PNG、WebPに対応しています。出力形式もJPEG、PNG、WebPから選択できます。',
  },
  {
    question: '指定した容量に圧縮できないことはありますか？',
    answer:
      '元の画像が非常に複雑な場合や、目標サイズが極端に小さい場合は達成できないことがあります。その場合は到達可能な最小サイズで結果を表示します。',
  },
  {
    question: 'リサイズ後の画質は劣化しますか？',
    answer:
      '拡大リサイズではピクセル補間により若干ぼやけることがあります。縮小リサイズではJPEG/WebP品質80以上であれば、肉眼でほぼ判別できない品質を維持できます。',
  },
  {
    question: 'トリミングでアスペクト比を固定できますか？',
    answer:
      'はい、1:1（正方形）、4:3、3:2、16:9、9:16（縦長）のプリセットに加え、カスタム比率も指定できます。SNS投稿用やOGP画像の作成に便利です。',
  },
  {
    question: '複数の操作を連続で行えますか？',
    answer:
      'はい、処理結果の「この結果で続けて加工」ボタンを使えば、リサイズ後に圧縮、圧縮後にトリミングなど、複数の操作を連続して行えます。操作履歴も表示されます。',
  },
  {
    question: 'アップロードできる最大ファイルサイズは？',
    answer:
      '50MBまでの画像に対応しています。ブラウザのメモリに依存しますが、通常の写真であれば問題なく処理できます。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer:
      'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。トリミングもタッチ操作で行えます。',
  },
];

export default function ImageCompressorPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "画像圧縮・リサイズツール",
            url: "https://tools24.jp/image-compressor",
            description:
              "ブラウザだけで画像を圧縮・リサイズ・トリミング。指定サイズ・指定容量への変換に対応。JPEG/PNG/WebP対応。データはサーバーに送信されません。",
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
          { label: '画像圧縮・リサイズツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        画像圧縮・リサイズツール
      </h1>
      <p className="text-muted-foreground mb-2">
        ブラウザだけで画像圧縮・リサイズ・トリミング。データはサーバーに送信されません。
      </p>
      <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
        画像はブラウザ内で処理されます。サーバーへの送信は一切ありません
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <ImageCompressorMain />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">
          画像圧縮・リサイズとは
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          画像圧縮は、画像ファイルのデータ量を削減する技術です。
          Webサイトの表示速度改善、メール添付サイズの制限対応、SNS投稿用の画像準備など、
          日常的に必要になる作業です。本ツールでは、ブラウザのCanvas
          APIを使用してクライアントサイドで完結するため、
          画像データが外部に送信されることはありません。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">
          圧縮方式の違い
        </h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">方式</th>
                <th className="text-left py-2 pr-4">特徴</th>
                <th className="text-left py-2 pr-4">対応形式</th>
                <th className="text-left py-2">最適な用途</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">
                  非可逆圧縮（ロッシー）
                </td>
                <td className="py-2 pr-4">
                  品質を調整してファイルサイズを大幅に削減
                </td>
                <td className="py-2 pr-4">JPEG, WebP</td>
                <td className="py-2">写真、Web用画像</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">
                  可逆圧縮（ロスレス）
                </td>
                <td className="py-2 pr-4">画質を完全に維持したまま圧縮</td>
                <td className="py-2 pr-4">PNG, WebP（ロスレス）</td>
                <td className="py-2">ロゴ、スクリーンショット、テキスト画像</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">
          よくある活用シーン
        </h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">
              Webサイトの表示速度改善
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              画像はWebページの総データ量の約50%を占めます。適切なサイズにリサイズし、
              品質80程度で圧縮することで、Core Web
              Vitals（特にLCP）の改善が期待できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">
              メール添付・チャット送信
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              多くのメールサービスは添付ファイルに25MB程度の制限があります。
              「圧縮」タブで目標サイズを指定すれば、制限内に収まるよう自動調整できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">
              SNS・OGP画像の作成
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              OGP画像は1200×630pxが推奨サイズです。「リサイズ」タブのOGPプリセットで
              ワンクリック変換、「トリミング」タブでアスペクト比を固定した切り出しが可能です。
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
