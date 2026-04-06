import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "ExcelのCSV文字化けを3秒で直す方法 — 原因と対策を完全解説",
  description:
    "ExcelでCSVファイルを開くと文字化けする原因（UTF-8 vs Shift_JIS）と、BOM付きUTF-8による解決策を図解付きで解説。Pythonやプログラムからの対応方法も紹介。",
  alternates: { canonical: "/guide/csv-mojibake" },
};

const faqs = [
  {
    question: "なぜExcelだけ文字化けするのですか？",
    answer:
      "ExcelはCSVのデフォルトエンコーディングをShift_JIS（日本語Windows）と想定します。一方、多くのWebサービスやプログラムはUTF-8でCSVを出力するため、エンコーディングの不一致が起きます。",
  },
  {
    question: "BOMを付けるとデメリットはありますか？",
    answer:
      "一部のプログラム（古いPHPやシェルスクリプト）がBOMを余計な文字として解釈する場合がありますが、現代の主要ソフトウェアではほぼ問題ありません。Excel向けCSVにはBOM付きが最も安全です。",
  },
  {
    question: "Google スプレッドシートでも文字化けしますか？",
    answer:
      "Google スプレッドシートはUTF-8を標準で認識するため、文字化けはほぼ起きません。Excelでの文字化けが頻繁に起きる場合、Google スプレッドシート経由で開いてからExcel形式で保存する回避策もあります。",
  },
  {
    question: "macのExcelでも同じ問題が起きますか？",
    answer:
      "はい、macOS版のExcelでもBOMなしのUTF-8 CSVは文字化けします。対処法はWindows版と同じで、BOM付きUTF-8で保存するか、tools24.jpの文字化け修正ツールをご利用ください。",
  },
];

export default function CsvMojibakePage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "ExcelのCSV文字化けを3秒で直す方法 — 原因と対策を完全解説",
            description:
              "ExcelでCSVファイルを開くと文字化けする原因（UTF-8 vs Shift_JIS）と、BOM付きUTF-8による解決策を図解付きで解説。",
            datePublished: "2026-03-20",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/csv-mojibake" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "CSV文字化けの直し方" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          ExcelのCSV文字化けを3秒で直す方法
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月20日 ・ 読了時間: 約5分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          「CSVファイルをExcelで開いたら文字化け…」これはおそらく日本のオフィスで最も多いファイルトラブルです。
          原因はシンプルで、UTF-8で保存されたCSVをExcelがShift_JISとして開いてしまうことにあります。
          この記事では原因の詳細と、確実な解決策を紹介します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">なぜ文字化けが起きるのか</h2>
        <p className="text-muted-foreground leading-relaxed">
          CSVファイルには「このファイルはUTF-8です」という情報が含まれていません。
          テキストファイルはバイト列の羅列であり、どのエンコーディングで書かれたかを示す
          標準的なメタデータが存在しないのです。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ExcelはCSVを開く際に、OSのデフォルトエンコーディングを使います。
          日本語WindowsのデフォルトはShift_JIS（コードページ932）であるため、
          UTF-8のCSVをShift_JISとして解釈し、文字化けが発生します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">文字化けのパターン</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">元のテキスト</th>
                <th className="text-left py-2 pr-4">文字化け後</th>
                <th className="text-left py-2">原因</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">東京都渋谷区</td>
                <td className="py-2 pr-4">譚ｱ莠ｬ驛ス貂峨き蜍?</td>
                <td className="py-2">UTF-8 → Shift_JIS 誤認</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">山田太郎</td>
                <td className="py-2 pr-4">蟆冗判螟ｪ驛?</td>
                <td className="py-2">UTF-8 → Shift_JIS 誤認</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">¥1,000</td>
                <td className="py-2 pr-4">Â¥1,000</td>
                <td className="py-2">UTF-8バイトの誤解釈</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">解決策①: tools24.jp で一瞬修復（最も簡単）</h2>
        <div className="bg-muted/50 rounded-lg p-5 not-prose">
          <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
            <li>
              <Link href="/mojibake-fixer" className="text-primary hover:underline font-medium">
                文字化け修正ツール
              </Link>
              を開く
            </li>
            <li>文字化けしたCSVファイルをドラッグ＆ドロップ</li>
            <li>自動でエンコーディングを判定 → UTF-8（BOM付き）でダウンロード</li>
            <li>ダウンロードしたCSVをExcelで開く → 文字化けなし</li>
          </ol>
          <p className="text-muted-foreground text-xs mt-3">
            ※ ブラウザ内で処理されるため、CSVの内容がサーバーに送信されることはありません。
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">解決策②: BOM付きUTF-8で保存する</h2>
        <p className="text-muted-foreground leading-relaxed">
          BOM（Byte Order Mark）とは、ファイルの先頭に付加される3バイトのマーカー（<code>EF BB BF</code>）です。
          ExcelはBOMを検出するとUTF-8として正しくファイルを開きます。
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">プログラムからCSVを出力する場合</h3>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">Python</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`with open('output.csv', 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)`}</code></pre>
            <p className="text-muted-foreground text-xs mt-2">
              <code>utf-8-sig</code> を指定すると自動的にBOMが付加されます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">JavaScript / Node.js</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`const BOM = '\\uFEFF';
fs.writeFileSync('output.csv', BOM + csvContent, 'utf8');`}</code></pre>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">PHP</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`header('Content-Type: text/csv; charset=UTF-8');
echo "\\xEF\\xBB\\xBF"; // BOM
echo $csvContent;`}</code></pre>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">解決策③: Excelの「データの取得」機能を使う</h2>
        <p className="text-muted-foreground leading-relaxed">
          Excel 2016以降では、「データ」タブ →「テキストまたはCSVから」を使うと、
          エンコーディングを自動判定（またはプレビューで確認）してからインポートできます。
          ただし、ダブルクリックでCSVを開く場合はこの機能は使われないため、注意が必要です。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">予防策: 今後文字化けを防ぐには</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">CSVを生成する側</strong> — BOM付きUTF-8で出力するのがベスト。
            受け取り側がExcelユーザーである可能性が高い日本の業務環境では、BOM付きが事実上の標準です。
          </li>
          <li>
            <strong className="text-foreground">CSVを受け取る側</strong> — ダブルクリックで開かず、
            Excelの「データの取得」からインポートするか、Google スプレッドシートで開いてからExcel形式で保存。
          </li>
          <li>
            <strong className="text-foreground">HTMLからのダウンロード</strong> — JavaScriptでCSVを生成してダウンロードさせる場合、
            BlobのBOM付加を忘れないこと。<code>new Blob([&apos;\uFEFF&apos; + csv])</code> が確実です。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">まとめ</h2>
        <p className="text-muted-foreground leading-relaxed">
          ExcelのCSV文字化けは「UTF-8 vs Shift_JIS」のエンコーディング不一致が原因です。
          最も簡単な解決策は
          <Link href="/mojibake-fixer" className="text-primary hover:underline">
            tools24.jpの文字化け修正ツール
          </Link>
          でBOM付きUTF-8に変換すること。
          プログラムからCSVを出力する場合は、最初からBOM付きUTF-8で保存しておけば、受け取り側で文字化けが起きません。
        </p>
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/zenkaku-hankaku-guide" className="text-primary hover:underline">全角・半角変換の基礎知識</Link> — CSVデータの全角半角混在問題を解決</li>
          <li><Link href="/guide/webp-seo" className="text-primary hover:underline">WebP画像でサイト速度とSEOを改善する方法</Link> — ファイルフォーマットの最適化テクニック</li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateGuides['/guide/csv-mojibake']} />
    </>
  );
}
