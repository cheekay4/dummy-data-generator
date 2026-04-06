import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "JSON整形ツールでAPIデバッグを効率化する方法 — 実践テクニック",
  description:
    "APIレスポンスの読み方、よくあるJSONエラーの原因と対処法、TypeScript型生成の活用テクニック、JSON vs YAML/XML比較を解説。",
  alternates: { canonical: "/guide/json-api-debug" },
};

const faqs = [
  {
    question: "JSONとJSONLの違いは何ですか？",
    answer:
      "JSON（JavaScript Object Notation）は1つのオブジェクトまたは配列を含むファイル形式です。JSONL（JSON Lines）は1行に1つのJSONオブジェクトを記述する形式で、ストリーミング処理やログ出力に適しています。",
  },
  {
    question: "JSON5やJSON with commentsとは？",
    answer:
      "JSON5はJSONを拡張し、コメント・末尾カンマ・シングルクォートなどを許可した形式です。tsconfig.jsonやpackage.jsonの一部でJSON with comments（JSONC）が使われています。標準のJSONパーサーでは読めないので注意が必要です。",
  },
  {
    question: "大きなJSONファイル（数十MB）も処理できますか？",
    answer:
      "tools24.jpのJSON整形ツールはブラウザ内で処理するため、数MB程度のJSONであれば問題ありません。数十MB以上の場合はjqコマンドやストリーミングパーサー（JSONStream等）の利用を推奨します。",
  },
  {
    question: "APIレスポンスのJSONをそのままTypeScriptの型にできますか？",
    answer:
      "はい、tools24.jpのJSON整形ツールには「TypeScript型生成」機能があります。JSONを貼り付けて変換ボタンを押すだけで、interface定義が自動生成されます。",
  },
];

