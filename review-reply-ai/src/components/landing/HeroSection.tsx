'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

const SAMPLE_REVIEW = {
  rating: 4,
  text: '料理がとても美味しかったです。雰囲気も良く、また来たいと思います。ただ、少し待ち時間が長かったのが残念です。',
}

const SAMPLE_REPLY =
  'この度はご来店いただきありがとうございます。お料理と雰囲気を気に入っていただけて嬉しいです。お待たせしてしまった点は申し訳ございません。オペレーション改善に取り組んでまいります。またのご来店を心よりお待ちしております。'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-stone-50 pt-16 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* ペルソナ呼びかけ */}
        <p className="text-xs text-amber-600 font-medium tracking-wide mb-4">
          飲食店・美容室・クリニック・ホテルの口コミ返信に
        </p>

        {/* メインヘッドライン */}
        <h1
          className="text-3xl md:text-4xl font-bold text-stone-900 leading-snug mb-4 tracking-tight"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          口コミ返信を、<br className="hidden sm:block" />あなたらしく自動生成。
        </h1>

        {/* サブコピー */}
        <p className="text-stone-500 text-base mb-10 leading-relaxed max-w-lg mx-auto">
          口コミを貼るだけ。性格診断で学んだあなたのトーンで、
          <span className="text-stone-700 font-medium">テンプレ感ゼロの返信</span>をAIが作ります。
        </p>

        {/* Before → After デモ */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 max-w-xl mx-auto">
          {/* Before: 口コミ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full sm:flex-1 bg-white border border-stone-200 rounded-xl p-4 text-left shadow-sm"
          >
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-stone-400 font-medium mr-1">お客様</span>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < SAMPLE_REVIEW.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`}
                />
              ))}
            </div>
            <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
              {SAMPLE_REVIEW.text}
            </p>
          </motion.div>

          {/* 矢印 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
              <ArrowRight className="w-4 h-4 text-white sm:block hidden" />
              <ArrowRight className="w-4 h-4 text-white sm:hidden rotate-90" />
            </div>
          </motion.div>

          {/* After: 返信 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full sm:flex-1 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left shadow-sm"
          >
            <p className="text-xs text-amber-600 font-medium mb-2">AI生成された返信</p>
            <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">
              {SAMPLE_REPLY}
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <a
          href="/generator"
          className="inline-block w-full max-w-xs bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-md hover:shadow-lg text-center mb-4"
        >
          今すぐ無料で試す
        </a>

        {/* 性格診断リンク */}
        <div className="mb-8">
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

        {/* トラストバッジ */}
        <p className="text-xs text-stone-400 tracking-wide">
          登録無料&nbsp;&nbsp;·&nbsp;&nbsp;1日5回まで無料&nbsp;&nbsp;·&nbsp;&nbsp;8業種対応&nbsp;&nbsp;·&nbsp;&nbsp;日英中韓対応
        </p>

      </div>
    </section>
  )
}
