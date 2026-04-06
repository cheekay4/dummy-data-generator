import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "Base64エンコードとは？仕組み・用途・変換方法をわかりやすく解説",
  description:
    "Base64エンコードの仕組み、メール添付・Data URI・JWT・API認証での用途、JavaScript/Pythonでの変換方法、URLセーフBase64との違いをわかりやすく解説。",
  alternates: { canonical: "/guide/base64-guide" },
};

const faqs = [
  {
    question: "Base64エンコードするとデータサイズはどのくらい増えますか？",
    answer:
      "Base64エンコードすると、元のデータに対して約33%サイズが増加します。3バイトの入力が4文字（4バイト）の出力になるため、4/3倍（約1.33倍）になります。パディング文字（=）が追加される場合はさらにわずかに増えます。",
  },
  {
    question: "Base64とBase64URLの違いは何ですか？",
    answer:
      "標準のBase64では「+」「/」「=」が使われますが、URLやファイル名で問題になることがあります。Base64URL（URLセーフBase64）では「+」を「-」に、「/」を「_」に置き換え、パディングの「=」を省略します。JWTトークンなどで広く使われています。",
  },
  {
    question: "Base64は暗号化として使えますか？",
    answer:
      "いいえ、Base64は暗号化ではありません。単なるエンコーディング（符号化）であり、誰でも簡単にデコードできます。機密データの保護にはAESやRSAなどの暗号化アルゴリズムを使用してください。",
  },
  {
    question: "画像をBase64に変換するメリットは？",
    answer:
      "画像をBase64でData URIに変換すると、HTMLやCSS内に直接埋め込めるため、HTTPリクエスト数を減らせます。ただしファイルサイズが約33%増加するため、小さなアイコンやロゴ（数KB以下）に適しており、大きな画像には不向きです。",
  },
  {
    question: "日本語テキストもBase64エンコードできますか？",
    answer:
      "はい、日本語テキストもBase64エンコードできます。ただし、まずテキストをUTF-8などのバイト列に変換してからBase64エンコードする必要があります。JavaScriptではbtoa()がLatin-1のみ対応のため、TextEncoderを併用するか、tools24.jpの変換ツールをご利用ください。",
  },
];

