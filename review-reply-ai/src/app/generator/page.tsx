import type { Metadata } from 'next'
import Link from 'next/link'
import GeneratorWorkspace from '@/components/generator/GeneratorWorkspace'
import AdPlaceholder from '@/components/ui/AdPlaceholder'

export const metadata: Metadata = {
  title: '口コミ返信を生成する | MyReplyTone',
  description: '口コミを貼り付けて業種・トーンを選ぶだけ。AIが返信文を2パターン即座に生成。Google・食べログ・ホットペッパー対応。1日3回無料。',
  openGraph: {
    title: '口コミ返信を今すぐ生成 | MyReplyTone',
    description: '口コミを貼り付けて業種・トーンを選ぶだけ。AIが返信文を2パターン即座に生成。',
    type: 'website',
    locale: 'ja_JP',
  },
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-0">
        <nav className="text-xs text-stone-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-amber-600 transition-colors">トップ</Link>
          <span>›</span>
          <span className="text-stone-600">口コミ返信を生成する</span>
        </nav>
      </div>

      {/* Generator */}
      <GeneratorWorkspace />

      {/* AdSense rectangle */}
      <div className="py-8 flex justify-center">
        <AdPlaceholder size="rectangle" />
      </div>

      {/* Back to LP info */}
      <div className="max-w-3xl mx-auto px-4 pb-12 text-center">
        <p className="text-sm text-stone-400 mb-3">使い方や料金プランについて</p>
        <Link
          href="/#pricing"
          className="text-amber-600 hover:text-amber-700 text-sm font-medium underline underline-offset-2"
        >
          料金・よくある質問を見る →
        </Link>
      </div>
    </div>
  )
}
