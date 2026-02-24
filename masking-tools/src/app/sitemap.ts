import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tools24.jp";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/personal-data-masking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/tokushoho`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
