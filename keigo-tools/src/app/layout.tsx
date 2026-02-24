import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '敬語メールライター | カジュアル文章をビジネス敬語メールに変換',
    template: '%s | 敬語メールライター',
  },
  description:
    '箇条書きやカジュアルな文章を入力するだけで、相手やシーンに合った敬語ビジネスメールを自動生成。お礼・お詫び・依頼・催促など全14シーン対応。敬語の使い方も解説付き。',
  keywords: '敬語 メール, ビジネスメール 書き方, 敬語 変換, メール 敬語, ビジネス メール テンプレート',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
