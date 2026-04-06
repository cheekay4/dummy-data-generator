import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { FeatureTabs } from "@/components/json-formatter/feature-tabs";
import { Faq } from "@/components/json-formatter/faq";
import { RelatedTools } from "@/components/common/related-tools";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const toolUrl = locale === "ja" ? `${baseUrl}/json-formatter` : `${baseUrl}/en/json-formatter`;

  return {
    title: t("jsonFormatter.title"),
    description: t("jsonFormatter.description"),
    alternates: {
      canonical: toolUrl,
      languages: {
        ja: `${baseUrl}/json-formatter`,
        en: `${baseUrl}/en/json-formatter`,
        "x-default": `${baseUrl}/json-formatter`,
      },
    },
    openGraph: {
      title: t("jsonFormatter.title"),
      description: t("jsonFormatter.description"),
      url: toolUrl,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function JsonFormatterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "tools" });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Ad */}
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <Breadcrumb items={[{ label: tTools("json-formatter.title") }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{tTools("json-formatter.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {tTools("json-formatter.description")}
        </p>
      </div>

      <FeatureTabs />

      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      <RelatedTools currentPath="/json-formatter" />

      {/* SEO content (JA) */}
      <section className="mt-12 space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">JSON整形ツールとは</h2>
          <p>
            JSON整形ツール（JSONフォーマッター）は、読みにくいJSON文字列を見やすく整形（インデント整理）したり、
            逆に空白を取り除いて1行に圧縮したりするためのオンラインツールです。
            APIレスポンスの確認、設定ファイルの編集、データ変換など、Webエンジニアの日常業務を効率化します。
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">使い方</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>左のテキストエリアにJSONを貼り付けるか、.jsonファイルをドラッグ&ドロップします</li>
            <li>上部のタブから実行する操作を選択します（整形・圧縮・変換など）</li>
            <li>右のエリアに結果が表示されます。「コピー」または「ダウンロード」で取り出せます</li>
          </ol>
        </div>
      </section>

      <Faq />

      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
