import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tools24.jp"),
  title: {
    default: "tools24.jp — 便利なWebツールを無料で",
    template: "%s | tools24.jp",
  },
  description:
    "JSON整形、文字数カウント、正規表現テスト、ダミーデータ生成など、開発者向けの便利ツールが全て無料・ブラウザ完結で使えます。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://tools24.jp",
    siteName: "tools24.jp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
