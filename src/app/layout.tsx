import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "agentjuku - A2Aエコシステムの道具箱",
    template: "%s | agentjuku",
  },
  description:
    "AIエージェントの名刺（Agent Card）をブラウザ上で作成・検証。A2Aプロトコル v1.0準拠。データ外部送信なし。",
  metadataBase: new URL("https://agentjuku.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "A2A エージェントカード ジェネレーター",
  description:
    "A2Aプロトコル v1.0に準拠したAgent CardをGUIで生成・検証するブラウザツール",
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
      <body className="font-sora text-white bg-[#0A0A0A] antialiased">
        {/* Background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-float-slow"
            style={{
              background: "radial-gradient(circle, #D84835 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-float-medium"
            style={{
              background: "radial-gradient(circle, #1E4D7B 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl animate-float-fast"
            style={{
              background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
