import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "文字数カウンター | 無料オンライン文字数カウントツール",
  description:
    "無料で使えるオンライン文字数カウンター。リアルタイムで文字数、単語数、行数、バイト数を表示。Twitter文字数制限チェック、原稿用紙換算、文字種別内訳にも対応。",
  keywords: [
    "文字数カウント",
    "文字数カウンター",
    "オンライン",
    "無料",
    "単語数",
    "バイト数",
    "Twitter文字数",
    "原稿用紙",
  ],
  openGraph: {
    title: "文字数カウンター | 無料オンライン文字数カウントツール",
    description:
      "リアルタイムで文字数・単語数・行数・バイト数をカウント。Twitter制限チェックや原稿用紙換算も対応。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
