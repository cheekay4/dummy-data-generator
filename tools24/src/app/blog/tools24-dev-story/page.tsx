import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "tools24.jp開発ストーリー——24本のツールを個人で作って学んだこと",
  description:
    "tools24.jpの開発経緯、技術スタック選定の理由、24本のツールを個人で作る中で得た設計判断と学びを共有します。",
  alternates: { canonical: "/blog/tools24-dev-story" },
};

const faqs = [
  {
    question: "tools24.jpのツールは本当に全て1人で開発していますか？",
    answer:
      "はい、企画・設計・実装・デプロイまで1人で行っています。Claude CodeなどのAIツールを積極的に活用することで、個人でも24本のツールを現実的な期間で開発・運用できています。",
  },
  {
    question: "使用している技術スタックを教えてください",
    answer:
      "Next.js（App Router）、TypeScript、Tailwind CSS、Vercelをメインスタックとしています。UIコンポーネントにはshadcn/uiを採用し、一貫したデザインシステムを構築しています。",
  },
  {
    question: "新しいツールのアイデアはどこから来ますか？",
    answer:
      "自分自身が「これ、ちょっとした計算や変換をしたいのに、良いツールがないな」と感じた場面がきっかけになることがほとんどです。確定申告の計算ツールも、まさに自分の確定申告がきっかけでした。",
  },
];

