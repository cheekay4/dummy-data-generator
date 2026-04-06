import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "tools24.jpへのお問い合わせ。ツールの不具合報告やご要望はこちらから。",
  alternates: { canonical: '/contact' },
};

const CONTACT_EMAIL = "satoshi.yamada0808@gmail.com";

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "お問い合わせ" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mb-8">お問い合わせ</h1>

      <div className="max-w-xl space-y-8">
        <p className="text-muted-foreground leading-relaxed">
          tools24.jpに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
        </p>

        <div className="space-y-3">
          <p className="text-lg font-medium">
            📧{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <Button asChild>
            <a href={`mailto:${CONTACT_EMAIL}`}>メールを送る</a>
          </Button>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">■ お問い合わせいただける内容</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>ツールの不具合報告</li>
            <li>新機能のご要望</li>
            <li>計算結果に関するご質問</li>
            <li>その他</li>
          </ul>
        </section>

        <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
          ※ 個別の税務相談にはお答えできません。税務に関するご質問は、
          最寄りの税務署または税理士にご相談ください。
        </p>

        <p className="text-sm text-muted-foreground">
          通常2営業日以内にご返信いたします。
        </p>
      </div>
    </>
  );
}
