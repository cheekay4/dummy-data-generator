import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import {
  Shield,
  MonitorSmartphone,
  RefreshCw,
  UserCheck,
  Mail,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "tools24.jpについて",
  description:
    "tools24.jpは確定申告・税金計算ツールとWeb便利ツールを無料で提供する個人運営サイトです。ブラウザ完結・登録不要・データ送信なしで安心してご利用いただけます。",
  alternates: { canonical: "/about" },
};

const KAKUTEI_TOOLS = [
  { label: "所得税シミュレーター", href: "/kakutei/income-tax" },
  { label: "医療費控除かんたん計算", href: "/kakutei/medical" },
  { label: "ふるさと納税 控除上限シミュレーター", href: "/kakutei/furusato" },
  { label: "副業の確定申告ナビ", href: "/kakutei/side-job" },
  { label: "生命保険料控除かんたん計算", href: "/kakutei/life-insurance" },
  { label: "住宅ローン控除シミュレーター", href: "/kakutei/housing-loan" },
  { label: "ふるさと納税 寄附管理トラッカー", href: "/kakutei/furusato-tracker" },
  { label: "必要書類チェックリスト", href: "/kakutei/checklist" },
  { label: "e-Tax入力ガイド", href: "/kakutei/etax-guide" },
];

const WEB_TOOLS = [
  { label: "文字化け修正ツール", href: "/mojibake-fixer" },
  { label: "ファビコン一括生成", href: "/favicon-generator" },
  { label: "電子印鑑作成ツール", href: "/digital-stamp" },
  { label: "WebP変換ツール", href: "/webp-converter" },
  { label: "HTML/CSS/JS 圧縮", href: "/minify-tools" },
  { label: "全角・半角変換", href: "/zenkaku-hankaku" },
];

