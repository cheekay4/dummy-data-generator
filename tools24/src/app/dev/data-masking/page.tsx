import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { DataMasking } from "@/components/data-masking/data-masking";

export const metadata: Metadata = {
  title: "個人情報マスキングツール — テキスト中の個人情報を自動検出・マスク",
  description:
    "氏名・電話番号・メールアドレス・住所・マイナンバー・クレジットカード番号をブラウザ内で自動検出してマスキング。データ送信なし・完全無料。",
  keywords: [
    "個人情報",
    "マスキング",
    "匿名化",
    "テストデータ",
    "データクレンジング",
    "PII",
    "GDPR",
    "個人情報保護",
  ],
  openGraph: {
    title: "個人情報マスキングツール | tools24.jp",
    description:
      "テキスト中の個人情報を自動検出してマスキング。ブラウザ内処理でデータ送信なし。",
    url: "https://tools24.jp/dev/data-masking",
  },
  alternates: { canonical: "/dev/data-masking" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "個人情報マスキングツール",
  description:
    "テキスト中の氏名・電話番号・メールアドレスなどの個人情報を自動検出してマスキング",
  url: "https://tools24.jp/dev/data-masking",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

const faqs = [
  {
    question: "入力したテキストはサーバーに送信されますか？",
    answer:
      "いいえ、全ての処理はブラウザ内で完結します。入力されたテキストがサーバーに送信されることは一切ありません。安心して機密データを含むテキストもお使いいただけます。",
  },
  {
    question: "どんな個人情報を検出できますか？",
    answer:
      "氏名（日本語）、電話番号、メールアドレス、住所、郵便番号、マイナンバー、クレジットカード番号、IPアドレスの8種類に対応しています。正規表現と辞書ベースの検出を組み合わせて高精度な検出を実現しています。",
  },
  {
    question: "マスクモードの違いは？",
    answer:
      "固定ラベル（[氏名]等の置換）、墨消し（文字を黒塗り風に置換）、ハッシュ（SHA-256による匿名化）、ダミーデータ（リアルな偽データへの置換）の4種類から選べます。用途に応じてお選びください。",
  },
  {
    question: "検出精度はどの程度ですか？",
    answer:
      "正規表現と辞書ベースの検出で高精度ですが、100%の検出を保証するものではありません。重要なデータを扱う場合は、処理結果を必ず目視で確認することを推奨します。",
  },
  {
    question: "大量のテキストも処理できますか？",
    answer:
      "ブラウザ内処理のため、数万文字程度であれば問題なく処理できます。非常に大きなテキストの場合はブラウザのメモリに依存しますが、通常の業務用途では十分な処理能力があります。",
  },
  {
    question: "英語のテキストにも対応していますか？",
    answer:
      "メールアドレス、IPアドレス、クレジットカード番号は言語に依存しないため検出可能です。氏名・住所の検出は日本語に最適化されているため、英語テキストでは検出精度が下がる場合があります。",
  },
];

export default function DataMaskingPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ツール", href: "/dev" },
          { label: "個人情報マスキング" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1>個人情報マスキングツール</h1>
        <p>
          テキスト中の氏名・電話番号・メールアドレスなどの個人情報を自動検出し、マスキングします。
          全ての処理はブラウザ内で完結。データがサーバーに送信されることはありません。
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <div className="not-prose">
          <DataMasking />
        </div>

        <AdPlaceholder position="content" className="mt-8 mb-8" />

        {/* SEO Content */}
        <h2>個人情報マスキングとは</h2>
        <p>
          個人情報マスキング（データマスキング）とは、テキストやデータベースに含まれる
          個人を特定できる情報（PII: Personally Identifiable Information）を、
          別の文字列に置き換えて匿名化する処理です。
          開発・テスト環境でのデータ利用、ログファイルの共有、ドキュメントの外部公開など、
          さまざまな場面で個人情報の漏洩リスクを低減するために活用されています。
          2022年施行の改正個人情報保護法では、個人情報の適切な管理がより厳格に求められるようになり、
          マスキング処理の重要性はますます高まっています。
        </p>

        <h2>使い方</h2>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-2">Step 1</div>
            <p className="text-sm text-muted-foreground">
              テキストを入力（貼り付け or ファイルアップロード）
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-2">Step 2</div>
            <p className="text-sm text-muted-foreground">
              検出対象とマスクモードを選択
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-2">Step 3</div>
            <p className="text-sm text-muted-foreground">
              「マスク実行」ボタンをクリック → 結果をコピーまたはダウンロード
            </p>
          </div>
        </div>

        <h2>検出できる個人情報の種類</h2>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-3 py-2 text-left">種類</th>
                <th className="border px-3 py-2 text-left">検出例</th>
                <th className="border px-3 py-2 text-left">検出方法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">氏名</td>
                <td className="border px-3 py-2 font-mono">山田太郎</td>
                <td className="border px-3 py-2">辞書+パターン</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">電話番号</td>
                <td className="border px-3 py-2 font-mono">090-1234-5678</td>
                <td className="border px-3 py-2">正規表現</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">メールアドレス</td>
                <td className="border px-3 py-2 font-mono">user@example.com</td>
                <td className="border px-3 py-2">正規表現</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">住所</td>
                <td className="border px-3 py-2 font-mono">東京都渋谷区...</td>
                <td className="border px-3 py-2">都道府県辞書+パターン</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">郵便番号</td>
                <td className="border px-3 py-2 font-mono">150-0001</td>
                <td className="border px-3 py-2">正規表現</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">マイナンバー</td>
                <td className="border px-3 py-2 font-mono">123456789012</td>
                <td className="border px-3 py-2">12桁数字パターン</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">クレジットカード</td>
                <td className="border px-3 py-2 font-mono">4111-1111-1111-1111</td>
                <td className="border px-3 py-2">Luhn検証+パターン</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">IPアドレス</td>
                <td className="border px-3 py-2 font-mono">192.168.1.1</td>
                <td className="border px-3 py-2">IPv4パターン</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>4つのマスクモード</h2>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-3 py-2 text-left">モード</th>
                <th className="border px-3 py-2 text-left">変換例</th>
                <th className="border px-3 py-2 text-left">用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">固定ラベル</td>
                <td className="border px-3 py-2 font-mono">{"山田太郎 → [氏名]"}</td>
                <td className="border px-3 py-2">ログ分析・データ構造を保持したい場合</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">墨消し</td>
                <td className="border px-3 py-2 font-mono">{"山田太郎 → ●●●●"}</td>
                <td className="border px-3 py-2">書類の黒塗り風・視覚的にマスクしたい場合</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">ハッシュ</td>
                <td className="border px-3 py-2 font-mono">{"山田太郎 → a1b2c3d4"}</td>
                <td className="border px-3 py-2">同一人物の追跡が必要だが匿名化したい場合</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">ダミーデータ</td>
                <td className="border px-3 py-2 font-mono">{"山田太郎 → 佐藤花子"}</td>
                <td className="border px-3 py-2">テストデータ作成・リアルなデータが必要な場合</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>開発現場での活用シーン</h2>
        <ul>
          <li>テスト環境へのデータ移行時の匿名化</li>
          <li>ログファイルの個人情報除去</li>
          <li>スクリーンショットやドキュメントの共有前処理</li>
          <li>GDPR・個人情報保護法対応のデータクレンジング</li>
          <li>AIモデルの学習データから個人情報を除去</li>
        </ul>

        <h2>個人情報保護法との関係</h2>
        <p>
          2022年施行の改正個人情報保護法では、個人データの漏洩等が発生した場合の報告義務が強化されました。
          マスキングは「仮名加工情報」の作成手段の一つとして位置づけられています。
          適切なマスキング処理を行うことで、開発・テスト環境での個人情報取り扱いリスクを大幅に軽減できます。
          ただし、本ツールの処理はあくまで簡易的なマスキングであり、
          法的な要件を満たす「匿名加工情報」の作成には、専門家のレビューが必要です。
        </p>

        <p className="text-sm text-muted-foreground mt-4">
          ※ 本ツールは正規表現と辞書ベースの検出を行うため、100%の検出精度を保証するものではありません。
          機密性の高いデータを扱う場合は、処理結果を必ず目視で確認してください。
        </p>
      </article>

      <FAQSection faqs={faqs} />
      <AdPlaceholder position="content" className="mt-8" />
    </>
  );
}