export default function JsonApiDebugPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "JSON整形ツールでAPIデバッグを効率化する方法 — 実践テクニック",
            description:
              "APIレスポンスの読み方、よくあるJSONエラーの原因と対処法、TypeScript型生成の活用テクニック、JSON vs YAML/XML比較を解説。",
            datePublished: "2026-03-20",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/json-api-debug" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "JSON整形でAPIデバッグ" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          JSON整形ツールでAPIデバッグを効率化する方法
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月20日 ・ 読了時間: 約6分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          Web APIの開発やデバッグにおいて、JSONレスポンスの確認は最も頻繁に行う作業の一つです。
          しかし、APIから返ってくるJSONは圧縮（Minify）されていて読みにくいことがほとんどです。
          この記事では、JSON整形ツールを活用してAPIデバッグを効率化するテクニックを紹介します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">APIレスポンスが読みにくい理由</h2>
        <p className="text-muted-foreground leading-relaxed">
          APIサーバーはレスポンスのファイルサイズを小さくするため、JSONから改行・インデント・空白を除去して返します。
          例えば、ユーザー情報のAPIレスポンスは以下のようになります。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">圧縮されたJSON（APIの実際のレスポンス）:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto"><code>{`{"users":[{"id":1,"name":"田中太郎","email":"tanaka@example.com","address":{"prefecture":"東京都","city":"渋谷区"},"orders":[{"id":101,"total":3500},{"id":102,"total":12000}]}]}`}</code></pre>
          <p className="text-xs text-muted-foreground font-medium mb-2 mt-4">整形後（人間が読みやすい形式）:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto"><code>{`{
  "users": [
    {
      "id": 1,
      "name": "田中太郎",
      "email": "tanaka@example.com",
      "address": {
        "prefecture": "東京都",
        "city": "渋谷区"
      },
      "orders": [
        { "id": 101, "total": 3500 },
        { "id": 102, "total": 12000 }
      ]
    }
  ]
}`}</code></pre>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">よくあるJSONエラーとその原因</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">エラー</th>
                <th className="text-left py-2 pr-4">原因</th>
                <th className="text-left py-2">対処法</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">Unexpected token</td>
                <td className="py-2 pr-4">末尾カンマ or シングルクォート</td>
                <td className="py-2">末尾カンマを削除、ダブルクォートに変換</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">Unexpected end of JSON</td>
                <td className="py-2 pr-4">閉じ括弧の不足</td>
                <td className="py-2">括弧の対応を確認（JSON整形ツールが行番号を表示）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">Duplicate key</td>
                <td className="py-2 pr-4">同じキーが2回出現</td>
                <td className="py-2">重複キーを検出して片方を削除</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">Invalid escape</td>
                <td className="py-2 pr-4">文字列内のバックスラッシュ</td>
                <td className="py-2"><code>\</code> → <code>\\</code> にエスケープ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm mt-3">
          <Link href="/dev/json-formatter" className="text-primary hover:underline">
            tools24.jpのJSON整形ツール
          </Link>
          は、エラーの行番号と原因を日本語で表示するため、素早くエラー箇所を特定できます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">APIデバッグのワークフロー</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="font-semibold text-foreground">レスポンスを取得</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              ブラウザのDevToolsのNetworkタブ、Postman、curl などでAPIを呼び出し、レスポンスボディをコピーします。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-semibold text-foreground">JSON整形ツールに貼り付け</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              <Link href="/dev/json-formatter" className="text-primary hover:underline">JSON整形ツール</Link>
              に貼り付けると、自動的にインデント付きで整形されます。
              構文エラーがある場合はエラーの行番号と原因が表示されます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="font-semibold text-foreground">JSONPathで特定のデータを抽出</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              大きなJSONから特定のフィールドを探すには、JSONPathクエリが便利です。
              例えば <code>$.users[0].orders[*].total</code> で全注文の合計金額を一覧できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</span>
              <h3 className="font-semibold text-foreground">TypeScript型を自動生成</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              APIレスポンスのJSONからTypeScript interfaceを自動生成できます。
              手作業で型定義を書く手間が省け、APIの型安全性を素早く確保できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</span>
              <h3 className="font-semibold text-foreground">差分比較で変更点を確認</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              API変更前後のレスポンスを比較して、どのフィールドが追加・変更・削除されたかを確認できます。
              バージョンアップ時のAPI互換性チェックに役立ちます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">JSON vs 他のデータ形式</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">形式</th>
                <th className="text-left py-2 pr-4">可読性</th>
                <th className="text-left py-2 pr-4">サイズ</th>
                <th className="text-left py-2 pr-4">コメント</th>
                <th className="text-left py-2">主な用途</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">JSON</td>
                <td className="py-2 pr-4">普通</td>
                <td className="py-2 pr-4">中</td>
                <td className="py-2 pr-4">非対応</td>
                <td className="py-2">REST API・設定ファイル</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">YAML</td>
                <td className="py-2 pr-4">高い</td>
                <td className="py-2 pr-4">小</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2">CI/CD設定・Kubernetes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">XML</td>
                <td className="py-2 pr-4">低い</td>
                <td className="py-2 pr-4">大</td>
                <td className="py-2 pr-4">対応</td>
                <td className="py-2">SOAP API・レガシーシステム</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">Protocol Buffers</td>
                <td className="py-2 pr-4">バイナリ</td>
                <td className="py-2 pr-4">最小</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2">gRPC・高性能通信</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">まとめ</h2>
        <p className="text-muted-foreground leading-relaxed">
          JSON整形ツールは単なる「見やすくする」ためのツールではありません。
          バリデーション、JSONPath抽出、TypeScript型生成、差分比較など、
          APIデバッグのワークフロー全体を効率化できます。
          <Link href="/dev/json-formatter" className="text-primary hover:underline">
            tools24.jpのJSON整形ツール
          </Link>
          はブラウザ内完結でデータ送信なし。APIキーや個人情報を含むレスポンスも安心して整形できます。
        </p>
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/regex-beginners" className="text-primary hover:underline">正規表現の基本と実践テクニック</Link> — APIレスポンスの検索・抽出にも活用できる正規表現入門</li>
          <li><Link href="/guide/base64-guide" className="text-primary hover:underline">Base64エンコードとは？</Link> — JWT・API認証で使われるBase64の仕組み</li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateGuides['/guide/json-api-debug']} />
    </>
  );
}
