import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Heart, Gift, Briefcase, Shield, Zap, CircleDollarSign, ListChecks, Home, ListOrdered, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { DeadlineCountdown } from "@/components/tools/deadline-countdown";
import { FilingChecker } from "@/components/filing-checker";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const metadata: Metadata = {
  title: "確定申告かんたんツール集 — 無料で使える税金計算ツール | tools24.jp",
  description:
    "確定申告に必要な計算をブラウザだけで完結。所得税シミュレーター、医療費控除、ふるさと納税、副業の申告判定など9つのツールを無料提供。データ送信なし。",
  keywords: "確定申告, 税金計算, 所得税, 医療費控除, ふるさと納税, 無料ツール",
  alternates: { canonical: "/kakutei" },
};

const tools = [
  {
    title: "所得税シミュレーター",
    href: "/kakutei/income-tax",
    icon: Calculator,
    description: "給与・副業の所得税額をかんたん計算",
    badge: "人気",
    available: true,
  },
  {
    title: "医療費控除かんたん計算",
    href: "/kakutei/medical",
    icon: Heart,
    description: "医療費の合計から控除額を自動計算",
    badge: null,
    available: true,
  },
  {
    title: "ふるさと納税 控除上限",
    href: "/kakutei/furusato",
    icon: Gift,
    description: "年収から控除上限額の目安を算出",
    badge: null,
    available: true,
  },
  {
    title: "副業の確定申告ナビ",
    href: "/kakutei/side-job",
    icon: Briefcase,
    description: "副業収入の申告が必要か判定",
    badge: null,
    available: true,
  },
  {
    title: "生命保険料控除",
    href: "/kakutei/life-insurance",
    icon: Shield,
    description: "保険料から控除額を自動計算",
    badge: null,
    available: true,
  },
  {
    title: "住宅ローン控除",
    href: "/kakutei/housing-loan",
    icon: Home,
    description: "ローン残高から控除額を計算",
    badge: null,
    available: true,
  },
  {
    title: "ふるさと納税 管理",
    href: "/kakutei/furusato-tracker",
    icon: ListOrdered,
    description: "寄附先と金額を一覧管理",
    badge: null,
    available: true,
  },
  {
    title: "必要書類チェックリスト",
    href: "/kakutei/checklist",
    icon: ListChecks,
    description: "あなたに必要な書類を確認",
    badge: null,
    available: true,
  },
  {
    title: "e-Tax入力ガイド",
    href: "/kakutei/etax-guide",
    icon: FileText,
    description: "計算結果をまとめてe-Taxに転記",
    badge: "おすすめ",
    available: true,
  },
];

const faqs = [
  {
    question: "このツールは無料ですか？",
    answer: "はい、全機能を完全無料でお使いいただけます。回数制限やアカウント登録も不要です。",
  },
  {
    question: "データはサーバーに送信されますか？",
    answer:
      "いいえ、全ての計算はお使いのブラウザ内で処理されます。入力した収入額や控除額が外部に送信されることは一切ありません。ネットワークタブでご自身で検証いただけます。",
  },
  {
    question: "計算結果は正確ですか？",
    answer:
      "国税庁の公式情報に基づく概算値です。個々の状況により実際の税額は異なるため、正確な税額の算出には国税庁の確定申告書等作成コーナーまたは税理士への相談をお勧めします。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer:
      "はい、スマートフォン・タブレット・PCの全てに対応したレスポンシブデザインです。外出先でもすぐに計算できます。",
  },
  {
    question: "確定申告の期限はいつですか？",
    answer:
      "毎年2月16日から3月15日までが申告期間です（土日祝日の場合は翌営業日）。還付申告の場合は1月1日から5年間提出可能です。当サイトのツールで事前に概算を確認しておくと、申告期間中の手続きがスムーズに進みます。",
  },
  {
    question: "会社員でも確定申告は必要ですか？",
    answer:
      "通常は年末調整で完了しますが、医療費控除を受けたい場合、副業収入が年間20万円を超える場合、ふるさと納税でワンストップ特例を利用しない場合、年収2,000万円を超える場合などは確定申告が必要です。「副業の確定申告ナビ」で申告が必要か判定できます。",
  },
  {
    question: "計算結果を保存できますか？",
    answer:
      "ブラウザのローカルストレージに一時保存される仕組みです。同じブラウザで再アクセスすると前回の入力内容が復元されます。また「e-Tax入力ガイド」で全ツールの計算結果をまとめて確認・印刷できます。",
  },
  {
    question: "税制が変わった場合、ツールは更新されますか？",
    answer:
      "はい、毎年の税制改正に合わせて、所得税率・各種控除額・ふるさと納税の上限計算式などを国税庁の公式資料をもとに更新しています。最新の税制に対応した状態でご利用いただけます。",
  },
];

