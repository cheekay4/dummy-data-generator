import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'AI口コミ返信ジェネレーター | Google口コミ・食べログの返信文を無料で自動作成',
  description: 'Google口コミ・食べログ・ホットペッパーの口コミに対するプロフェッショナルな返信文をAIが自動生成。ネガティブ対応も安心。飲食店・美容院・クリニック対応。無料で1日3回利用可能。',
  keywords: '口コミ 返信 例文, Google口コミ 返信 テンプレート, 口コミ 返信 AI, 食べログ 返信, レビュー 返信 自動, MEO対策',
  openGraph: {
    title: 'AI口コミ返信ジェネレーター | 口コミ返信文を3秒で自動作成',
    description: 'AIが業種・トーンに合わせた口コミ返信文を2パターン生成。Google・食べログ・ホットペッパー対応。1日3回無料。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://review-reply-ai.vercel.app',
    siteName: 'AI口コミ返信ジェネレーター',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI口コミ返信ジェネレーター',
    description: '口コミ返信文をAIが3秒で自動生成。1日3回無料。',
  },
  robots: {
    index: true,
    follow: true,
  },
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
