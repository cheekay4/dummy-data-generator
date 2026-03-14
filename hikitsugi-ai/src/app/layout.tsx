import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: '引き継ぎAI | AIが聞き出す、業務マニュアル自動生成',
  description:
    '退職・異動の引き継ぎに。AIが質問するだけで、後任者が読める業務マニュアルが完成。テキスト・音声チャット・録音に対応。3件まで無料。',
  keywords: '引き継ぎ, マニュアル, 業務引き継ぎ, AI, 自動生成, 退職, 業務マニュアル',
  openGraph: {
    title: '引き継ぎAI | AIが聞き出す、業務マニュアル自動生成',
    description:
      'AIが業務のノウハウを対話で聞き出して、後任者が読める引き継ぎ資料を自動作成します。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '引き継ぎAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: '引き継ぎAI | AIが聞き出す、業務マニュアル自動生成',
    description:
      'AIが業務のノウハウを対話で聞き出して、後任者が読める引き継ぎ資料を自動作成します。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '引き継ぎAI',
  description: '業務の暗黙知をAI対話で引き出し、構造化マニュアルを自動生成するツール',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
      name: '無料プラン',
    },
    {
      '@type': 'Offer',
      price: '1980',
      priceCurrency: 'JPY',
      name: 'Proプラン',
    },
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#475569" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
