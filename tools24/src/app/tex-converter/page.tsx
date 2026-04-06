import type { Metadata } from "next";
import { TexConverterMain } from "@/components/tex-converter/tex-converter-main";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title:
    "LaTeX / TeX 変換ツール — 数式プレビュー・Markdown相互変換 | tools24.jp",
  description:
    "LaTeX数式をリアルタイムプレビュー。LaTeX⇔Markdown相互変換にも対応。KaTeX描画エンジン搭載。登録不要・無料・ブラウザ内で完結。",
  openGraph: {
    title:
      "LaTeX / TeX 変換ツール — 数式プレビュー・Markdown相互変換 | tools24.jp",
    description:
      "LaTeX数式をリアルタイムプレビュー。LaTeX⇔Markdown相互変換にも対応。KaTeX描画エンジン搭載。登録不要・無料・ブラウザ内で完結。",
    url: "https://tools24.jp/tex-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LaTeX / TeX 変換ツール",
  description:
    "LaTeX数式のリアルタイムプレビューとLaTeX⇔Markdown相互変換ツール。KaTeX描画エンジン搭載。",
  url: "https://tools24.jp/tex-converter",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function TexConverterPage(): React.ReactElement {
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

        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: "LaTeX / TeX 変換ツール" }]} />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              LaTeX / TeX 変換ツール
            </h1>
            <p className="text-muted-foreground">
              数式のリアルタイムプレビュー、LaTeX と Markdown
              の相互変換に対応
            </p>
          </div>

          <TexConverterMain />

          <div className="flex justify-center my-8">
            <AdPlaceholder position="content" />
          </div>

          {/* SEO コンテンツ */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">
              LaTeX / KaTeX とは
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              LaTeX（ラテフ）は、科学論文や数学文書で広く使われる組版システムです。
              複雑な数式を正確かつ美しく表示できることから、学術分野のデファクトスタンダードとなっています。
              KaTeX は LaTeX の数式記法をウェブブラウザ上で高速に描画するための JavaScript
              ライブラリで、本ツールの描画エンジンとして使用しています。
              すべての処理はブラウザ内で完結するため、入力した数式がサーバーに送信されることはありません。
            </p>

            <h2 className="text-xl font-semibold mb-3">
              よく使う数式コマンド一覧
            </h2>
            <div className="not-prose mb-6 overflow-x-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border px-3 py-2 text-left">カテゴリ</th>
                    <th className="border px-3 py-2 text-left">コマンド</th>
                    <th className="border px-3 py-2 text-left">説明</th>
                    <th className="border px-3 py-2 text-left">例</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["分数", "\\frac{a}{b}", "分数", "\\frac{1}{2}"],
                    ["累乗", "x^{n}", "上付き文字（累乗）", "x^{2}"],
                    ["添字", "x_{i}", "下付き文字（添字）", "a_{1}"],
                    [
                      "平方根",
                      "\\sqrt{x}",
                      "平方根",
                      "\\sqrt{2}",
                    ],
                    [
                      "総和",
                      "\\sum_{i=1}^{n}",
                      "シグマ記号",
                      "\\sum_{i=1}^{n} i",
                    ],
                    [
                      "積分",
                      "\\int_{a}^{b}",
                      "積分記号",
                      "\\int_0^1 x\\,dx",
                    ],
                    [
                      "極限",
                      "\\lim_{x \\to 0}",
                      "極限",
                      "\\lim_{x \\to 0} f(x)",
                    ],
                    [
                      "ギリシャ文字",
                      "\\alpha, \\beta, \\pi",
                      "ギリシャ文字",
                      "\\alpha + \\beta = \\pi",
                    ],
                    [
                      "行列",
                      "\\begin{pmatrix}...\\end{pmatrix}",
                      "丸括弧付き行列",
                      "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
                    ],
                    [
                      "偏微分",
                      "\\partial",
                      "偏微分記号",
                      "\\frac{\\partial f}{\\partial x}",
                    ],
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2">{row[0]}</td>
                      <td className="border px-3 py-2 font-mono text-xs">
                        {row[1]}
                      </td>
                      <td className="border px-3 py-2">{row[2]}</td>
                      <td className="border px-3 py-2 font-mono text-xs">
                        {row[3]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mb-3">
              Markdown で LaTeX 数式を書く方法
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              多くの Markdown エディタ（GitHub、Notion、Qiita、Zenn
              など）では、LaTeX 記法で数式を埋め込むことができます。
            </p>
            <div className="not-prose mb-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    <strong>インライン数式</strong> —{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      $E = mc^2$
                    </code>{" "}
                    のように <code className="bg-muted px-1 rounded text-xs">$</code>{" "}
                    で囲みます
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    <strong>ディスプレイ数式</strong> —{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      $$...$$
                    </code>{" "}
                    で囲むと、独立した行に中央揃えで表示されます
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>
                    <strong>LaTeX → Markdown 変換</strong> —
                    本ツールの変換機能を使えば、LaTeX
                    文書をそのまま Markdown に変換できます
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "対応しているLaTeXコマンドは？",
                  a: "KaTeX がサポートするすべてのコマンドに対応しています。amsmath、amssymb などの主要パッケージのコマンドを含みます。対応コマンドの完全なリストは KaTeX 公式ドキュメントをご参照ください。",
                },
                {
                  q: "入力した数式はサーバーに送信されますか？",
                  a: "いいえ。すべての変換・描画処理はブラウザ内で完結します。入力データがサーバーに送信されることは一切ありません。",
                },
                {
                  q: "Markdown変換はどこまで対応していますか？",
                  a: "セクション見出し、太字・斜体、箇条書き・番号付きリスト、数式環境、ハイパーリンク、コードブロックなど、基本的な LaTeX / Markdown 記法の相互変換に対応しています。複雑なカスタムコマンドやマクロは変換されない場合があります。",
                },
                {
                  q: "生成した .tex ファイルはそのままコンパイルできますか？",
                  a: "はい。Markdown → LaTeX 変換で生成される .tex ファイルには documentclass やパッケージ宣言を含む完全なプリアンブルが付与されるため、pdflatex や lualatex でそのままコンパイル可能です。",
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
