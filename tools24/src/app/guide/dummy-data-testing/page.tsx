import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "テスト用ダミーデータの作り方——開発効率を上げる日本語テストデータ活用術",
  description:
    "テスト用ダミーデータの必要性、良いダミーデータの条件、日本語対応の難しさ、テストシナリオ別の設計方法を解説。個人情報保護法の観点からも本番データの使用リスクを説明。",
  alternates: { canonical: "/guide/dummy-data-testing" },
};

const faqs = [
  {
    question: "本番データをテストに使ってはいけない理由は？",
    answer:
      "個人情報保護法により、本番の顧客データを開発・テスト環境で利用するには本人の同意が必要です。また、データ漏洩のリスクが高まり、万が一の事故で企業の信頼を大きく損ないます。ダミーデータを使えばこれらのリスクを回避できます。",
  },
  {
    question: "ダミーデータはどのくらいの量を用意すべきですか？",
    answer:
      "テストの目的によります。UIモック用なら10〜50件程度、E2Eテストなら100〜500件、負荷テストなら数万〜数十万件が目安です。tools24.jpのダミーデータ生成ツールでは最大1,000件まで一括生成できます。",
  },
  {
    question: "生成したダミーデータが実在の人物と一致するリスクは？",
    answer:
      "姓名はランダムに組み合わせるため、偶然一致する可能性はゼロではありませんが、住所・電話番号・メールアドレスも含めて全てが一致する確率は極めて低いです。念のため、テストデータである旨をチーム内で共有しておくと安心です。",
  },
  {
    question: "CSVとJSON、どちらの形式で出力すべきですか？",
    answer:
      "データベースへのインポートやExcelでの確認にはCSV形式、APIのモックレスポンスやフロントエンドの開発にはJSON形式が適しています。tools24.jpでは両方の形式で出力できます。",
  },
  {
    question: "ダミーデータにバリデーションエラーになるデータも含めるべき？",
    answer:
      "はい、異常系のテストには不正なデータ（空文字列、桁数超過、不正なメールアドレスなど）も含めるべきです。正常データだけでは、バリデーションロジックの抜け漏れを発見できません。",
  },
];

