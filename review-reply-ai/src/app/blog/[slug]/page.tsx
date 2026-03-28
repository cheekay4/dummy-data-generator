import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog-posts'
import { blogContentMap } from '@/lib/blog-content'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | MyReplyTone`,
    description: post.description,
    alternates: { canonical: `https://myreplytone.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://myreplytone.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const Content = blogContentMap[slug]
  if (!Content) notFound()
  const related = getRelatedPosts(slug, 2)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
    publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://myreplytone.com/blog/${post.slug}` },
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/blog" className="text-sm text-stone-400 hover:text-stone-600">コラム一覧に戻る</Link>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-stone-400">{post.publishedAt}</span>
          <span className="text-xs text-stone-300">·</span>
          <span className="text-xs text-stone-400">{post.readingTime}で読める</span>
        </div>
        <div className="flex gap-2 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">{tag}</span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">{post.title}</h1>
        <p className="text-stone-500 mb-10">{post.description}</p>

        <Content />

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連記事</h2>
            <div className="space-y-3">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                  <div className="flex gap-2 mb-1">
                    {r.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                  <p className="font-medium text-stone-700 mt-1">{r.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
          <p className="font-medium text-stone-800 mb-2">口コミ返信を自動化しませんか？</p>
          <p className="text-sm text-stone-500 mb-4">AIがあなたの返信スタイルを学習して、テンプレ感ゼロの返信を生成します。</p>
          <Link href="/generator" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">無料で返信を生成する</Link>
        </div>
      </div>
    </div>
  )
}
