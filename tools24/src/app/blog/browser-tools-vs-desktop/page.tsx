import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "ブラウザ完結ツール vs デスクトップアプリ——個人開発者が「ブラウザ完結」を選ぶ理由",
  description:
    "ブラウザ完結型ツールとデスクトップアプリの違いを、メリット・デメリット・技術的ポイントの観点から解説。tools24.jpが全ツールをブラウザ完結で作っている理由とは。",
  alternates: { canonical: "/blog/browser-tools-vs-desktop" },
};

const faqs = [
  {
    question: "ブラウザ完結ツールではどのくらいのファイルサイズまで扱えますか？",
    answer:
      "ブラウザのメモリ制約により、一般的には100MB〜500MB程度が実用的な上限です。Web Workersを活用すればメインスレッドをブロックせず処理できますが、数GBのファイルにはデスクトップアプリが適しています。",
  },
  {
    question: "ブラウザ完結ツールはオフラインでも使えますか？",
    answer:
      "Service WorkerとPWA（Progressive Web App）技術を使えば、一度アクセスした後はオフラインでも動作させることが可能です。tools24.jpのツールもPWA対応を順次進めています。",
  },
  {
    question: "データがサーバーに送信されないのは本当ですか？",
    answer:
      "ブラウザ完結型のツールでは、JavaScript（Web Workers含む）がユーザーの端末上で直接処理を行います。ネットワーク通信は発生しないため、ファイルの内容がサーバーに送信されることはありません。",
  },
];

export default function BrowserToolsVsDesktopPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "ブラウザ完結ツール vs デスクトップアプリ——個人開発者が「ブラウザ完結」を選ぶ理由",
            description:
              "ブラウザ完結型ツールとデスクトップアプリの違いを、メリット・デメリット・技術的ポイントの観点から解説。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/blog/browser-tools-vs-desktop" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ノート", href: "/blog" },
          { label: "ブラウザ完結ツール vs デスクトップ" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          ブラウザ完結ツール vs デスクトップアプリ——個人開発者が「ブラウザ完結」を選ぶ理由
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          公開日: 2026年3月29日 ・ 読了時間: 約6分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          ちょっとした画像変換、文字数カウント、JSON整形——こうした「小さなユーティリティ」を作るとき、
          デスクトップアプリにするかブラウザで動くWebアプリにするかは、個人開発者にとって最初の分岐点です。
          tools24.jpでは全24本のツールをブラウザ完結型で開発しています。
          この記事では、その判断に至った理由と、ブラウザ完結型のメリット・デメリットを具体的に解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          tools24.jpが全ツールをブラウザ完結で作っている理由
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          tools24.jpのコンセプトは「開いた瞬間に使える」こと。
          確定申告の計算ツールから画像変換、開発者向けユーティリティまで、
          すべてのツールがブラウザだけで完結するように設計されています。
          ユーザーにとってはインストール不要・会員登録不要ですぐに使い始められ、
          開発者にとってはクロスプラットフォーム対応のコストがゼロになるという大きなメリットがあります。
          個人開発ではリソースが限られるため、Windows・Mac・Linux向けにそれぞれビルドを用意する余裕はありません。
          ブラウザという「共通プラットフォーム」に絞ることで、開発と保守の負担を最小限に抑えています。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ブラウザ完結のメリット
        </h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">インストール不要</h3>
            <p className="text-muted-foreground text-sm mt-1">
              URLにアクセスするだけで即座に利用開始。ダウンロード待ちもインストーラーの実行も不要です。
              ユーザーの離脱率を大幅に下げる最大のメリットです。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">OS非依存</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Windows、Mac、Linux、スマートフォン——モダンブラウザが動く環境ならどこでも同じように使えます。
              Electronのように各OSごとにビルドを分ける必要がありません。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">データがサーバーに送信されない</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JavaScriptでクライアントサイド処理を行うため、ファイルの内容がネットワークを流れることがありません。
              プライバシーを重視するユーザーにとって大きな安心材料です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">PWA対応が可能</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Service Workerを実装すれば、ホーム画面に追加してネイティブアプリのように利用可能。
              オフラインキャッシュにも対応できます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ブラウザ完結のデメリット
        </h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">大容量ファイル処理のメモリ制約</strong> —
            ブラウザのタブに割り当てられるメモリには上限があり、数百MB以上のファイルを扱う場合はパフォーマンスが低下します。
            動画編集や大規模データ処理にはデスクトップアプリが向いています。
          </li>
          <li>
            <strong className="text-foreground">OS APIへのアクセス制限</strong> —
            ファイルシステムへの直接アクセス、システム通知、ハードウェア制御など、OSネイティブの機能は利用できないか制限付きです。
            File System Access APIの普及で改善傾向にありますが、まだ全ブラウザ対応ではありません。
          </li>
          <li>
            <strong className="text-foreground">ブラウザ間の互換性</strong> —
            特にSafariとChrome/Firefoxで挙動が異なるケースがあります。
            Canvas APIの描画結果やWeb Workerの挙動など、テストの手間が増える部分があります。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          技術的なポイント — Web Workers / File API / Canvas API の活用
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          ブラウザ完結型ツールを快適に動作させるには、いくつかのWeb APIを適切に組み合わせることが重要です。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-4">
          <li>
            <strong className="text-foreground">Web Workers</strong> —
            重い計算処理をメインスレッドから分離し、UIがフリーズしないようにします。
            画像変換やCSVパースなど、数秒以上かかる処理では必須の技術です。
          </li>
          <li>
            <strong className="text-foreground">File API / Blob</strong> —
            ユーザーがドラッグ&ドロップしたファイルをメモリ上で読み込み、加工後にダウンロードリンクとして提供します。
            サーバーを経由しないファイル処理の基盤となる技術です。
          </li>
          <li>
            <strong className="text-foreground">Canvas API</strong> —
            画像のリサイズ、フォーマット変換、テキスト描画などに使用します。
            WebP変換ツールでは、Canvas APIの<code>toBlob()</code>メソッドでフォーマット変換を実現しています。
          </li>
          <li>
            <strong className="text-foreground">Wasm（WebAssembly）</strong> —
            ネイティブに近い速度が必要な場合の選択肢。画像処理ライブラリやエンコーダーをWasmで動かすことで、
            ブラウザ内でもデスクトップアプリに匹敵するパフォーマンスを実現できます。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          結論: 「ちょっとした変換・計算」はブラウザ完結が最適解
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          大規模なファイル処理やOS連携が必要な場面ではデスクトップアプリに軍配が上がりますが、
          「ちょっとした変換・計算・整形」といった日常的なユーティリティは、ブラウザ完結型が最適解です。
          インストール不要・クロスプラットフォーム・プライバシー安全という3つのメリットは、
          特に個人開発者が少ないリソースで最大のユーザー体験を提供するうえで非常に強力です。
          tools24.jpでは、この方針のもとで今後もブラウザ完結型のツールを増やしていく予定です。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連記事</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/blog/tools24-dev-story" className="text-primary hover:underline">tools24.jp開発ストーリー——24本のツールを個人で作って学んだこと</Link></li>
          <li><Link href="/guide/webp-seo" className="text-primary hover:underline">WebP画像でサイト速度とSEOを改善する方法</Link></li>
          <li><Link href="/guide/json-api-debug" className="text-primary hover:underline">JSON整形ツールでAPIデバッグを効率化する方法</Link></li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
