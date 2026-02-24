import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "tools24.jp へのお問い合わせ。不具合報告やご要望はこちらから。",
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "お問い合わせ" }]} />
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">お問い合わせ</h1>
        <p className="text-muted-foreground mb-6">
          tools24.jpに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
        </p>
        <div className="space-y-4">
          <p className="text-lg">📧 <a href="mailto:satoshi.yamada0808@gmail.com" className="text-primary hover:underline">satoshi.yamada0808@gmail.com</a></p>
          <Button asChild>
            <a href="mailto:satoshi.yamada0808@gmail.com">メールを送る</a>
          </Button>
        </div>
        <div className="mt-8 space-y-2">
          <h2 className="font-semibold">お問い合わせいただける内容</h2>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
            <li>ツールの不具合報告</li>
            <li>新機能のご要望</li>
            <li>計算結果に関するご質問</li>
            <li>その他</li>
          </ul>
        </div>
        <p className="mt-6 text-sm text-muted-foreground border-l-2 border-border pl-3">
          ※ 個別の税務相談にはお答えできません。税務に関するご質問は、最寄りの税務署または税理士にご相談ください。
        </p>
        <p className="mt-4 text-sm text-muted-foreground">通常3営業日以内にご返信いたします。</p>
      </div>
    </>
  );
}
