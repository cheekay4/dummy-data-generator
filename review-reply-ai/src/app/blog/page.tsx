import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: '口コミ対策コラム | MyReplyTone',
  description: '飲食店・美容室・クリニックのオーナー向け、口コミ管理・MEO対策・返信テクニックのコラム記事。',
  alternates: { canonical: 'https://myreplytone.com/blog' },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">口コミ対策コラム</h1>
          <p className="text-stone-500">飲食店・美容室・クリニックオーナーのための口コミ活用術。MEO対策から返信テクニックまで、実践的なノウハウをお届けします。</p>
        </div>

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block border border-stone-100 rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-stone-400">{post.publishedAt}</span>
                <span className="text-xs text-stone-300">·</span>
                <span className="text-xs text-stone-400">{post.readingTime}で読める</span>
              </div>
              <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-2">{post.title}</p>
              <p className="text-sm text-stone-500 mb-3">{post.description}</p>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
          <p className="font-medium text-stone-800 mb-2">口コミ返信をもっと効率的に</p>
          <p className="text-sm text-stone-500 mb-4">AIがあなたの返信スタイルを学習して、テンプレ感ゼロの口コミ返信を自動生成します。</p>
          <Link href="/generator" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">無料で返信を生成する</Link>
        </div>
      </div>
    </div>
  )
}
