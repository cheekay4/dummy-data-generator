import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

import { AffiliateToast } from "@/components/common/affiliate-toast";
import { PRDisclosure } from "@/components/common/pr-disclosure";
import { ToastProvider } from "@/components/common/toast";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-noto-sans-jp",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "tools24.jp — 無料Webツール & AIプロツール集",
    template: "%s | tools24.jp",
  },
  description:
    "ブラウザだけで使える無料ツール集＋AI搭載プロツール。確定申告・JSON整形・正規表現・文字化け修正・電子印鑑・敬語メール生成など25以上のツールを提供。登録不要・データ送信なし。",
  metadataBase: new URL("https://tools24.jp"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "tools24.jp",
  },
  twitter: {
    card: "summary_large_image",
    title: "tools24.jp — 無料Webツール & AIプロツール集",
    description: "ブラウザだけで使える無料ツール集＋AI搭載プロツール。確定申告・JSON整形・正規表現・文字化け修正・電子印鑑・敬語メール生成など25以上のツールを提供。登録不要・データ送信なし。",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* WebSite 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "tools24.jp",
              url: "https://tools24.jp",
              description:
                "ブラウザだけで使える無料ツール集。確定申告・JSON整形・正規表現など25以上のツールを提供。登録不要・データ送信なし。",
              inLanguage: "ja",
            }),
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1751877635785206"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QER2CDGV46"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-QER2CDGV46');`}
        </Script>
      </head>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Header />
            <PRDisclosure />
            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
            <Footer />
            <AffiliateToast />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