export default function Tools24DevStoryPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "tools24.jp開発ストーリー——24本のツールを個人で作って学んだこと",
            description:
              "tools24.jpの開発経緯、技術スタック選定の理由、個人開発で得た設計判断と学びを共有。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/blog/tools24-dev-story" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ノート", href: "/blog" },
          { label: "開発ストーリー" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          tools24.jp開発ストーリー——24本のツールを個人で作って学んだこと
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          公開日: 2026年3月29日 ・ 読了時間: 約7分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          tools24.jpは、「自分が使いたいツールを自分で作る」という動機から始まった個人開発プロジェクトです。
          確定申告の計算ツール1本からスタートし、現在では24本のWebツールを公開しています。
          この記事では、開発の経緯や技術選定の理由、ツールが増えていく中での設計判断について振り返ります。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          tools24.jpを作り始めた経緯 — 確定申告の計算を自分でやりたかった
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          きっかけは、自分の確定申告の所得税を事前に試算したかったことでした。
          既存のWebツールもいくつかありましたが、広告が多すぎたり、入力項目が複雑だったり、
          計算ロジックが不透明だったりと、満足できるものがありませんでした。
          「シンプルで、計算過程が見えて、広告が少ないツールが欲しい」——そう思って作ったのが最初の所得税シミュレーターです。
          自分用に作ったツールをデプロイして公開したところ、
          思った以上にアクセスがあり、他の計算ツールも作ってみようという気持ちになりました。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          技術スタック選定の理由 — Next.js / TypeScript / Tailwind CSS / Vercel
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          技術スタックは「個人開発で最も生産性が高い組み合わせ」を基準に選びました。
        </p>
        <div className="space-y-4 not-prose mt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Next.js（App Router）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              ファイルベースルーティング、SSG/SSRの柔軟な切り替え、画像最適化、SEOメタデータの管理など、
              ツール系サイトに必要な機能がフレームワークに組み込まれています。
              ツールごとにページを追加するだけでルーティングが自動設定されるのは大きなメリットです。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">TypeScript</h3>
            <p className="text-muted-foreground text-sm mt-1">
              計算ツールでは型安全性が特に重要です。数値を文字列として扱ってしまうバグは、
              TypeScriptの型チェックで未然に防げます。24本のツールを1人で保守する上で、
              型による自己文書化の効果は非常に大きいです。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Tailwind CSS</h3>
            <p className="text-muted-foreground text-sm mt-1">
              ユーティリティファーストのCSSフレームワーク。デザイナーなしの個人開発でも、
              一貫したデザインシステムを維持できます。shadcn/uiとの組み合わせで、
              アクセシブルなUIコンポーネントを素早く構築できるのも強みです。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Vercel</h3>
            <p className="text-muted-foreground text-sm mt-1">
              GitHubにプッシュするだけで自動デプロイ。プレビュー環境、カスタムドメイン、CDN、
              エッジ関数まで無料枠で利用でき、個人開発には最適なホスティングです。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          最初のツール（所得税シミュレーター）で学んだこと
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          最初の所得税シミュレーターを作る中で、いくつかの重要な学びがありました。
          まず、税金の計算ロジックは見た目以上に複雑だということ。累進課税の税率テーブル、
          各種控除の適用条件、復興特別所得税の計算など、正確に実装するには国税庁の資料を何度も読み返す必要がありました。
          次に、計算過程の可視化がユーザー体験を大きく左右すること。
          単に最終的な税額を表示するだけでなく、「なぜこの金額になるのか」をステップごとに表示することで、
          ユーザーからの信頼度が格段に上がりました。
          この「計算過程を見せる」というアプローチは、tools24.jpの全ツールに共通する設計原則になっています。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          6本→12本→24本と増えていく中での設計判断
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          ツールが増えるにつれて、以下の設計判断が重要になりました。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-4">
          <li>
            <strong className="text-foreground">共通コンポーネントの抽出</strong> —
            ツールカード、パンくずリスト、FAQ、広告枠、SEOメタデータなど、
            繰り返し使うUIパターンを共通コンポーネントとして切り出しました。
            新しいツールを追加する際のコード量を大幅に削減できています。
          </li>
          <li>
            <strong className="text-foreground">SEOテキストのパターン化</strong> —
            メタデータ（title/description）、構造化データ（JSON-LD）、パンくずリストの構成を
            テンプレート化することで、SEO品質のばらつきを防いでいます。
          </li>
          <li>
            <strong className="text-foreground">パフォーマンスの最適化</strong> —
            すべてのツールページをStatic Generation（SSG）で配信し、
            インタラクティブな計算部分だけをClient Componentにすることで、
            初期表示速度を最大化しています。
          </li>
          <li>
            <strong className="text-foreground">モノレポ構成への移行</strong> —
            確定申告ツール、開発者ツール、マスキングツールなど、テーマごとにサブプロジェクトを分けつつ、
            1つのリポジトリで管理するモノレポ構成を採用。デプロイ先も分離しつつ、共通設定を一元管理できます。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          個人開発のメリット — スピード感・ユーザーの声に即対応
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          個人開発の最大のメリットは意思決定の速さです。
          「このツールがあったら便利そうだ」と思ったら、その日のうちにプロトタイプを作って翌日にはデプロイできます。
          ユーザーからフィードバックをもらったら、その場で修正して数分後には本番環境に反映可能です。
          チーム開発のように、仕様書の作成、レビュー、承認プロセスを経る必要がありません。
          もちろんコードレビューがないことはリスクでもありますが、
          TypeScriptの型チェック、ESLintの静的解析、そしてAIによるコードレビューを組み合わせることで、
          品質を維持しながらスピードを落とさない開発フローを実現しています。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          結論: 「自分が使いたいツールを作る」が最良の動機
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          24本のツールを作ってきて確信したのは、「自分が使いたいものを作る」ことが最も持続可能な開発動機だということです。
          自分がユーザーなので、何が不便で何が必要かを肌感覚で理解できます。
          開発のモチベーションが下がることもありません。
          tools24.jpはこれからも「自分が欲しいと思ったツール」を追加し続けていきます。
          もし便利だと感じたツールがあれば、ぜひ日常の業務で使ってみてください。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連記事</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/blog/browser-tools-vs-desktop" className="text-primary hover:underline">ブラウザ完結ツール vs デスクトップアプリ——個人開発者が「ブラウザ完結」を選ぶ理由</Link></li>
          <li><Link href="/guide/json-api-debug" className="text-primary hover:underline">JSON整形ツールでAPIデバッグを効率化する方法</Link></li>
          <li><Link href="/about" className="text-primary hover:underline">tools24.jpについて</Link></li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
