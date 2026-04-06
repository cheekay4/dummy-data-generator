import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import ZenkakuHankakuMain from '@/components/zenkaku-hankaku/zenkaku-hankaku-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: '全角・半角変換ツール — ひらがな⇔カタカナ変換も対応 | tools24.jp',
  description:
    '全角⇔半角の一括変換ツール。英数字・カタカナ・記号・スペースを選択的に変換。ひらがな⇔カタカナ変換、住所正規化プリセットも搭載。全てブラウザ内で処理、データは送信されません。',
  alternates: { canonical: '/zenkaku-hankaku' },
};

const faqs = [
  {
    question: '半角カタカナの濁点はどう処理されますか？',
    answer: 'ｶﾞ（2文字: ｶ + ﾞ）を ガ（1文字）に正しく結合します。逆方向（全角→半角）も同様に、ガ → ｶﾞ に分解されます。',
  },
  {
    question: 'NFKC正規化とは違いますか？',
    answer:
      'NFKC正規化はUnicode標準の正規化で全角→半角と半角カタカナ→全角を同時に行いますが、個別の制御ができません。このツールでは英字・数字・カタカナ・記号・スペースそれぞれの変換を個別にON/OFFできます。',
  },
  {
    question: 'データはサーバーに送信されますか？',
    answer: 'いいえ、全てブラウザ内のJavaScriptで処理されます。顧客データや住所リストなどの機密情報も安心して変換できます。',
  },
  {
    question: '住所データの正規化に使えますか？',
    answer:
      'はい。「住所正規化」プリセットを使うと、数字→半角、カタカナ→全角、スペース→半角をワンクリックで一括変換できます。顧客データの名寄せやDM発送リストの整備に最適です。',
  },
  {
    question: 'ひらがなとカタカナの変換もできますか？',
    answer:
      'はい、ひらがな→カタカナ、カタカナ→ひらがなの変換にも対応しています。全角・半角の変換と組み合わせて使うこともできます。',
  },
  {
    question: '大量のテキストでも処理できますか？',
    answer:
      'はい、ブラウザのメモリに依存しますが、数千行・数万文字程度のテキストであれば問題なく処理できます。非常に大きなファイル（数十MB以上）はテキストエディタ等での処理をおすすめします。',
  },
  {
    question: '変換結果をコピーしてExcelに貼り付けられますか？',
    answer:
      'はい、変換結果はワンクリックでクリップボードにコピーでき、そのままExcel・Google スプレッドシート・テキストエディタなどに貼り付けられます。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。',
  },
];

export default function ZenkakuHankakuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "全角・半角変換ツール",
            url: "https://tools24.jp/zenkaku-hankaku",
            description:
              "全角⇔半角の一括変換ツール。英数字・カタカナ・記号・スペースを選択的に変換。ひらがな⇔カタカナ変換、住所正規化プリセットも搭載。全てブラウザ内で処理、データは送信されません。",
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
          { label: '全角・半角変換ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">全角・半角変換ツール</h1>
      <p className="text-muted-foreground mb-6">
        ひらがな⇔カタカナ変換も対応。住所正規化プリセット付き。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <ZenkakuHankakuMain />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">全角・半角とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          全角・半角は日本語コンピューター環境に特有の概念です。
          もともとは等幅フォントで漢字・ひらがな（全角 = 2文字分の幅）と英数字（半角 = 1文字分の幅）を
          区別するために生まれました。
          Unicodeでは英数字・記号の「全角版」が U+FF01〜U+FF5E に、カタカナの「半角版」が U+FF65〜U+FF9F に定義されています。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">全角・半角の対応表</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">文字種</th>
                <th className="text-left py-2 pr-4">全角の例</th>
                <th className="text-left py-2 pr-4">半角の例</th>
                <th className="text-left py-2">一般的な推奨</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">英字</td>
                <td className="py-2 pr-4">Ａ Ｂ Ｃ</td>
                <td className="py-2 pr-4">A B C</td>
                <td className="py-2">半角に統一</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">数字</td>
                <td className="py-2 pr-4">１ ２ ３</td>
                <td className="py-2 pr-4">1 2 3</td>
                <td className="py-2">半角に統一</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">カタカナ</td>
                <td className="py-2 pr-4">アイウ</td>
                <td className="py-2 pr-4">ｱｲｳ</td>
                <td className="py-2">全角に統一</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">記号</td>
                <td className="py-2 pr-4">！ ？ ＠</td>
                <td className="py-2 pr-4">! ? @</td>
                <td className="py-2">用途による</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">スペース</td>
                <td className="py-2 pr-4">（全角スペース）</td>
                <td className="py-2 pr-4">（半角スペース）</td>
                <td className="py-2">半角に統一</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">業務での活用シーン</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">住所データの正規化</h3>
            <p className="text-muted-foreground text-sm mt-1">
              「東京都渋谷区１−２−３」と「東京都渋谷区1-2-3」のような表記ゆれを統一します。
              「住所正規化」プリセットを使えば、数字→半角、カタカナ→全角、スペース→半角を一括変換できます。
              顧客データの名寄せやDM発送リストの整備に最適です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">CSV・Excelデータの統一</h3>
            <p className="text-muted-foreground text-sm mt-1">
              CSVインポート時に全角数字が混在していると、Excelでの計算やソートが正しく動作しません。
              英数字を半角に統一してからインポートすることで、データ処理のトラブルを防げます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">検索精度の向上</h3>
            <p className="text-muted-foreground text-sm mt-1">
              データベースやElasticsearchでの全文検索では、全角・半角の不一致が検索漏れの原因になります。
              インデックス作成前にテキストを正規化しておくと、検索のヒット率が大幅に改善されます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Webフォームのバリデーション</h3>
            <p className="text-muted-foreground text-sm mt-1">
              電話番号や郵便番号の入力欄に全角数字が入力されるケースは非常に多いです。
              フロントエンドで半角に自動変換するか、バリデーション前に正規化することで、
              ユーザーの入力ミスを防げます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">プログラミングでの全角・半角変換</h2>
        <p className="text-muted-foreground leading-relaxed">
          JavaScriptでは <code>String.prototype.normalize(&apos;NFKC&apos;)</code> でUnicode正規化ができますが、
          NFKC正規化は全角英数字→半角と半角カタカナ→全角を同時に行うため、個別の制御ができません。
          このツールでは変換対象（英字・数字・カタカナ・記号・スペース）を個別に選択でき、
          ひらがな⇔カタカナの変換にも対応しています。
        </p>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/zenkaku-hankaku']} />
    </>
  );
}
