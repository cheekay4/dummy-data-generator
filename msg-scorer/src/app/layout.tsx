import type { Metadata } from 'next';
import { Outfit, Noto_Sans_JP, DM_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit-var',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://msgscore.jp'),
  title: {
    default: 'MsgScore | セグメント×目的別メール・LINE配信文AIスコアリング',
    template: '%s | MsgScore',
  },
  description:
    '配信先の読者属性（性別・年代・母数）と配信目的を設定して、メルマガ・LINE配信文の効果をAIが予測。スコア・改善案・推定開封数・推定CV数を即座に提示。',
  keywords: [
    'メール スコアリング',
    'メルマガ 件名 分析',
    'LINE 配信文 改善',
    'MA ツール',
    'セグメント分析',
    '開封率 予測',
    'メール マーケティング AI',
    'EC メール 開封率',
    '美容サロン LINE 配信',
    'メルマガ 効果測定',
    'LINE公式アカウント 配信文',
    'CTR 改善 AI',
  ],
  authors: [{ name: 'MsgScore' }],
  openGraph: {
    title: 'MsgScore — この読者層に、このメッセージはどれだけ届くか',
    description:
      'AIがメール・LINE配信文をセグメント×目的別に5軸評価。推定開封数・CV数・改善案を即提案。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'MsgScore',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MsgScore OGP' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MsgScore — メール・LINE配信文AIスコアリング',
    description: 'セグメント×目的別に5軸評価。推定開封数・CV数・改善案を即提案。',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://msgscore.jp' },
  icons: {
    icon: [
      { url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%234F46E5'/%3E%3Cpath d='M16 4L28 16L16 28L4 16Z' fill='white'/%3E%3C/svg%3E", type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ja" className={`${outfit.variable} ${notoSansJP.variable} ${dmMono.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%234F46E5'/%3E%3Cpath d='M16 4L28 16L16 28L4 16Z' fill='white'/%3E%3C/svg%3E" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2432747666538345"
          crossOrigin="anonymous"
        />
      </head>
      <body className="text-stone-900 antialiased">
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
