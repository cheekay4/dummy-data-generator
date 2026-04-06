import { getTranslations } from "next-intl/server";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { SearchBox } from "@/components/home/search-box";
import { PopularTools } from "@/components/home/popular-tools";
import { HomeClient } from "@/components/home/home-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = "https://tools24.jp";
  const canonical = locale === "ja" ? baseUrl : `${baseUrl}/en`;

  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: {
      canonical,
      languages: {
        ja: baseUrl,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      url: canonical,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ad */}
      <div className="flex justify-center mb-8">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-2xl font-medium sm:text-3xl">{t("heroTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t("heroTagline")}
            <br className="sm:hidden" />
            {t("heroTaglineSub")}
          </p>
        </header>

        {/* Search */}
        <SearchBox />

        {/* Popular Tools */}
        <PopularTools />

        {/* Category Navigation + Tool Lists */}
        <HomeClient />
      </div>

      {/* Footer SEO text */}
      <div className="mx-auto mt-16 max-w-3xl">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("seoText")}
        </p>
      </div>

      {/* Ad */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="bottom-rect" width={336} height={280} />
      </div>
    </div>
  );
}