export default function KakuteiPage(): React.JSX.Element {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "確定申告ツール" },
        ]}
      />

      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          確定申告、もうこわくない。
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          必要な計算をブラウザだけで。登録不要・データ送信なし・完全無料。
        </p>
        <DeadlineCountdown />
      </section>

      {/* Filing Checker */}
      <FilingChecker />

      {/* Tool Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const content = (
              <Card
                className={`h-full transition-all ${
                  tool.available
                    ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    : "opacity-75"
                }`}
              >
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
                  {tool.available ? (
                    <p className="text-xs text-primary font-medium mt-3">
                      使ってみる →
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2">
                      近日公開予定
                    </p>
                  )}
                </CardContent>
              </Card>
            );

            return tool.available ? (
              <Link key={tool.title} href={tool.href}>
                {content}
              </Link>
            ) : (
              <div key={tool.title}>{content}</div>
            );
          })}
        </div>
      </section>

      {/* Security Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <Shield className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold">データ送信なし</h3>
            <p className="text-sm text-muted-foreground">
              全ての計算はブラウザ内で完結。入力データはサーバーに送信されません
            </p>
          </div>
          <div className="space-y-3">
            <Zap className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold">登録不要</h3>
            <p className="text-sm text-muted-foreground">
              アカウント作成なしですぐに使えます
            </p>
          </div>
          <div className="space-y-3">
            <CircleDollarSign className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold">完全無料</h3>
            <p className="text-sm text-muted-foreground">
              全機能を無料でお使いいただけます
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="mb-16 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">確定申告とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          確定申告とは、1年間（1月1日〜12月31日）の所得と税額を計算し、税務署に申告・納税する手続きです。
          会社員の方でも、医療費控除を受けたい場合、副業収入が年間20万円を超える場合、
          ふるさと納税でワンストップ特例を利用しない場合などは確定申告が必要です。
          申告期間は毎年2月16日から3月15日まで（土日の場合は翌月曜日）。
          当サイトでは、確定申告に必要な各種計算をブラウザ上で簡単に行えるツールを無料で提供しています。
          事前に概算を確認することで、スムーズな申告準備にお役立てください。
        </p>

        <h3 className="text-xl font-semibold mt-6">確定申告が必要な人</h3>
        <p className="text-muted-foreground leading-relaxed">
          確定申告が必要なのは、主に以下のケースです。
          個人事業主・フリーランスの方、副業収入が年間20万円を超える会社員の方、年収2,000万円を超える方、
          2か所以上から給与を受けている方、退職金を受け取った方（源泉分離課税が適用されない場合）。
          また、義務ではなくても医療費控除やふるさと納税の寄附金控除を受けたい方、住宅ローン控除を初めて適用する方は確定申告が必要です。
        </p>

        <h3 className="text-xl font-semibold mt-6">確定申告の流れ</h3>
        <p className="text-muted-foreground leading-relaxed">
          まず源泉徴収票や控除証明書などの必要書類を集めます。
          次に申告書を作成します。手書きの用紙・国税庁の「確定申告書等作成コーナー」（e-Tax）・市販の確定申告ソフトのいずれかを使います。
          申告書が完成したら、税務署への持参・郵送・e-Taxでの電子提出のいずれかで提出します。
          還付がある場合は申告後1〜2ヶ月（e-Taxなら約3週間）で指定口座に振り込まれます。
          追加納税がある場合は3月15日までに納付が必要です。振替納税やクレジットカード納付も利用できます。
        </p>

        <h3 className="text-xl font-semibold mt-6">当サイトの使い方</h3>
        <p className="text-muted-foreground leading-relaxed">
          当サイトの各ツールは、確定申告の事前準備を効率化するために作られています。
          まず「所得税シミュレーター」で大まかな税額を把握し、「医療費控除」「ふるさと納税」「生命保険料控除」「住宅ローン控除」で
          各控除額を計算します。「必要書類チェックリスト」であなたに必要な書類を確認し、全ての計算結果は「e-Tax入力ガイド」でまとめて確認できます。
          全ての計算はブラウザ内で完結し、入力データがサーバーに送信されることは一切ありません。安心してご利用ください。
        </p>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Ad Placeholder */}
      <AdPlaceholder position="content" className="mt-12" />
    </>
  );
}
