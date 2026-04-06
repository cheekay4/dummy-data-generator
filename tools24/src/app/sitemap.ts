import type { MetadataRoute } from "next";
import { allTools } from "@/lib/tools-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tools24.jp";

  const toolPages: MetadataRoute.Sitemap = allTools
    .filter((t) => t.status === "live" && !t.external)
    .map((t) => {
      const isKakutei = t.category === "kakutei";
      return {
        url: `${baseUrl}${t.href}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
        ...(isKakutei
          ? {}
          : {
              alternates: {
                languages: {
                  ja: `${baseUrl}${t.href}`,
                  en: `${baseUrl}/en${t.href}`,
                },
              },
            }),
      };
    });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          ja: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    ...toolPages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          ja: `${baseUrl}/privacy`,
          en: `${baseUrl}/en/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/tokushoho`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          ja: `${baseUrl}/tokushoho`,
          en: `${baseUrl}/en/tokushoho`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          ja: `${baseUrl}/contact`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
  ];
}