export default function Base64GuidePage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Base64エンコードとは？仕組み・用途・変換方法をわかりやすく解説",
            description:
              "Base64エンコードの仕組み、メール添付・Data URI・JWT・API認証での用途、JavaScript/Pythonでの変換方法を解説。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/base64-guide" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "Base64ガイド" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          Base64エンコードとは？仕組み・用途・変換方法をわかりやすく解説
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月29日 ・ 読了時間: 約5分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          Base64は、バイナリデータをテキスト文字列に変換するエンコーディング方式です。
          メールの添付ファイル、Data URI、JWTトークン、API認証ヘッダーなど、
          現代のWeb開発やシステム連携で幅広く使われています。
          この記事ではBase64の仕組みから実際の変換方法まで、わかりやすく解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Base64とは — バイナリ→テキスト変換の仕組み</h2>
        <p className="text-muted-foreground leading-relaxed">
          コンピュータが扱うデータには、テキスト（文字列）とバイナリ（画像・音声・実行ファイルなど）の2種類があります。
          メールやHTMLなど、テキストしか扱えないプロトコルやフォーマットでバイナリデータを送りたい場合、
          バイナリをテキストに変換する必要があります。この変換を行うのがBase64です。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Base64は、A-Z（26文字）、a-z（26文字）、0-9（10文字）、+、/の合計64種類の文字と、
          パディング用の「=」を使ってデータを表現します。
          ASCII文字だけで構成されるため、テキストベースのあらゆるシステムで安全に転送できます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">なぜBase64が必要か — メール添付・Data URI・JWT・API認証</h2>
        <p className="text-muted-foreground leading-relaxed">
          Base64が使われる主なシーンは以下の通りです。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-3">
          <li>
            <strong className="text-foreground">メール添付（MIME）</strong> — SMTPプロトコルは7bitのASCIIテキストを前提としているため、
            画像やPDFなどのバイナリファイルはBase64に変換して送信されます。
          </li>
          <li>
            <strong className="text-foreground">Data URI</strong> — 小さな画像やフォントをHTMLやCSSに直接埋め込む場合に、
            <code>data:image/png;base64,iVBOR...</code> のような形式で使います。
          </li>
          <li>
            <strong className="text-foreground">JWT（JSON Web Token）</strong> — ヘッダーとペイロードがBase64URLでエンコードされています。
            ドット（.）で区切られた3つのBase64URL文字列で構成されます。
          </li>
          <li>
            <strong className="text-foreground">Basic認証</strong> — HTTPのBasic認証では、
            ユーザー名とパスワードを「user:password」の形式でBase64エンコードし、Authorizationヘッダーに設定します。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">エンコードの仕組み — 3バイト→4文字への変換プロセス</h2>
        <p className="text-muted-foreground leading-relaxed">
          Base64エンコードは、入力データを3バイト（24ビット）ずつ区切り、
          それを6ビットずつ4つのグループに分割して変換します。
        </p>
        <div className="overflow-x-auto not-prose mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">ステップ</th>
                <th className="text-left py-2 pr-4">処理内容</th>
                <th className="text-left py-2">例（&quot;ABC&quot;）</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">1. ASCII値に変換</td>
                <td className="py-2 pr-4">各文字をバイト値にする</td>
                <td className="py-2">65, 66, 67</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">2. 2進数に変換</td>
                <td className="py-2 pr-4">8ビットずつ連結（24ビット）</td>
                <td className="py-2">01000001 01000010 01000011</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">3. 6ビットに分割</td>
                <td className="py-2 pr-4">24ビットを4グループに分割</td>
                <td className="py-2">010000 010100 001001 000011</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">4. Base64文字に変換</td>
                <td className="py-2 pr-4">各6ビット値を変換テーブルで文字に</td>
                <td className="py-2">Q, U, J, D → &quot;QUJD&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          入力が3バイトの倍数でない場合は、足りない分を0で埋め、出力には「=」（パディング）が追加されます。
          1バイト余りなら「==」、2バイト余りなら「=」が末尾に付きます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">URLセーフBase64との違い — + / = の代替文字</h2>
        <p className="text-muted-foreground leading-relaxed">
          標準のBase64で使われる「+」「/」「=」は、URLやファイル名で特別な意味を持つため、
          そのまま使うと問題が生じることがあります。
          URLセーフBase64（Base64URL）では、以下のように文字を置き換えます。
        </p>
        <div className="overflow-x-auto not-prose mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">標準Base64</th>
                <th className="text-left py-2 pr-4">Base64URL</th>
                <th className="text-left py-2">理由</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">+</td>
                <td className="py-2 pr-4 font-medium text-foreground">-</td>
                <td className="py-2">URLで「+」はスペースに変換される</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">/</td>
                <td className="py-2 pr-4 font-medium text-foreground">_</td>
                <td className="py-2">URLで「/」はパス区切りになる</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">=</td>
                <td className="py-2 pr-4 font-medium text-foreground">（省略）</td>
                <td className="py-2">URLで「=」はクエリパラメータに使われる</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">プログラミング言語別の変換方法</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">JavaScript（ブラウザ）</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`// エンコード（ASCII文字列のみ）
const encoded = btoa('Hello, World!');
// → "SGVsbG8sIFdvcmxkIQ=="

// デコード
const decoded = atob(encoded);
// → "Hello, World!"

// 日本語を含む場合（UTF-8対応）
const utf8Encode = btoa(
  new TextEncoder().encode('こんにちは')
    .reduce((s, b) => s + String.fromCharCode(b), '')
);`}</code></pre>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground text-sm">Python</h4>
            <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto"><code>{`import base64

# エンコード
encoded = base64.b64encode(b'Hello, World!')
# → b'SGVsbG8sIFdvcmxkIQ=='

# デコード
decoded = base64.b64decode(encoded)
# → b'Hello, World!'

# URLセーフBase64
url_safe = base64.urlsafe_b64encode(b'data')
# → b'ZGF0YQ=='`}</code></pre>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">セキュリティの注意 — Base64は暗号化ではない</h2>
        <p className="text-muted-foreground leading-relaxed">
          Base64はデータの「見た目」を変えるだけで、暗号化ではありません。
          Base64エンコードされた文字列は、誰でも簡単にデコードして元のデータを読み取れます。
          パスワードやAPIキーなどの機密情報をBase64でエンコードしただけで「安全」と考えるのは危険です。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Basic認証がHTTPS必須とされるのも、Authorizationヘッダーに含まれるBase64文字列が
          簡単にデコードできるためです。機密データの保護には、必ずTLS/HTTPSと組み合わせるか、
          AES・RSAなどの暗号化アルゴリズムを使用してください。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jpでBase64変換する</h2>
        <p className="text-muted-foreground leading-relaxed">
          テキストやファイルのBase64エンコード・デコードを行いたい場合は、
          <Link href="/dev/encode-decode" className="text-primary hover:underline">
            tools24.jpのエンコード・デコードツール
          </Link>
          をご利用ください。ブラウザ内で処理するため、データがサーバーに送信されることはありません。
          URLセーフBase64への変換にも対応しています。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <Link href="/guide/json-api-debug" className="text-primary hover:underline">
              JSON整形ツールでAPIデバッグを効率化する方法
            </Link>
          </li>
          <li>
            <Link href="/guide/regex-beginners" className="text-primary hover:underline">
              正規表現の基礎ガイド
            </Link>
          </li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
