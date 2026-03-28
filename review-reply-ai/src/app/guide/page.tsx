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
  {
    href: '/guide/tabelog-review-reply',
    title: '食べログの口コミ返信ガイド——Google口コミとの違いと書き方のコツ',
    desc: '食べログ特有の点数システムや常連レビュアーへの対応方法、すぐ使える返信例文を紹介。',
    tag: '食べログ',
  },
  {
    href: '/guide/hotpepper-review-reply',
    title: 'ホットペッパービューティーの口コミ返信ガイド——美容サロン向け完全マニュアル',
    desc: '予約連動の特徴を活かした返信テクニック。仕上がり不満への対応や新規予約につなげるコツ。',
    tag: 'ホットペッパー',
  },
  {
    href: '/guide/review-reply-examples',
    title: '【2026年版】口コミ返信テンプレート30選——コピペで使える業種別例文集',
    desc: '飲食店・美容院・クリニック・ホテルなど7業種の口コミ返信例文を高評価・低評価別に30本掲載。',
    tag: '例文集',
  },
  {
    href: '/guide/review-reply-template',
    title: '口コミ返信の「型」——どんな口コミにも使える5つの返信フレームワーク',
    desc: '基本型・クレーム対応型・アップセル型・質問型・短文型の5つのフレームワークをBefore/After付きで解説。',
    tag: 'テクニック',
  },
  {
    href: '/guide/review-psychology',
    title: '口コミ心理学——なぜ人は口コミを書くのか、そして返信が行動を変えるのか',
    desc: '口コミを書く心理的動機と、返信が見込み客・既存客の行動に与える影響を心理学の観点から解説。',
    tag: 'マーケティング',
  },
  {
    href: '/guide/star-rating-meaning',
    title: '星評価の本当の意味——★1〜★5それぞれに最適な返信戦略',
    desc: '星1から星5まで、各評価の口コミに最適な返信方法を解説。返信の優先順位と各星評価の返信例文付き。',
    tag: '戦略',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">口コミ返信ガイド</h1>
          <p className="text-stone-500 leading-relaxed">
            口コミ返信は、お客様との信頼関係を築く大切なコミュニケーションです。しかし、「何を書けばいいかわからない」「悪い口コミにどう返せばいいか不安」というオーナー様の声をたくさんいただいています。このガイドシリーズでは、Google口コミ・食べログ・ホットペッパーの返信ノウハウを、業種別・プラットフォーム別・星評価別に体系的にまとめています。すべて無料で公開していますので、ぜひ口コミ返信の参考にしてください。
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
