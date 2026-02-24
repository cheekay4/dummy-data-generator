import type { Metadata } from "next";
import { MaskingTool } from "@/components/masking/masking-tool";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TrustBadges } from "@/components/common/trust-badges";
import { RelatedTools } from "@/components/common/related-tools";
import { FAQ } from "@/components/masking/faq";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "個人情報マスキングツール - テキストの個人情報を自動検出・置換",
  description:
    "テキストに含まれる氏名、電話番号、メールアドレス、住所、マイナンバーを自動検出してマスク。ChatGPTやClaudeに送る前の個人情報除去に。全てブラウザ内で処理、サーバー送信なし。",
  keywords: ["個人情報 マスキング", "個人情報 除去", "テキスト 匿名化", "ChatGPT 個人情報", "マイナンバー マスク"],
  openGraph: {
    title: "個人情報マスキングツール | tools24.jp",
    description: "テキストの個人情報を自動検出・マスク。ChatGPTやClaudeに送る前の個人情報除去に。全てブラウザ内処理。",
    type: "website",
  },
};

export default function PersonalDataMaskingPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "個人情報マスキングツール" }]} />

      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">個人情報マスキングツール</h1>
        <p className="text-muted-foreground mt-1">ChatGPTやClaudeに送る前に、テキストの個人情報を自動検出・マスク</p>
      </div>

      <TrustBadges />

      <AdPlaceholder slot="header" width={728} height={90} />

      <MaskingTool />

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold">個人情報マスキングツールとは</h2>
        <p className="text-muted-foreground leading-relaxed mt-3">
          AIツール（ChatGPT・Claude・Gemini等）に社内文書や業務メールを入力する際、
          氏名・電話番号・メールアドレス・住所・マイナンバーなどの個人情報がテキストに含まれていると、
          情報漏洩リスクが生じます。本ツールはそれらを自動検出し、安全なテキストに変換します。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          全ての処理はブラウザ内で完結しており、入力したテキストはサーバーに一切送信されません。
          ネットワーク通信も発生しないため、社外秘文書や個人情報を含む文書を安心してご利用いただけます。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          対応する個人情報: 氏名（漢字）、電話番号（携帯・固定）、メールアドレス、住所（都道府県〜番地）、
          郵便番号、マイナンバー（12桁・チェックデジット検証付き）、クレジットカード番号（Luhn検証付き）、IPアドレス。
        </p>
      </section>

      <AdPlaceholder slot="content" width={336} height={280} />

      <FAQ />
      <RelatedTools />
    </div>
  );
}
