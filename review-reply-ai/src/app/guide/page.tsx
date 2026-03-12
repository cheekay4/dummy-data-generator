import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '口コミ返信ガイド一覧 | MyReplyTone',
  description: 'Google口コミ・食べログ・ホットペッパーの口コミ返信に役立つガイド集。悪い口コミへの対応、MEO対策、業種別のコツを無料公開。',
  alternates: {
    canonical: 'https://myreplytone.com/guide',
  },
}

const guides = [
  {
    href: '/guide/google-review-reply',
    title: 'Google口コミ返信の書き方完全ガイド',
    desc: '良い口コミ・悪い口コミ別の返信構成、絶対に守るべきルール、すぐ使える例文を解説。',
    tag: '基本',
  },
  {
    href: '/guide/negative-review',
    title: '悪い口コミへの対応方法——炎上させずに誠実に返す技術',
    desc: '低評価・クレーム口コミに正しく対応するための4ステップとNGパターン集。',
    tag: '対応',
  },
  {
    href: '/guide/meo',
    title: 'MEO対策と口コミ管理の基本——飲食店・店舗オーナー向け',
    desc: 'Googleマップの上位表示に直結する口コミ返信のポイントとMEO対策の全体像。',
    tag: 'MEO',
  },
  {
    href: '/guide/industry-tips',
    title: '業種別・口コミ返信のコツ（飲食・美容・クリニック・ホテル）',
    desc: '業種ごとに異なる口コミの特徴と、読まれる返信文を書くための具体的なテクニック。',
    tag: '業種別',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">口コミ返信ガイド</h1>
          <p className="text-stone-500">
            Google口コミ・食べログ・ホットペッパーの返信に役立つノウハウを無料公開しています。
          </p>
        </div>

        <div className="space-y-4">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="block border border-stone-100 rounded-2xl p-5 hover:border-amber-200 hover:bg-amber-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 flex-shrink-0 mt-0.5">
                  {g.tag}
                </span>
                <div>
                  <p className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-1">
                    {g.title}
                  </p>
                  <p className="text-sm text-stone-500">{g.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
          <p className="font-medium text-stone-800 mb-2">ガイドを読んだら実際に試してみよう</p>
          <p className="text-sm text-stone-500 mb-4">AIがあなたの返信スタイルを学習して、テンプレ感ゼロの口コミ返信を自動生成します。</p>
          <Link
            href="/generator"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            ✨ 無料で返信を生成する →
          </Link>
        </div>
      </div>
    </div>
  )
}
