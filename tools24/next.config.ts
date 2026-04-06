import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/lib/empty-module.ts" },
      path: { browser: "./src/lib/empty-module.ts" },
    },
  },
  async redirects() {
    return [
      // www + レガシーURL → 最終URL（リダイレクトチェーン回避）
      { source: "/income-tax", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/income-tax", permanent: true },
      { source: "/medical", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/medical", permanent: true },
      { source: "/furusato", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/furusato", permanent: true },
      { source: "/side-job", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/side-job", permanent: true },
      { source: "/life-insurance", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/life-insurance", permanent: true },
      { source: "/housing-loan", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/housing-loan", permanent: true },
      { source: "/furusato-tracker", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/furusato-tracker", permanent: true },
      { source: "/checklist", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/checklist", permanent: true },
      { source: "/etax-guide", has: [{ type: "host", value: "www.tools24.jp" }], destination: "https://tools24.jp/kakutei/etax-guide", permanent: true },
      // www → non-www（一般）
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tools24.jp" }],
        destination: "https://tools24.jp/:path*",
        permanent: true,
      },
      // 旧税務ツールURL → 新URL（non-www用 301リダイレクト）
      { source: "/income-tax", destination: "/kakutei/income-tax", permanent: true },
      { source: "/medical", destination: "/kakutei/medical", permanent: true },
      { source: "/furusato", destination: "/kakutei/furusato", permanent: true },
      { source: "/side-job", destination: "/kakutei/side-job", permanent: true },
      { source: "/life-insurance", destination: "/kakutei/life-insurance", permanent: true },
      { source: "/housing-loan", destination: "/kakutei/housing-loan", permanent: true },
      { source: "/furusato-tracker", destination: "/kakutei/furusato-tracker", permanent: true },
      { source: "/checklist", destination: "/kakutei/checklist", permanent: true },
      { source: "/etax-guide", destination: "/kakutei/etax-guide", permanent: true },
    ];
  },
};

export default nextConfig;
