'use client'

import { useState, useEffect } from 'react'
import AuthModal from '@/components/auth/AuthModal'

const HERO_CATCHCOPIES: [string, string][] = [
  ['自動口コミ返信に、', 'あなたの"人柄"をインストール。'],
  ['あなたの"ありがとう"、', 'AIがちゃんとお客様に届けます。'],
  ['口コミ返信が苦手でも大丈夫。', 'あなたの性格、AIが再現します。'],
  ['お客様が嬉しくなる返信、', 'あなたの人柄から作ります。'],
]

export default function HeroSection() {
  const [catchcopy, setCatchcopy] = useState<[string, string]>(HERO_CATCHCOPIES[0])
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setCatchcopy(HERO_CATCHCOPIES[Math.floor(Math.random() * HERO_CATCHCOPIES.length)])
  }, [])

  return (
    <section className="bg-gradient-to-b from-amber-50 to-stone-50 pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* キャッチコピー */}
        <h1
          className="text-3xl md:text-4xl font-bold text-stone-900 leading-snug mb-6 tracking-tight"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          {catchcopy[0]}<br className="hidden sm:block" />{catchcopy[1]}
        </h1>

        {/* サブコピー */}
        <p className="text-stone-500 text-base md:text-lg mb-10 leading-relaxed">
          口コミを貼り付けるだけで、AIが返信文を自動生成。
          <br className="hidden sm:block" />
          性格診断でAIにあなたのスタイルを教えると、
          <br className="hidden sm:block" />
          <span className="text-stone-700 font-medium">テンプレ感のない、あなたらしい返信</span>に変わります。
        </p>

        {/* CTAボタン群：縦積み・中央揃え */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <a
            href="/generator"
            className="w-full max-w-xs bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md hover:shadow-lg text-center"
          >
            今すぐ無料で試す
          </a>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full max-w-xs border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-bold py-4 rounded-2xl text-base transition-colors text-center"
          >
            AIにあなたを覚えさせる（無料）
          </button>
        </div>

        {/* 性格診断ゴーストリンク */}
        <div className="mb-10">
          <a
            href="/diagnosis"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-amber-600 transition-colors"
          >
            <span>🧠</span>
            <span className="underline underline-offset-4 decoration-stone-300">
              先に性格診断だけやってみる（2分・登録不要）
            </span>
          </a>
        </div>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            nextPath="/profile/create"
          />
        )}

        {/* トラストバッジ：ドット区切りフラットテキスト */}
        <p className="text-xs text-stone-400 tracking-wide">
          登録無料&nbsp;&nbsp;·&nbsp;&nbsp;1日5回まで無料&nbsp;&nbsp;·&nbsp;&nbsp;8業種対応&nbsp;&nbsp;·&nbsp;&nbsp;日英中韓対応
        </p>

      </div>
    </section>
  )
}
