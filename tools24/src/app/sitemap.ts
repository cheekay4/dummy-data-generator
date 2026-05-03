import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tools24.jp";
  // コンテンツが実際に更新された日付を使用（new Date() は毎回変わるため非推奨）
  const lastUpdated = new Date("2026-02-28");
  const legalUpdated = new Date("2026-02-20");

  return [
    {
      url: baseUrl,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kakutei`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/income-tax`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/medical`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/furusato`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/side-job`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/life-insurance`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/checklist`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kakutei/housing-loan`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kakutei/furusato-tracker`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kakutei/etax-guide`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: legalUpdated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mojibake-fixer`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favicon-generator`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/digital-stamp`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/webp-converter`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/minify-tools`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/zenkaku-hankaku`,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/image-compressor`,
      lastModified: new Date("2026-03-22"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/character-counter`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/furigana-converter`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diff-checker`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mermaid-viewer`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tex-converter`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/emoji-generator`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // 開発者ツール
    {
      url: `${baseUrl}/dev`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dev/json-formatter`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/regex-tester`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/dummy-data-generator`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/cron-expression-builder`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/wareki-converter`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/encode-decode`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dev/data-masking`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // ガイド記事
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide/kakutei-beginners`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/csv-mojibake`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/webp-seo`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/json-api-debug`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/digital-stamp-remote`,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // 新規ガイド記事
    {
      url: `${baseUrl}/guide/regex-beginners`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/cron-guide`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/base64-guide`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/dummy-data-testing`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/zenkaku-hankaku-guide`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // ブログ（開発者ノート）
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/browser-tools-vs-desktop`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/freelance-kakutei-tips`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/tools24-dev-story`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];
}
