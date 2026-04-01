import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "agentjuku - A2A\u30a8\u30b3\u30b7\u30b9\u30c6\u30e0\u306e\u9053\u5177\u7bb1",
    template: "%s | agentjuku",
  },
  description:
    "AI\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u540d\u523a\uff08Agent Card\uff09\u3092\u30d6\u30e9\u30a6\u30b6\u4e0a\u3067\u4f5c\u6210\u30fb\u691c\u8a3c\u3002A2A\u30d7\u30ed\u30c8\u30b3\u30eb v1.0\u6e96\u62e0\u3002\u30c7\u30fc\u30bf\u5916\u90e8\u9001\u4fe1\u306a\u3057\u3002",
  metadataBase: new URL("https://agentjuku.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "A2A \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ab\u30fc\u30c9 \u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc",
  description:
    "A2A\u30d7\u30ed\u30c8\u30b3\u30eb v1.0\u306b\u6e96\u62e0\u3057\u305fAgent Card\u3092GUI\u3067\u751f\u6210\u30fb\u691c\u8a3c\u3059\u308b\u30d6\u30e9\u30a6\u30b6\u30c4\u30fc\u30eb",
  url: "https://agentjuku.com/tools/agent-card",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  creator: { "@type": "Organization", name: "agentjuku" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ja">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sora text-sumi bg-kinari antialiased">
        {children}
      </body>
    </html>
  );
}
