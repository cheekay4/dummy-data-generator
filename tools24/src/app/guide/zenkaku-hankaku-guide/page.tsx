import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "全角・半角変換の基礎知識——データクレンジングとフォーム入力の標準化",
  description:
    "全角・半角の違い、混在が引き起こす問題（検索漏れ・CSV崩れ・帳票不具合）、Unicode正規化（NFKC）との関係、Excel関数やプログラミングでの変換方法を解説。",
  alternates: { canonical: "/guide/zenkaku-hankaku-guide" },
};

const faqs = [
  {
    question: "全角と半角は何が違うのですか？",
    answer:
      "全角文字は1文字あたり漢字と同じ幅を占め、半角文字はその半分の幅です。Unicodeでは全角の「Ａ」（U+FF21）と半角の「A」（U+0041）は異なるコードポイントを持つため、コンピュータは別の文字として扱います。見た目が似ていても内部表現が異なるのが問題の根本原因です。",
  },
  {
    question: "全角半角を統一するならどちらに合わせるべきですか？",
    answer:
      "一般的には半角英数字・半角カタカナは避けて、英数字は半角、カタカナは全角に統一するのが日本のビジネス慣習です。ただし、システムの仕様や業界の慣習によって異なるため、プロジェクト内で統一ルールを決めておくことが重要です。",
  },
  {
    question: "Unicode正規化（NFKC）で全角半角を統一できますか？",
    answer:
      "NFK正規化（NFKCまたはNFKD）を適用すると、全角英数字が半角に、半角カタカナが全角に変換されます。ただし、一部の記号（例：「㈱」→「(株)」）も変換されるため、意図しない変換が起きないか事前にテストが必要です。",
  },
  {
    question: "半角カタカナはなぜ問題になるのですか？",
    answer:
      "半角カタカナは濁点・半濁点が別の文字として扱われるため（例：「ガ」が「ｶﾞ」＝2文字になる）、文字数カウントやソート順が狂います。また、一部のシステムやフォントで正しく表示されないことがあります。データの正規化には全角カタカナへの変換が推奨されます。",
  },
  {
    question: "ExcelのJIS関数とASC関数の違いは？",
    answer:
      "JIS関数は半角文字を全角に変換し、ASC関数は全角文字を半角に変換します。例えば =ASC(\"１２３ＡＢＣ\") は \"123ABC\" を返し、=JIS(\"123ABC\") は \"１２３ＡＢＣ\" を返します。カタカナの変換も行われます。",
  },
];

