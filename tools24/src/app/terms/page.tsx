import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const metadata: Metadata = {
  title: "免責事項",
  description:
    "tools24.jpの免責事項。計算結果の取り扱い、税務判断、損害責任、外部リンクについてご確認ください。",
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "免責事項" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mb-8">免責事項</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. 計算結果について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイト「tools24.jp」（以下、「当サイト」）で提供する全てのツールの結果は概算値です。
            実際の税額は個々の状況や条件により異なるため、計算結果の正確性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. 税務判断について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトは税務に関する一般的な情報を提供することを目的としており、税務アドバイスを提供するものではありません。
            具体的な税務判断については、必ず税務署や税理士などの専門家にご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. 損害について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトの利用により生じたいかなる損害（直接的・間接的を問わず）についても、
            当サイトの運営者は一切の責任を負いかねます。
            当サイトの情報は自己責任でご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. 外部リンクについて</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトから外部サイトへのリンクを設置している場合がありますが、
            リンク先の内容について当サイトは一切の責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. 推奨</h2>
          <p className="text-muted-foreground leading-relaxed">
            正確な税額の計算および確定申告の手続きについては、
            <a
              href="https://www.keisan.nta.go.jp/kyoutu/ky/sm/top"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              国税庁の確定申告書等作成コーナー
            </a>
            をご利用いただくか、税理士にご相談ください。
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          制定日: 2025年1月1日
        </p>
      </div>
    </>
  );
}
