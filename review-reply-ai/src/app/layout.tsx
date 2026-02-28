import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://myreplytone.com'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: 'AI口コミ返信ジェネレーター | あなたの人柄でGoogle口コミ・食べログに返信',
  description: 'Google口コミ・食べログ・ホットペッパーの口コミに、あなたの返信スタイルでAIが自動返信。性格診断またはメール文章から「返信プロファイル」を作成。ログインで1日5回無料。飲食店・美容院・クリニック・ホテル対応。',
  keywords: '口コミ 返信 AI, Google口コミ 返信 自動, 口コミ返信 テンプレート, 食べログ 返信, レビュー 返信 自動生成, MEO対策, 口コミ管理',
  openGraph: {
    title: 'AI口コミ返信ジェネレーター | あなたらしい返信をAIが自動生成',
    description: '性格診断や過去の文章からAIがあなたの返信スタイルを学習。テンプレ感ゼロの口コミ返信を自動生成。ログインで1日5回無料。',
    type: 'website',
    locale: 'ja_JP',
    url: APP_URL,
    siteName: 'AI口コミ返信ジェネレーター',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI口コミ返信ジェネレーター',
    description: '性格診断でAIがあなたらしい口コミ返信を自動生成。1日5回無料。',
  },
  verification: {
    google: 'BwNu2bn0NAxEJNZF4ZoBOwCwCxoPtRzOOlr5e1h_eao',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI口コミ返信ジェネレーター',
  url: APP_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript',
  description: 'Google口コミ・食べログ・ホットペッパーなど8プラットフォームの口コミに対する返信文をAIが自動生成。性格診断や過去の文章からあなたの返信スタイルを学習し、テンプレ感ゼロの返信を作成します。',
  inLanguage: 'ja',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    description: '1日5回まで無料。Proプランは月額390円。',
  },
  creator: {
    '@type': 'Organization',
    name: 'tools24.jp',
    url: 'https://tools24.jp',
  },
  featureList: [
    'Google口コミ返信自動生成',
    '性格診断で返信スタイル学習',
    '8業種対応',
    '多言語対応（日英中韓）',
    '客層分析',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
