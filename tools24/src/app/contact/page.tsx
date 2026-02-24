import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "tools24.jp へのご質問、不具合報告、ご要望はこちらからどうぞ。",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />
      <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-muted-foreground mb-6">
        ご質問、不具合報告、ご要望などお気軽にお問い合わせください。
      </p>

      {/* Googleフォーム埋め込み */}
      <div className="border rounded-lg overflow-hidden bg-muted/20 p-6 flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          {/* ここにGoogleフォームのURLを貼り付けてください */}
          {/* 例: <iframe src="https://docs.google.com/forms/d/e/XXXXXX/viewform?embedded=true" width="100%" height="600" /> */}
          Googleフォームを埋め込むには、Google FormsのURLをここに設定してください。
        </p>
        <code className="text-xs bg-muted px-3 py-2 rounded text-muted-foreground">
          src/app/contact/page.tsx を編集してiframeを追加
        </code>
      </div>

      {/* メール代替 */}
      <div className="mt-6 p-4 border rounded-lg text-sm text-center">
        <p className="text-muted-foreground mb-2">メールでのお問い合わせ：</p>
        <a
          href="mailto:contact@example.com"
          className="text-primary hover:underline font-mono"
        >
          {/* ここに実際のメールアドレスを入れる */}
          contact@example.com
        </a>
      </div>
    </div>
  );
}
