import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = locale === "ja" ? `${baseUrl}/contact` : `${baseUrl}/en/contact`;

  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: { canonical: url },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumb items={[{ label: tMeta("contact.title") }]} />
      <h1 className="text-2xl font-bold mb-2">{tMeta("contact.title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {tMeta("contact.description")}
      </p>

      {/* Google Form embed */}
      <div className="border rounded-lg overflow-hidden bg-muted/20 p-6 flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          {/* Paste your Google Form URL here */}
          {/* e.g. <iframe src="https://docs.google.com/forms/d/e/XXXXXX/viewform?embedded=true" width="100%" height="600" /> */}
          Googleフォームを埋め込むには、Google FormsのURLをここに設定してください。
        </p>
        <code className="text-xs bg-muted px-3 py-2 rounded text-muted-foreground">
          src/app/[locale]/contact/page.tsx を編集してiframeを追加
        </code>
      </div>

      <div className="mt-6 p-4 border rounded-lg text-sm text-center">
        <p className="text-muted-foreground mb-2">
          {locale === "ja" ? "メールでのお問い合わせ：" : "Email:"}
        </p>
        <a
          href="mailto:contact@example.com"
          className="text-primary hover:underline font-mono"
        >
          {/* Replace with actual email address */}
          contact@example.com
        </a>
      </div>
    </div>
  );
}
