import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DisclaimerBanner } from '@/components/common/disclaimer-banner';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '契約書チェッカー | AIが契約書のリスク・不利条項を自動検出',
    template: '%s | 契約書チェッカー',
  },
  description:
    '契約書を貼り付けるだけで、AIがリスクスコア・不利条項・改善案を瞬時に分析。業務委託・NDA・売買契約など全12カテゴリの条項をチェック。フリーランス・中小企業の契約書レビューに。',
  keywords: '契約書 チェック, 契約書 レビュー, 契約書 リスク, 業務委託 契約書, NDA チェック',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <DisclaimerBanner />
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
