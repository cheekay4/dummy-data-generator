import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "【初心者向け】正規表現の基本と実践テクニック——コピペで使えるパターン集",
  description:
    "正規表現（RegExp）の基本構文・よく使うパターン10選・陥りがちな罠をわかりやすく解説。メールアドレス・電話番号・郵便番号などのパターンをコピペですぐ使えます。",
  alternates: { canonical: "/guide/regex-beginners" },
};

const faqs = [
  {
    question: "正規表現はどのプログラミング言語で使えますか？",
    answer:
      "JavaScript、Python、Java、PHP、Ruby、Go、C# など、ほぼすべての主要言語で正規表現を使えます。基本構文は共通ですが、後読み（lookbehind）や名前付きキャプチャなど、一部の高度な機能は言語によって対応状況が異なります。",
  },
  {
    question: "正規表現の「貪欲マッチ」と「最短マッチ」の違いは？",
    answer:
      "貪欲マッチ（greedy）はできるだけ長い文字列にマッチしようとします（例: .*）。最短マッチ（lazy）は ? を付けることで最短の文字列にマッチします（例: .*?）。HTMLタグの中身を取得するときなど、最短マッチを使わないと意図しない結果になることがあります。",
  },
  {
    question: "正規表現のパフォーマンスが悪くなる原因は？",
    answer:
      "主な原因は「壊滅的バックトラッキング（catastrophic backtracking）」です。ネストした量指定子（例: (a+)+）や、重複するパターンの組み合わせが原因で、入力文字列の長さに対して指数関数的に処理時間が増大します。パターンを単純化するか、アトミックグループ・所有量指定子を使うことで回避できます。",
  },
  {
    question: "正規表現でメールアドレスを完全にバリデーションできますか？",
    answer:
      "RFC 5322 に完全準拠した正規表現は非常に複雑で、実用的ではありません。一般的には ^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$ のような簡易パターンで基本的なフォーマットチェックを行い、実際の到達確認はメール送信で行うのがベストプラクティスです。",
  },
  {
    question: "正規表現を学ぶのにおすすめの方法は？",
    answer:
      "まずは基本のメタ文字（. * + ? [] ()）を覚え、実際のパターンをコピペして動かしてみるのが最短ルートです。tools24.jp の正規表現テスターを使えば、ブラウザ上でリアルタイムにマッチ結果を確認できるので、試行錯誤しながら学べます。",
  },
];