export default function ZenkakuHankakuGuidePage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "全角・半角変換の基礎知識——データクレンジングとフォーム入力の標準化",
            description:
              "全角・半角の違い、混在が引き起こす問題、Unicode正規化との関係、Excel関数やプログラミングでの変換方法を解説。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/zenkaku-hankaku-guide" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "全角半角変換" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          全角・半角変換の基礎知識——データクレンジングとフォーム入力の標準化
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月29日 ・ 読了時間: 約5分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          日本語データを扱うシステムで頻繁に発生する「全角・半角問題」。
          検索してもヒットしない、CSVの列がずれる、帳票の数字が読みにくい——
          これらの原因の多くは、全角と半角の混在にあります。
          この記事では、全角・半角の基礎からデータクレンジングの実践手法まで解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">全角・半角とは — 文字幅とUnicodeの関係</h2>
        <p className="text-muted-foreground leading-relaxed">
          「全角」「半角」は元々、等幅フォントにおける文字の表示幅を指す概念です。
          漢字やひらがなは1文字分の幅（全角）を占め、ASCII文字はその半分の幅（半角）で表示されます。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Unicodeでは、同じ見た目の文字でも全角と半角に別のコードポイントが割り当てられています。
          例えば、半角の「A」はU+0041、全角の「Ａ」はU+FF21です。
          コンピュータにとってこれらは完全に異なる文字であるため、
          文字列比較や検索で不一致が起きます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">全角半角が混在する問題</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">問題</th>
                <th className="text-left py-2 pr-4">具体例</th>
                <th className="text-left py-2">影響</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">検索漏れ</td>
                <td className="py-2 pr-4">「TEL」で検索しても「ＴＥＬ」がヒットしない</td>
                <td className="py-2">顧客データの検索精度低下</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">マッチ不一致</td>
                <td className="py-2 pr-4">「090」と「０９０」が一致しない</td>
                <td className="py-2">重複チェックの失敗</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">CSV崩れ</td>
                <td className="py-2 pr-4">全角カンマ「，」がCSV区切りとして認識されない</td>
                <td className="py-2">インポートエラー・列ずれ</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">帳票不具合</td>
                <td className="py-2 pr-4">全角数字「１２，８００円」が右寄せされない</td>
                <td className="py-2">帳票レイアウトの崩れ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">業務での変換場面</h2>
        <p className="text-muted-foreground leading-relaxed">
          全角・半角変換が必要になる代表的な業務シーンは以下の通りです。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-3">
          <li>
            <strong className="text-foreground">顧客データクレンジング</strong> — CRMやデータベースに蓄積された顧客情報の
            電話番号・住所・氏名カナの全角半角を統一し、検索精度と重複排除の精度を向上させます。
          </li>
          <li>
            <strong className="text-foreground">CSVインポート前処理</strong> — 外部から受け取ったCSVデータの数値列に
            全角数字が混入していると、数値として認識されません。インポート前に半角に統一する処理が必要です。
          </li>
          <li>
            <strong className="text-foreground">フォームバリデーション</strong> — ユーザーが入力した電話番号やメールアドレスに
            全角文字が混入した場合、サーバー側で半角に正規化してからバリデーションすることで、
            入力エラーを減らせます。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Unicode正規化（NFC/NFKC）との関係</h2>
        <p className="text-muted-foreground leading-relaxed">
          Unicodeには4つの正規化形式（NFC・NFD・NFKC・NFKD）があります。
          全角半角の変換に関連するのは、互換分解を含むNFKC（またはNFKD）です。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          NFK正規化を適用すると、互換等価な文字が統一されます。
          例えば、全角英数字「Ａ」がASCIIの「A」に、半角カタカナ「ｶ」が全角カタカナ「カ」に変換されます。
          ただし、「㈱」が「(株)」に展開されるなど、意図しない変換も含まれるため注意が必要です。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h4 className="font-semibold text-foreground text-sm">NFKC正規化の変換例</h4>
          <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`入力: "Ｈｅｌｌｏ　Ｗｏｒｌｄ　１２３"
NFKC: "Hello World 123"

入力: "ｶﾀｶﾅ"
NFKC: "カタカナ"

入力: "㈱サンプル"
NFKC: "(株)サンプル"  ← 意図しない変換の可能性`}</code></pre>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Excelでの全角半角変換方法</h2>
        <p className="text-muted-foreground leading-relaxed">
          Excelには全角半角変換のための組み込み関数が用意されています。
        </p>
        <div className="overflow-x-auto not-prose mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">関数</th>
                <th className="text-left py-2 pr-4">機能</th>
                <th className="text-left py-2">使用例</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">ASC関数</td>
                <td className="py-2 pr-4">全角→半角に変換</td>
                <td className="py-2">=ASC(&quot;１２３ＡＢＣ&quot;) → &quot;123ABC&quot;</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">JIS関数</td>
                <td className="py-2 pr-4">半角→全角に変換</td>
                <td className="py-2">=JIS(&quot;123ABC&quot;) → &quot;１２３ＡＢＣ&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          大量のデータを一括変換する場合は、新しい列に関数を入力してからコピー＆値貼り付けを行います。
          ただし、Excel関数では「英数字は半角・カタカナは全角」のような細かい制御はできないため、
          専用ツールの利用が効率的です。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">プログラミングでの変換</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">JavaScript</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`// 全角英数字→半角に変換
function toHalfWidth(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  );
}

// NFKC正規化（全角英数→半角、半角カナ→全角）
const normalized = text.normalize('NFKC');`}</code></pre>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">Python</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`import unicodedata

# NFKC正規化
text = "Ｈｅｌｌｏ　１２３　ｶﾀｶﾅ"
normalized = unicodedata.normalize('NFKC', text)
# → "Hello 123 カタカナ"`}</code></pre>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jpの全角・半角変換で一括処理</h2>
        <p className="text-muted-foreground leading-relaxed">
          英数字・カタカナ・記号の全角半角を一括で変換したい場合は、
          <Link href="/zenkaku-hankaku" className="text-primary hover:underline">
            tools24.jpの全角・半角変換ツール
          </Link>
          をご利用ください。「英数字は半角に、カタカナは全角に」といった細かい設定が可能で、
          ブラウザ内で処理するためデータがサーバーに送信されることはありません。
          コピー＆ペーストで手軽に使えるため、Excelの関数より直感的に操作できます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <Link href="/guide/csv-mojibake" className="text-primary hover:underline">
              ExcelのCSV文字化けを3秒で直す方法
            </Link>
          </li>
          <li>
            <Link href="/guide/digital-stamp-remote" className="text-primary hover:underline">
              電子印鑑ガイド
            </Link>
          </li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
