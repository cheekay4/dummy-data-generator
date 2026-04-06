import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import MojibakeFixerMain from '@/components/mojibake-fixer/mojibake-fixer-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: '文字化け修正ツール — エンコーディング自動判定＆修復 | tools24.jp',
  description:
    '文字化けしたテキストを貼り付けるだけで自動修復。UTF-8/Shift_JIS/EUC-JP/ISO-2022-JPの誤変換を自動判定。CSVファイルの文字化け修正にも対応。全てブラウザ内で処理、データは送信されません。',
  alternates: { canonical: '/mojibake-fixer' },
};

const faqs = [
  {
    question: 'このツールは無料ですか？',
    answer: 'はい、完全無料です。回数制限もありません。何度でもご利用いただけます。',
  },
  {
    question: 'データはサーバーに送信されますか？',
    answer: 'いいえ、全てブラウザ内のJavaScriptで処理されます。テキストやCSVファイルの内容が外部に送信されることは一切ありません。社内の機密データも安心して修復できます。',
  },
  {
    question: 'ExcelでCSVを開いたら文字化けしました。どうすれば？',
    answer:
      'CSVファイルをこのツールにドロップしてください。自動的にエンコーディングを判定し、UTF-8 BOM付きでダウンロードできます。BOM付きUTF-8であればExcelで正しく開けます。',
  },
  {
    question: '自動判定が外れた場合は？',
    answer:
      '詳細設定トグルを開き、元のエンコーディングと誤解釈されたエンコーディングを手動で選択して変換できます。よくあるパターン（Shift_JIS→UTF-8、EUC-JP→UTF-8等）はプリセットとして用意しています。',
  },
  {
    question: 'UTF-8とShift_JISの違いは何ですか？',
    answer:
      'UTF-8は世界中の文字を扱えるUnicode標準のエンコーディングで、Webの事実上の標準です。Shift_JISは日本語専用のエンコーディングで、主にWindows環境で使われてきました。現在はUTF-8への統一が推奨されています。',
  },
  {
    question: 'BOM（バイトオーダーマーク）とは何ですか？',
    answer:
      'BOMはファイルの先頭に付加される特殊なバイト列（EF BB BF）で、UTF-8であることを示す目印です。ExcelはBOMが付いていないUTF-8のCSVをShift_JISと誤認識するため、Excel向けCSVにはBOM付きUTF-8を使うのが確実です。',
  },
  {
    question: '絵文字が文字化けする場合は？',
    answer:
      'MySQLの古い「utf8」エンコーディングは3バイトまでしか対応しておらず、4バイトの絵文字が化けます。データベースのエンコーディングを「utf8mb4」に変更してください。このツールではUTF-8の絵文字も正しく処理されます。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。テキストの貼り付けもCSVファイルのドロップも全デバイスで利用可能です。',
  },
];

