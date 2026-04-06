import type { Metadata } from "next";
import { DiffCheckerMain } from "@/components/diff-checker/diff-checker-main";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title:
    "コード差分比較ツール（diff）— 関数変更チェック付き | tools24.jp",
  description:
    "2つのテキストやコードの差分を即座に比較。行レベル・単語レベルのハイライト、関数の追加・削除・変更の自動検出、統一diff出力に対応。登録不要・無料・ブラウザ内で完結。",
  openGraph: {
    title:
      "コード差分比較ツール（diff）— 関数変更チェック付き | tools24.jp",
    description:
      "2つのテキストやコードの差分を即座に比較。行レベル・単語レベルのハイライト、関数の追加・削除・変更の自動検出に対応。登録不要・無料。",
    url: "https://tools24.jp/diff-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "コード差分比較ツール（diff）",
  description:
    "2つのテキストやコードの差分を比較。関数変更の自動検出・統一diff出力に対応。ブラウザ内で完結。",
  url: "https://tools24.jp/diff-checker",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function DiffCheckerPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <AdPlaceholder position="header" />
        </div>

        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: "コード差分比較（diff）" }]} />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              コード差分比較ツール（diff）
            </h1>
            <p className="text-muted-foreground">
              2つのテキスト・コードを貼り付けて差分を可視化。関数の追加・削除・変更も自動検出
            </p>
          </div>

          <DiffCheckerMain />

          <div className="flex justify-center my-8">
            <AdPlaceholder position="content" />
          </div>

          {/* SEO コンテンツ */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">diffとは</h2>
            <p className="text-sm text-muted-foreground mb-6">
              diff（ディフ）は、2つのテキストファイルやコードの違いを比較・検出する仕組みです。
              ソフトウェア開発において、コードレビューやバージョン管理で日常的に使われています。
              このツールはブラウザ上で動作し、入力データがサーバーに送信されることはありません。
              行単位の差分だけでなく、単語レベルの変更箇所もハイライト表示するため、
              細かい変更点も一目で確認できます。
            </p>

            <h2 className="text-xl font-semibold mb-3">
              関数変更チェックの使い方
            </h2>
            <div className="not-prose mb-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    <strong>コードを貼り付け</strong> —
                    「Before」に変更前、「After」に変更後のコードを入力します
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    <strong>言語を選択</strong> —
                    「自動検出」で多くの場合正しく判定されます。JS/TS、Python、Go、Rubyに対応
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>
                    <strong>比較を実行</strong> —
                    追加された関数（緑）、削除された関数（赤）、変更された関数（黄）がバッジで表示されます
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>
                    <strong>差分を出力</strong> — 統一diff形式の
                    .diff ファイルとしてダウンロード、またはクリップボードにコピーできます
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "対応しているプログラミング言語は？",
                  a: "JavaScript / TypeScript、Python、Go、Ruby の関数定義を検出できます。それ以外の言語でも、テキストモードで行・単語レベルの差分比較が可能です。",
                },
                {
                  q: "入力したコードはサーバーに送信されますか？",
                  a: "いいえ。すべての処理はブラウザ内で完結します。コードがサーバーに送信されることはありません。",
                },
                {
                  q: "統一diff（unified diff）とは何ですか？",
                  a: "統一diff形式は、変更前後の差分を1つのファイルにまとめた標準的なフォーマットです。Git や patch コマンドなど多くのツールで利用されています。",
                },
                {
                  q: "大きなファイルでも比較できますか？",
                  a: "ブラウザのメモリが許す範囲であれば、大きなファイルでも比較可能です。数千行規模のコードでも問題なく動作します。",
                },
              ].map((faq, i) => (
                <details key={i} className="border rounded-md">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-muted/50">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-center mt-12">
          <AdPlaceholder position="content" />
        </div>
      </div>
    </>
  );
}