const PRINCIPLES = [
  {
    icon: Shield,
    title: "ブラウザ完結（データ送信なし）",
    description:
      "すべての計算処理はお使いのブラウザ内で完結します。入力された収入額や控除額などの個人情報がサーバーに送信されることは一切ありません。安心してお使いください。",
  },
  {
    icon: UserCheck,
    title: "登録不要・完全無料",
    description:
      "メールアドレスの登録もアカウント作成も不要です。サイトにアクセスするだけで、すべてのツールを無料でご利用いただけます。利用回数の制限もありません。",
  },
  {
    icon: RefreshCw,
    title: "最新の税制に対応（毎年更新）",
    description:
      "税制は毎年のように改正されます。tools24.jpでは国税庁の公式情報をもとに、所得税の税率区分・各種控除額・ふるさと納税の上限計算式などを毎年確認・更新しています。",
  },
  {
    icon: MonitorSmartphone,
    title: "モバイル対応・ダークモード対応",
    description:
      "スマートフォンでもPCでも快適に使えるレスポンシブデザインを採用。目に優しいダークモードにも対応しており、夜間の作業でもストレスなくご利用いただけます。",
  },
];

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "tools24.jpについて" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        tools24.jpについて
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-12">
        {/* ── Mission ── */}
        <section>
          <h2 className="text-xl font-semibold">■ tools24.jpについて</h2>
          <p className="text-muted-foreground leading-relaxed">
            tools24.jpは、「確定申告をもっとわかりやすく、もっと手軽に」という想いから生まれた無料ツール集です。
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            会社員の方が初めて医療費控除を申請するとき、副業を始めたフリーランスの方が確定申告の全体像を把握したいとき、ふるさと納税の控除上限額をさっと確認したいとき——そんな「ちょっと調べたい」「ざっくり計算したい」という場面で、すぐに使えるツールを目指しています。
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            また、Web開発者向けのユーティリティツール（文字化け修正、ファビコン生成、WebP変換など）も提供しています。日常の開発作業で「ちょっとした変換をしたいだけなのに、わざわざソフトをインストールするのは面倒」という場面を解消するために作りました。
          </p>
        </section>

        {/* ── Background ── */}
        <section>
          <h2 className="text-xl font-semibold">■ 開発の背景</h2>
          <p className="text-muted-foreground leading-relaxed">
            私自身、フリーランスとして働き始めた際に確定申告の複雑さに戸惑った経験があります。国税庁のサイトには正確な情報が載っていますが、専門用語が多く、自分のケースにどの控除が当てはまるのかを調べるだけでも大きな手間がかかりました。
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            「所得税がだいたいいくらになるか、入力するだけですぐわかるツールがあれば便利なのに」——そう感じたのが開発のきっかけです。既存の税金計算サイトの多くは会員登録が必要だったり、入力データがサーバーに送信される仕組みだったりと、気軽に使うにはハードルがありました。
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            そこで、ブラウザだけで完結し、個人情報を一切送信しない計算ツールを自分で作ることにしました。同じように確定申告で悩む方々の助けになればと思い、2024年から公開しています。
          </p>
        </section>

        {/* ── Principles ── */}
        <section>
          <h2 className="text-xl font-semibold">■ ツール開発のこだわり</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            tools24.jpのすべてのツールは、以下の4つの原則に基づいて開発・運営しています。
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">
                    {title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Operator Info ── */}
        <section>
          <h2 className="text-xl font-semibold">■ 運営者情報</h2>
          <table className="text-sm w-full max-w-lg">
            <tbody>
              {[
                ["サイト名", "tools24.jp — 無料Webツール & AIプロツール集"],
                ["運営形態", "個人運営（日本国内）"],
                ["開設", "2024年"],
                [
                  "連絡先",
                  "satoshi.yamada0808@gmail.com",
                ],
                ["URL", "https://tools24.jp"],
                ["技術基盤", "Next.js / TypeScript / Vercel"],
              ].map(([label, value]) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 text-muted-foreground font-medium whitespace-nowrap">
                    {label}
                  </td>
                  <td className="py-2.5 text-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted-foreground text-sm leading-relaxed mt-4">
            tools24.jpは、日本在住の個人開発者が企画・設計・開発・運営のすべてを行っています。大きな組織ではありませんが、だからこそユーザーの声に素早く対応し、本当に必要な機能だけをシンプルに提供することを大切にしています。
          </p>
        </section>

        {/* ── Tool List ── */}
        <section>
          <h2 className="text-xl font-semibold">■ ツール一覧</h2>

          <h3 className="text-lg font-semibold mt-4 mb-2">確定申告ツール</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            所得税・医療費控除・ふるさと納税・住宅ローン控除など、確定申告でよく使う計算をかんたんに行えるツールです。計算ロジックは国税庁の公式資料に基づいています。
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {KAKUTEI_TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="hover:underline">
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">Web便利ツール</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Web開発やデザインの日常作業で役立つユーティリティツールです。ファイルのアップロードや変換もすべてブラウザ内で処理されます。
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {WEB_TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="hover:underline">
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Disclaimer ── */}
        <section>
          <h2 className="text-xl font-semibold">■ 免責事項</h2>
          <div className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              tools24.jpで提供する確定申告関連ツールの計算結果は、あくまで
              <strong className="text-foreground">概算・参考値</strong>
              です。実際の税額は個々の状況や条件により異なります。
            </p>
            <p className="mt-3">
              正確な税額の算出や申告手続きについては、
              <a
                href="https://www.nta.go.jp/taxes/shiraberu/shinkoku/kakutei.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                国税庁の確定申告書等作成コーナー
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              をご利用いただくか、税理士などの専門家にご相談ください。
            </p>
            <p className="mt-3">
              当サイトのツールを利用したことにより生じたいかなる損害についても、運営者は責任を負いかねます。自己責任のもとでご利用をお願いいたします。
            </p>
            <p className="mt-3">
              掲載情報の正確性には細心の注意を払っていますが、税制改正等により内容が最新でない場合があります。最新の税制情報は国税庁のウェブサイトでご確認ください。
            </p>
          </div>
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="text-xl font-semibold">■ お問い合わせ</h2>
          <p className="text-muted-foreground leading-relaxed">
            ツールの不具合報告、機能のご要望、税制改正に伴う計算値の誤りのご指摘など、どんな内容でもお気軽にご連絡ください。通常、2営業日以内にご返信いたします。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="mailto:satoshi.yamada0808@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
              satoshi.yamada0808@gmail.com
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
            >
              お問い合わせフォームへ →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