export default function RegexBeginnersPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "【初心者向け】正規表現の基本と実践テクニック——コピペで使えるパターン集",
            description:
              "正規表現（RegExp）の基本構文・よく使うパターン10選・陥りがちな罠をわかりやすく解説。メールアドレス・電話番号・郵便番号などのパターンをコピペですぐ使えます。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/regex-beginners" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "正規表現入門" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          【初心者向け】正規表現の基本と実践テクニック——コピペで使えるパターン集
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月29日 ・ 読了時間: 約7分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          「正規表現って難しそう...」——そう思って避けていませんか？
          実は、基本パターンを10個覚えるだけで、日常のプログラミングやデータ処理が驚くほどラクになります。
          このガイドでは、正規表現の基本構文からコピペで使える実践パターンまで、初心者向けにわかりやすく解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">正規表現とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          正規表現（Regular Expression / RegExp）とは、文字列のパターンを記述するための特殊な記法です。
          一言でいえば「文字列の検索・置換・抽出を柔軟に行うためのミニ言語」です。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          正規表現が活躍する場面は多岐にわたります。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside mt-2">
          <li><strong className="text-foreground">バリデーション</strong> — メールアドレスや電話番号の形式チェック</li>
          <li><strong className="text-foreground">検索・置換</strong> — エディタやIDEでの高度な検索、一括置換</li>
          <li><strong className="text-foreground">ログ解析</strong> — サーバーログからエラーパターンを抽出</li>
          <li><strong className="text-foreground">データクレンジング</strong> — CSV・テキストデータの不要文字除去や正規化</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">基本構文 — メタ文字一覧</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          正規表現は「メタ文字」と呼ばれる特殊文字を組み合わせてパターンを記述します。
          まずはこの表を押さえておけば、ほとんどのパターンが読めるようになります。
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">メタ文字</th>
                <th className="text-left py-2 pr-4">意味</th>
                <th className="text-left py-2">例</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">.</td>
                <td className="py-2 pr-4">任意の1文字（改行を除く）</td>
                <td className="py-2 font-mono">a.c → abc, aXc</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">*</td>
                <td className="py-2 pr-4">直前の文字が0回以上</td>
                <td className="py-2 font-mono">ab*c → ac, abc, abbc</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">+</td>
                <td className="py-2 pr-4">直前の文字が1回以上</td>
                <td className="py-2 font-mono">ab+c → abc, abbc（acは不可）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">?</td>
                <td className="py-2 pr-4">直前の文字が0回または1回</td>
                <td className="py-2 font-mono">colou?r → color, colour</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">^</td>
                <td className="py-2 pr-4">行頭</td>
                <td className="py-2 font-mono">^Hello → 行頭のHello</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">$</td>
                <td className="py-2 pr-4">行末</td>
                <td className="py-2 font-mono">end$ → 行末のend</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">[]</td>
                <td className="py-2 pr-4">文字クラス（いずれか1文字）</td>
                <td className="py-2 font-mono">[aeiou] → 母音1文字</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">()</td>
                <td className="py-2 pr-4">グループ化・キャプチャ</td>
                <td className="py-2 font-mono">(ab)+ → ab, abab</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono font-medium text-foreground">{"{n,m}"}</td>
                <td className="py-2 pr-4">直前の文字がn回以上m回以下</td>
                <td className="py-2 font-mono">{"a{2,4}"} → aa, aaa, aaaa</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono font-medium text-foreground">|</td>
                <td className="py-2 pr-4">OR（いずれか）</td>
                <td className="py-2 font-mono">cat|dog → catまたはdog</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">よく使うパターン10選</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          実務で頻出する正規表現パターンを厳選しました。そのままコピペして使えます。
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">用途</th>
                <th className="text-left py-2 pr-4">パターン</th>
                <th className="text-left py-2">使用場面</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">メールアドレス</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$"}</td>
                <td className="py-2">フォームバリデーション</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">電話番号（日本）</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^0\\d{1,4}-?\\d{1,4}-?\\d{3,4}$"}</td>
                <td className="py-2">入力チェック・正規化</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">郵便番号</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^\\d{3}-?\\d{4}$"}</td>
                <td className="py-2">住所フォームの検証</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">URL</td>
                <td className="py-2 pr-4 font-mono text-xs">{"https?://[\\w/:%#$&?()~.=+\\-]+"}</td>
                <td className="py-2">テキストからリンク抽出</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">IPv4アドレス</td>
                <td className="py-2 pr-4 font-mono text-xs">{"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b"}</td>
                <td className="py-2">ログ解析・ネットワーク監視</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">日付（YYYY-MM-DD）</td>
                <td className="py-2 pr-4 font-mono text-xs">{"\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])"}</td>
                <td className="py-2">ログ・CSVの日付抽出</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">全角カタカナのみ</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^[\\u30A0-\\u30FF]+$"}</td>
                <td className="py-2">フリガナ入力の検証</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">半角英数のみ</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^[a-zA-Z0-9]+$"}</td>
                <td className="py-2">ユーザーID・パスワード検証</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">HTMLタグ除去</td>
                <td className="py-2 pr-4 font-mono text-xs">{"<[^>]*>"}</td>
                <td className="py-2">スクレイピング・テキスト抽出</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">空白行の削除</td>
                <td className="py-2 pr-4 font-mono text-xs">{"^\\s*$\\n?"}</td>
                <td className="py-2">コード整形・データクレンジング</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">正規表現で陥りがちな罠</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="font-semibold text-foreground">貪欲マッチの意図しない動作</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              <code className="bg-muted px-1 rounded">{`<.*>`}</code> は最長一致するため、
              <code className="bg-muted px-1 rounded">{`<b>太字</b>の<i>斜体</i>`}</code> に対して全体にマッチしてしまいます。
              <code className="bg-muted px-1 rounded">{`<.*?>`}</code> のように <code className="bg-muted px-1 rounded">?</code> を付けて最短マッチにするか、
              <code className="bg-muted px-1 rounded">{`<[^>]*>`}</code> のように否定文字クラスを使いましょう。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-semibold text-foreground">後方参照の誤用</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              キャプチャグループ <code className="bg-muted px-1 rounded">()</code> と後方参照 <code className="bg-muted px-1 rounded">\1</code> は強力ですが、
              グループの番号がずれやすく、可読性も低下します。名前付きキャプチャ
              <code className="bg-muted px-1 rounded">{"(?<name>...)"}</code> を使うとコードの意図が明確になり、メンテナンス性が向上します。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="font-semibold text-foreground">パフォーマンス問題（ReDoS）</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              <code className="bg-muted px-1 rounded">(a+)+</code> のようなネストした量指定子は、
              入力が長くなると指数関数的に処理時間が増大します（ReDoS攻撃の原因）。
              ユーザー入力に正規表現を適用する場合は、パターンの複雑度に注意し、タイムアウトを設定することが重要です。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jp の正規表現テスターで試そう</h2>
        <p className="text-muted-foreground leading-relaxed">
          正規表現は座学だけでは身につきません。実際にパターンを書いて、マッチ結果をリアルタイムに確認するのが上達の近道です。
          tools24.jp の正規表現テスターなら、ブラウザ上で手軽に正規表現を試せます。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside mt-3">
          <li>登録不要・無料でブラウザだけで完結</li>
          <li>リアルタイムでマッチ結果をハイライト表示</li>
          <li>よく使うパターンのプリセット付き</li>
          <li>フラグ（g / i / m）の切り替えも簡単</li>
        </ul>
        <p className="mt-4">
          <Link
            href="/dev/regex-tester"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            正規表現テスターを使ってみる →
          </Link>
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
          <li>
            <Link href="/guide/json-api-debug" className="text-primary hover:underline">
              JSON・APIデバッグガイド
            </Link>{" "}
            — APIレスポンスの解析・デバッグテクニック
          </li>
          <li>
            <Link href="/guide/cron-guide" className="text-primary hover:underline">
              cron式の書き方ガイド
            </Link>{" "}
            — 定期実行スケジュールの設定方法
          </li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      {affiliateGuides['/guide/regex-beginners'] && (
        <AffiliateTextLink {...affiliateGuides['/guide/regex-beginners']} />
      )}
    </>
  );
}