export default function DummyDataTestingPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "テスト用ダミーデータの作り方——開発効率を上げる日本語テストデータ活用術",
            description:
              "テスト用ダミーデータの必要性、良いダミーデータの条件、日本語対応の難しさ、テストシナリオ別の設計方法を解説。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/dummy-data-testing" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "ダミーデータ活用" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          テスト用ダミーデータの作り方——開発効率を上げる日本語テストデータ活用術
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月29日 ・ 読了時間: 約6分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          ソフトウェア開発において、テスト用データの準備は避けて通れない工程です。
          しかし、本番データをそのまま使うことは個人情報保護の観点からリスクが大きく、
          かといって手作業でデータを作るのは非効率です。
          この記事では、良質なダミーデータの条件と、日本語テストデータの効率的な活用方法を解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">なぜダミーデータが必要か — 本番データを使うリスク</h2>
        <p className="text-muted-foreground leading-relaxed">
          開発やテストで本番データ（顧客の氏名・住所・電話番号など）を使用することには、
          複数のリスクが伴います。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-3">
          <li>
            <strong className="text-foreground">個人情報保護法への違反</strong> — 本番の顧客データを開発環境に持ち込むことは、
            目的外利用に該当する可能性があります。2022年の改正で罰則も強化されています。
          </li>
          <li>
            <strong className="text-foreground">データ漏洩リスク</strong> — 開発環境は本番ほどセキュリティが厳格でないことが多く、
            ログやスクリーンショットから個人情報が流出するリスクがあります。
          </li>
          <li>
            <strong className="text-foreground">テストの再現性の低下</strong> — 本番データは時間とともに変化するため、
            同じテストを再実行しても結果が異なることがあります。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">良いダミーデータの条件</h2>
        <p className="text-muted-foreground leading-relaxed">
          単にランダムな文字列を生成するだけでは、実用的なテストデータにはなりません。
          良質なダミーデータには以下の条件が求められます。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-3">
          <li>
            <strong className="text-foreground">本番に近い形式</strong> — 電話番号なら「090-XXXX-XXXX」、
            郵便番号なら「XXX-XXXX」のように、実際のフォーマットに合致していること。
          </li>
          <li>
            <strong className="text-foreground">日本語対応</strong> — 英語のダミーデータでは、
            全角・半角の混在、文字化け、表示幅などの問題を検出できません。
          </li>
          <li>
            <strong className="text-foreground">大量生成が可能</strong> — 数件の手作りデータでは負荷テストやページネーションのテストに不十分です。
          </li>
          <li>
            <strong className="text-foreground">再現性</strong> — シード値を指定することで、同じデータセットを再生成できること。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">代表的なダミーデータの種類</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">データ種類</th>
                <th className="text-left py-2 pr-4">形式例</th>
                <th className="text-left py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">氏名</td>
                <td className="py-2 pr-4">山田 太郎</td>
                <td className="py-2">ユーザー登録・表示テスト</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">住所</td>
                <td className="py-2 pr-4">東京都渋谷区神宮前1-2-3</td>
                <td className="py-2">配送・フォーム入力テスト</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">電話番号</td>
                <td className="py-2 pr-4">090-1234-5678</td>
                <td className="py-2">バリデーション・SMS連携テスト</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">メールアドレス</td>
                <td className="py-2 pr-4">taro.yamada@example.com</td>
                <td className="py-2">認証・通知テスト</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">会社名</td>
                <td className="py-2 pr-4">株式会社サンプルテック</td>
                <td className="py-2">B2B機能テスト</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">日付</td>
                <td className="py-2 pr-4">2026-03-29</td>
                <td className="py-2">予約・期限管理テスト</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">金額</td>
                <td className="py-2 pr-4">¥12,800</td>
                <td className="py-2">決済・帳票テスト</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">日本語ダミーデータの難しさ</h2>
        <p className="text-muted-foreground leading-relaxed">
          英語圏のダミーデータライブラリ（Faker.jsなど）は充実していますが、
          日本語のダミーデータには独特の課題があります。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside mt-3">
          <li>
            <strong className="text-foreground">姓名の組み合わせ</strong> — 日本語の氏名は「姓＋名」の組み合わせが自然であることが重要です。
            「鈴木 ジョン」のような不自然な組み合わせではテストの信頼性が下がります。
          </li>
          <li>
            <strong className="text-foreground">住所の階層構造</strong> — 日本の住所は「都道府県→市区町村→町名→番地→建物名」という
            多段階の構造を持ちます。ランダム生成では「東京都大阪市」のような矛盾が生じやすいです。
          </li>
          <li>
            <strong className="text-foreground">電話番号のフォーマット</strong> — 携帯（090/080/070）、固定（03/06など）、
            フリーダイヤル（0120）で桁数やハイフン位置が異なります。
          </li>
          <li>
            <strong className="text-foreground">全角・半角の混在</strong> — 数字やカタカナの全角・半角が混在すると、
            バリデーションやソート結果に影響します。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">テストシナリオ別のデータ設計</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">E2Eテスト用</h3>
            <p className="text-muted-foreground text-sm">
              ユーザー登録→ログイン→商品購入→配送先入力の一連のフローをテストするには、
              現実的なデータセットが必要です。氏名・住所・メールアドレス・電話番号を
              セットで生成し、各フィールドの整合性を保つことが重要です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">負荷テスト用</h3>
            <p className="text-muted-foreground text-sm">
              数千〜数万件のデータを一括登録し、レスポンスタイムやスループットを測定します。
              データの多様性（文字列長のバリエーション、NULLの混入率など）が重要で、
              全て同じパターンのデータでは本番の負荷を正確に再現できません。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">UIモック用</h3>
            <p className="text-muted-foreground text-sm">
              デザインレビューやプロトタイプ開発では、見た目が自然なデータが求められます。
              長い氏名や住所によるレイアウト崩れの検出も、モックデータの重要な役割です。
              10〜50件程度のデータで十分な場合が多いです。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jpのダミーデータ生成で作成</h2>
        <p className="text-muted-foreground leading-relaxed">
          日本語に対応したダミーデータを手軽に生成したい場合は、
          <Link href="/dev/dummy-data-generator" className="text-primary hover:underline">
            tools24.jpのダミーデータ生成ツール
          </Link>
          をご利用ください。氏名・住所・電話番号・メールアドレスなど、
          日本語に最適化されたデータをCSVやJSON形式で一括生成できます。
          ブラウザ内で処理するため、データがサーバーに送信されることはありません。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <Link href="/guide/base64-guide" className="text-primary hover:underline">
              Base64エンコードとは？仕組み・用途・変換方法をわかりやすく解説
            </Link>
          </li>
          <li>
            <Link href="/guide/cron-guide" className="text-primary hover:underline">
              cron式の書き方ガイド
            </Link>
          </li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
