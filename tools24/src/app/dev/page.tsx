import type { Metadata } from "next";
import Link from "next/link";
import { Braces, TextCursorInput, Dices, Clock, CalendarRange, ArrowLeftRight, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const metadata: Metadata = {
  title: "開発者ツール — JSON整形・正規表現・ダミーデータ生成など | tools24.jp",
  description:
    "ブラウザだけで使える無料の開発者向けツール集。JSON整形・正規表現テスター・ダミーデータ生成・Cron式ビルダー・和暦変換・エンコードデコードなど。登録不要・データ送信なし。",
  keywords: "開発者ツール, JSON整形, 正規表現, ダミーデータ, Cron, 和暦変換, エンコード",
  alternates: { canonical: "/dev" },
};

const tools = [
  {
    title: "JSON整形ツール",
    href: "/dev/json-formatter",
    icon: Braces,
    description: "JSON の整形・検証・変換・差分比較をブラウザで完結",
    badge: "人気",
  },
  {
    title: "正規表現テスター",
    href: "/dev/regex-tester",
    icon: TextCursorInput,
    description: "正規表現のリアルタイムテスト・マッチ確認・置換プレビュー",
    badge: null,
  },
  {
    title: "ダミーデータ生成",
    href: "/dev/dummy-data-generator",
    icon: Dices,
    description: "22種のフィールドで日本語ダミーデータを一括生成",
    badge: null,
  },
  {
    title: "Cron式ビルダー",
    href: "/dev/cron-expression-builder",
    icon: Clock,
    description: "Cron式を直感的に組み立て、次回実行時刻を確認",
    badge: null,
  },
  {
    title: "和暦・西暦変換",
    href: "/dev/wareki-converter",
    icon: CalendarRange,
    description: "和暦⇔西暦・UNIX時間・ISO8601 を相互変換",
    badge: null,
  },
  {
    title: "エンコード・デコード",
    href: "/dev/encode-decode",
    icon: ArrowLeftRight,
    description: "Base64・URL・JWT・ハッシュ・Unicode を一括変換",
    badge: null,
  },
  {
    title: "個人情報マスキング",
    href: "/dev/data-masking",
    icon: Shield,
    description: "テキスト中の氏名・電話番号・メールなどを自動検出してマスキング",
    badge: null,
  },
];

const faqs = [
  {
    question: "全て無料で使えますか？",
    answer: "はい、全ツールを完全無料でご利用いただけます。回数制限もありません。",
  },
  {
    question: "データはサーバーに送信されますか？",
    answer:
      "いいえ、全ての処理はブラウザ内で完結します。入力データが外部に送信されることは一切ありません。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer:
      "はい、スマートフォン・タブレット・PCの全デバイスに対応しています。",
  },
  {
    question: "ユーザー登録やログインは必要ですか？",
    answer:
      "いいえ、全てのツールを登録不要・ログイン不要でご利用いただけます。アクセスしてすぐに使い始められます。",
  },
  {
    question: "処理できるデータ量に制限はありますか？",
    answer:
      "ブラウザのメモリに依存しますが、通常の用途（数MB程度のJSON、数千行のテキスト）であれば問題なく処理できます。非常に大きなファイルの場合はブラウザのパフォーマンスに影響する可能性があります。",
  },
  {
    question: "Chrome以外のブラウザでも動作しますか？",
    answer:
      "はい、Chrome、Firefox、Safari、Edgeなど主要なモダンブラウザ全てに対応しています。最新版のブラウザでのご利用を推奨します。",
  },
  {
    question: "オフラインでも使えますか？",
    answer:
      "初回アクセス時にはインターネット接続が必要ですが、ページの読み込み後はオフラインでも基本的な機能をご利用いただけます。全ての処理はブラウザ内で実行されるためです。",
  },
  {
    question: "バグ報告や機能リクエストはできますか？",
    answer:
      "ご意見・ご要望はお問い合わせページからお送りください。ユーザーの皆様のフィードバックをもとにツールの改善を進めています。",
  },
];

export default function DevToolsPage(): React.JSX.Element {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ツール" },
        ]}
      />

      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          開発者ツール
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          登録不要・データ送信なし・ブラウザだけで完結
        </p>
      </section>

      {/* Tool Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.title} href={tool.href}>
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      {tool.badge && (
                        <Badge variant="secondary">{tool.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <p className="text-xs text-primary font-medium mt-3">
                      使ってみる →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 教育コンテンツ */}
      <section className="mb-16 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">開発者ツールとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          開発者ツール（Developer Tools）とは、ソフトウェア開発の作業を効率化するためのユーティリティの総称です。
          特にブラウザベースの開発者ツールは、インストール不要で即座に利用できる手軽さから、近年多くのエンジニアに支持されています。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          従来、JSONの整形や正規表現のテスト、エンコード変換といった作業には、
          専用のデスクトップアプリケーションやコマンドラインツールが必要でした。
          しかし、ブラウザの処理能力が大幅に向上した現在では、これらの作業をWebアプリケーションとして実行できます。
          社内のセキュリティポリシーでソフトウェアのインストールが制限されている環境でも、
          ブラウザさえあれば即座に利用を開始できる点は大きなメリットです。
          また、OSやデバイスを問わず同じUIで操作できるため、チーム内での共有やリモートワーク環境でも活用しやすいのが特徴です。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">tools24.jp の開発者ツールの特徴</h2>
        <p className="text-muted-foreground leading-relaxed">
          tools24.jp の開発者ツールには、他のオンラインツールにはない3つの明確な特徴があります。
        </p>
        <ul className="text-muted-foreground leading-relaxed mt-3 space-y-3 list-disc list-inside">
          <li>
            <strong className="text-foreground">完全ローカル処理 — データはサーバーに一切送信されません</strong>
            <br />
            <span className="ml-6 inline-block mt-1">
              全ての処理はブラウザのJavaScriptエンジン内で完結します。
              APIキー、個人情報、社内データなど機密性の高い情報を含むJSONやテキストも、安心して処理できます。
              ネットワークタブを確認していただければ、外部へのデータ送信が発生しないことをご自身で検証可能です。
            </span>
          </li>
          <li>
            <strong className="text-foreground">高速なレスポンス — サーバー通信なしで瞬時に結果表示</strong>
            <br />
            <span className="ml-6 inline-block mt-1">
              サーバーサイドの処理を待つ必要がないため、入力と同時に結果が表示されます。
              大量のデータ変換や複雑な正規表現のテストでも、ストレスなく作業を進められます。
            </span>
          </li>
          <li>
            <strong className="text-foreground">日本語UIと日本向け機能</strong>
            <br />
            <span className="ml-6 inline-block mt-1">
              全てのUIテキスト・エラーメッセージが日本語で表示されます。
              和暦・西暦変換ツールや、日本語の氏名・住所を含むダミーデータ生成など、
              日本の開発現場で特に必要とされる機能を重点的に提供しています。
            </span>
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">ユースケース別おすすめツール</h2>
        <p className="text-muted-foreground leading-relaxed">
          開発業務のシーンに応じて、最適なツールを選んでご活用ください。
        </p>
        <div className="mt-4 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">APIの開発・デバッグをしているとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>JSON整形ツール</strong>をお使いください。レスポンスの整形・バリデーション・TypeScript型生成・差分比較まで一貫して対応。
              APIテスト中のレスポンス確認作業が大幅に効率化されます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">入力フォームのバリデーションを実装しているとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>正規表現テスター</strong>で、メールアドレス・電話番号・郵便番号などのパターンをリアルタイムに検証できます。
              マッチ結果のハイライト表示と置換プレビューで、本番実装前に正規表現の正確性を確認できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">テストデータや画面モックが必要なとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>ダミーデータ生成</strong>で、日本語の氏名・住所・電話番号・メールアドレスなど22種のフィールドを組み合わせて
              リアルなテストデータを一括生成。CSV・JSON・SQL形式で出力できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">定期実行タスクのスケジュールを設定するとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>Cron式ビルダー</strong>でCron式をGUIで直感的に組み立てられます。
              次回の実行時刻一覧も表示されるので、意図した通りのスケジュールになっているか即座に確認可能です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">日本の日付や元号を扱うシステムを開発しているとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>和暦・西暦変換</strong>で令和・平成・昭和などの和暦とグレゴリオ暦を瞬時に相互変換。
              UNIX時間やISO8601形式への変換にも対応しており、日付処理のデバッグに最適です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">文字列のエンコード・デコードが必要なとき</h3>
            <p className="text-muted-foreground text-sm mt-1">
              → <strong>エンコード・デコード</strong>でBase64、URLエンコード、JWT解析、各種ハッシュ生成、Unicode変換など、
              日常的に必要になるエンコード処理をまとめて実行できます。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Ad Placeholder */}
      <AdPlaceholder position="content" className="mt-12" />
    </>
  );
}