export default function MojibakeFixerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "文字化け修正ツール",
            url: "https://tools24.jp/mojibake-fixer",
            description:
              "文字化けしたテキストを貼り付けるだけで自動修復。UTF-8/Shift_JIS/EUC-JP/ISO-2022-JPの誤変換を自動判定。CSVファイルの文字化け修正にも対応。全てブラウザ内で処理、データは送信されません。",
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
          { label: '文字化け修正ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">文字化け修正ツール</h1>
      <p className="text-muted-foreground mb-6">
        エンコーディングを自動判定して文字化けを修復します。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <MojibakeFixerMain />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold">文字化けとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          文字化けとは、テキストデータのエンコーディング（文字コード）の不一致によって生じる現象です。
          日本語は UTF-8・Shift_JIS・EUC-JP・ISO-2022-JP（JIS）など複数のエンコーディングが混在するため、
          他の言語よりも文字化けが発生しやすい環境です。
          特にWindowsのExcelはShift_JISを既定として使うため、UTF-8のCSVを開くと文字化けが起きます。
        </p>
        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">日本語の文字コードの歴史</h2>
        <p className="text-muted-foreground leading-relaxed">
          日本語のコンピューター処理には長い歴史があり、複数の文字コードが併存してきました。
          1978年にJIS C 6226（現JIS X 0208）が制定され、これを元にShift_JIS（1982年、Microsoft/ASCII）、
          EUC-JP（1985年、UNIX系）、ISO-2022-JP（メール用）が生まれました。
          2000年代以降、Unicodeの普及でUTF-8が標準となりましたが、古いシステムや一部のWindowsアプリでは
          今もShift_JISが使われており、文字化けの主原因となっています。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">文字コード早見表</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">文字コード</th>
                <th className="text-left py-2 pr-4">登場年</th>
                <th className="text-left py-2 pr-4">主な使用環境</th>
                <th className="text-left py-2">特徴</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">UTF-8</td>
                <td className="py-2 pr-4">1993年</td>
                <td className="py-2 pr-4">Web全般・現代の標準</td>
                <td className="py-2">ASCII互換・全世界の文字を収録</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">Shift_JIS</td>
                <td className="py-2 pr-4">1982年</td>
                <td className="py-2 pr-4">Windows・Excel（旧）</td>
                <td className="py-2">日本固有・2バイト文字の先駆</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">EUC-JP</td>
                <td className="py-2 pr-4">1985年</td>
                <td className="py-2 pr-4">UNIX・Linux・古いWebサーバー</td>
                <td className="py-2">UNIXでの日本語処理に最適化</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">ISO-2022-JP</td>
                <td className="py-2 pr-4">1993年</td>
                <td className="py-2 pr-4">メール（MIME）</td>
                <td className="py-2">7bit安全・エスケープシーケンス方式</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">よくある文字化けパターン</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">現象</th>
                <th className="text-left py-2 pr-4">原因</th>
                <th className="text-left py-2">対処</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">ExcelでCSVが文字化け</td>
                <td className="py-2 pr-4">UTF-8をShift_JISと誤認識</td>
                <td className="py-2">BOM付きUTF-8で保存</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">メールの本文が文字化け</td>
                <td className="py-2 pr-4">JISとUTF-8の混在</td>
                <td className="py-2">SJIS→UTF8変換を試す</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Webページの一部が???</td>
                <td className="py-2 pr-4">HTMLのmeta charsetが未指定</td>
                <td className="py-2">UTF-8に統一</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ダウンロードしたTXTが文字化け</td>
                <td className="py-2 pr-4">EUC-JPをUTF-8として開いた</td>
                <td className="py-2">EUCJP→UTF8変換</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">古いシステムからのデータ</td>
                <td className="py-2 pr-4">レガシーShift_JIS</td>
                <td className="py-2">SJIS→UTF8変換</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">文字化けを防ぐためのベストプラクティス</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">CSVファイルの作成時</h3>
            <p className="text-muted-foreground text-sm mt-1">
              ExcelでCSVを保存する際は「UTF-8（BOM付き）」を選択してください。
              BOM（Byte Order Mark）が先頭に付くことで、ExcelがUTF-8として正しく認識します。
              プログラムからCSVを生成する場合も、先頭に <code>\uFEFF</code>（BOM）を付加するのが確実です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Webサイトの場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              HTMLの <code>&lt;head&gt;</code> 内に <code>&lt;meta charset=&quot;UTF-8&quot;&gt;</code> を
              必ず記述しましょう。HTTPレスポンスヘッダーの <code>Content-Type</code> にも
              <code>charset=utf-8</code> を付けるとより確実です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">データベースの場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              MySQL/MariaDBでは <code>utf8mb4</code>（4バイトUTF-8）を使用してください。
              古い <code>utf8</code> は3バイトまでしか対応しておらず、絵文字（4バイト）が文字化けします。
              PostgreSQLはデフォルトでUTF-8です。
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/mojibake-fixer']} />
    </>
  );
}
