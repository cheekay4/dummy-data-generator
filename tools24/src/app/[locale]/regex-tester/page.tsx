import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RegexTester } from "@/components/regex-tester/regex-tester";
import { RelatedTools } from "@/components/common/related-tools";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const toolUrl = locale === "ja" ? `${baseUrl}/regex-tester` : `${baseUrl}/en/regex-tester`;

  return {
    title: t("regexTester.title"),
    description: t("regexTester.description"),
    alternates: {
      canonical: toolUrl,
      languages: {
        ja: `${baseUrl}/regex-tester`,
        en: `${baseUrl}/en/regex-tester`,
        "x-default": `${baseUrl}/regex-tester`,
      },
    },
    openGraph: {
      title: t("regexTester.title"),
      description: t("regexTester.description"),
      url: toolUrl,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function RegexTesterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "tools" });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <Breadcrumb items={[{ label: tTools("regex-tester.title") }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{tTools("regex-tester.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {tTools("regex-tester.description")}
        </p>
      </div>

      <RegexTester />

      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      <RelatedTools currentPath="/regex-tester" />

      {/* SEO content (JA) */}
      <section className="mt-12 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">正規表現とは</h2>
          <p>
            正規表現（Regular Expression）は、文字列のパターンを記述するための言語です。
            テキスト内の特定のパターンを検索・抽出・置換したり、入力値のバリデーション（形式チェック）に使われます。
            プログラミング・テキストエディタ・コマンドライン等、ほぼすべての開発環境で利用できます。
            当ツールはJavaScriptのRegExpエンジンを使用しており、
            Webアプリケーション開発で使う正規表現をそのままテストできます。
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">正規表現の基本文法</h2>

          <h3 className="text-base font-semibold text-foreground mb-2">文字クラス・メタ文字</h3>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground w-20">記号</th>
                  <th className="px-3 py-2 border font-medium text-foreground">意味</th>
                  <th className="px-3 py-2 border font-medium text-foreground">例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [".", "任意の1文字（改行除く）", ". → a, b, 1, あ など"],
                  ["\\d", "数字 0〜9", "\\d → 3, 7"],
                  ["\\D", "数字以外", "\\D → a, あ, !"],
                  ["\\w", "単語文字（英数字・_）", "\\w → a, Z, 0, _"],
                  ["\\W", "単語文字以外", "\\W → あ, !, スペース"],
                  ["\\s", "空白文字（スペース・タブ・改行）", "\\s → ' ', '\\t'"],
                  ["\\S", "空白以外", "\\S → a, あ, 1"],
                  ["[abc]", "a・b・c のいずれか1文字", "[aeiou] → 母音1文字"],
                  ["[^abc]", "a・b・c 以外の1文字", "[^0-9] → 数字以外"],
                  ["[a-z]", "a〜z の範囲の1文字", "[a-zA-Z0-9]"],
                ].map(([sym, meaning, ex]) => (
                  <tr key={sym} className="border-b">
                    <td className="px-3 py-2 border font-mono text-foreground">{sym}</td>
                    <td className="px-3 py-2 border">{meaning}</td>
                    <td className="px-3 py-2 border font-mono">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-2">量指定子（繰り返し）</h3>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground w-20">記号</th>
                  <th className="px-3 py-2 border font-medium text-foreground">意味</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["*", "直前を0回以上繰り返し（最長マッチ）"],
                  ["+", "直前を1回以上繰り返し（最長マッチ）"],
                  ["?", "直前を0または1回（省略可能）"],
                  ["{n}", "直前をちょうどn回繰り返し"],
                  ["{n,}", "直前をn回以上繰り返し"],
                  ["{n,m}", "直前をn〜m回繰り返し"],
                  ["*? +? ??", "最短マッチ（非貪欲）版"],
                ].map(([sym, meaning]) => (
                  <tr key={sym} className="border-b">
                    <td className="px-3 py-2 border font-mono text-foreground">{sym}</td>
                    <td className="px-3 py-2 border">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-2">アンカー・グループ・その他</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground w-28">記号</th>
                  <th className="px-3 py-2 border font-medium text-foreground">意味</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["^", "文字列の先頭（mフラグで各行の先頭）"],
                  ["$", "文字列の末尾（mフラグで各行の末尾）"],
                  ["\\b", "単語境界（単語の前後）"],
                  ["|", "OR（左辺または右辺にマッチ）"],
                  ["(...)", "キャプチャグループ（$1, $2...で参照）"],
                  ["(?:...)", "非キャプチャグループ（番号なし）"],
                  ["(?=...)", "肯定先読み"],
                  ["(?!...)", "否定先読み"],
                  ["(?<=...)", "肯定後読み"],
                  ["(?<!...)", "否定後読み"],
                ].map(([sym, meaning]) => (
                  <tr key={sym} className="border-b">
                    <td className="px-3 py-2 border font-mono text-foreground">{sym}</td>
                    <td className="px-3 py-2 border">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            よく使う正規表現パターン（日本語対応）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground">用途</th>
                  <th className="px-3 py-2 border font-medium text-foreground">パターン</th>
                  <th className="px-3 py-2 border font-medium text-foreground">解説</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["郵便番号", "\\d{3}-\\d{4}", "数字3桁、ハイフン、数字4桁"],
                  ["携帯電話", "0[789]0-\\d{4}-\\d{4}", "090/080/070 から始まる形式"],
                  ["固定電話", "0\\d{1,4}-\\d{1,4}-\\d{4}", "市外局番1〜4桁の形式"],
                  ["メール", "[\\w.%+\\-]+@[\\w.\\-]+\\.[a-z]{2,}", "基本的なメールアドレス形式"],
                  ["ひらがな", "[\\u3040-\\u309F]+", "Unicode範囲でひらがなを検出（uフラグ推奨）"],
                  ["カタカナ", "[\\u30A0-\\u30FF]+", "Unicode範囲でカタカナを検出"],
                  ["漢字", "[\\u4E00-\\u9FFF]+", "CJK統合漢字の範囲"],
                  ["日付 YYYY/MM/DD", "\\d{4}/\\d{2}/\\d{2}", "スラッシュ区切り日付形式"],
                  ["マイナンバー", "\\b\\d{12}\\b", "12桁の数字（単語境界付き）"],
                  ["URL (HTTP/S)", "https?://[\\w/:%#$&?()~.=+\\-]+", "HTTP・HTTPS URL"],
                ].map(([usage, pattern, desc]) => (
                  <tr key={usage} className="border-b">
                    <td className="px-3 py-2 border font-medium text-foreground">{usage}</td>
                    <td className="px-3 py-2 border font-mono">{pattern}</td>
                    <td className="px-3 py-2 border">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">よくある質問（FAQ）</h2>
          <div className="space-y-3">
            {[
              {
                q: "対応している正規表現エンジンは何ですか？",
                a: "JavaScriptのRegExpエンジン（ECMAScript標準）を使用しています。PythonやRubyなど他言語の正規表現と若干異なる場合があります。特にPCRE（Perl互換）には対応していない機能もあります。",
              },
              {
                q: "データはサーバーに送信されますか？",
                a: "いいえ、全てブラウザ内で処理されます。入力したパターンもテスト文字列も外部に一切送信されません。機密情報を含むテキストも安心してお使いいただけます。",
              },
              {
                q: "このツールは無料ですか？",
                a: "はい、完全無料です。会員登録も不要です。",
              },
              {
                q: "日本語（ひらがな・カタカナ・漢字）の正規表現は書けますか？",
                a: "はい、Unicodeの文字範囲を使って書けます。例: ひらがな [\\u3040-\\u309F]、カタカナ [\\u30A0-\\u30FF]。uフラグを有効にするとUnicode文字を正しく扱えます。",
              },
              {
                q: "共有リンクの有効期限はありますか？",
                a: "共有リンクはURLパラメータにパターン・フラグ・テスト文字列を埋め込んでいます。サーバーには保存されませんので有効期限はなく、URLを共有するだけで同じ状態を再現できます。ただし非常に長いテスト文字列はURL長の制限（約3,000文字）で切り詰められる場合があります。",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="border rounded-lg group" open={i === 0}>
                <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none text-foreground">
                  <span>Q. {q}</span>
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-3 border-t pt-3">A. {a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
