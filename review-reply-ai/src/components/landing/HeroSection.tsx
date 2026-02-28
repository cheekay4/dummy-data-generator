'use client'

import { useState, useEffect } from 'react'
import AuthModal from '@/components/auth/AuthModal'

const HERO_CATCHCOPIES = [
  '自動口コミ返信に、あなたの"人柄"をインストール。',
  'あなたの"ありがとう"、AIがちゃんとお客様に届けます。',
  '口コミ返信が苦手でも大丈夫。あなたの性格、AIが再現します。',
  'お客様が嬉しくなる返信、あなたの人柄から作ります。',
]

export default function HeroSection() {
  const [catchcopy, setCatchcopy] = useState(HERO_CATCHCOPIES[0])
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setCatchcopy(HERO_CATCHCOPIES[Math.floor(Math.random() * HERO_CATCHCOPIES.length)])
  }, [])

  return (
    <section className="bg-gradient-to-b from-amber-50 to-stone-50 pt-16 pb-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* メインキャッチコピー（ランダム表示） */}
        <h1
          className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-5"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          {catchcopy}
        </h1>

        {/* サブコピー */}
        <p className="text-stone-600 text-base md:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          過去のメールや返信をAIが分析して、あなたの返信スタイルを学習。
          テンプレ感ゼロの、心のこもった口コミ返信を自動生成します。
        </p>

        {/* メインCTAボタン */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a
            href="/generator"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-md hover:shadow-lg"
          >
            今すぐ無料で試す
          </a>
          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-block border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-bold px-8 py-4 rounded-xl text-base transition-colors"
          >
            プロファイルを作って始める
          </button>
        </div>

        {/* 性格診断CTA */}
        <div className="mb-8">
          <a
            href="/diagnosis"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 transition-colors border border-stone-200 hover:border-amber-300 bg-white rounded-full px-5 py-2.5 shadow-sm hover:shadow"
          >
            <span>🧠</span>
            <span>まず性格診断をやってみる（2分・登録不要）</span>
            <span className="text-stone-300">→</span>
          </a>
        </div>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            nextPath="/profile/create"
          />
        )}

        {/* バッジ */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
          <span className="flex items-center gap-1.5">
            <span>✨</span> 1日5回まで無料
          </span>
          <span className="flex items-center gap-1.5">
            <span>🧠</span> 2分で性格診断
          </span>
          <span className="flex items-center gap-1.5">
            <span>⭐</span> 8業種対応
          </span>
          <span className="flex items-center gap-1.5">
            <span>🌏</span> 多言語OK
          </span>
        </div>
      </div>
    </section>
  )
}
