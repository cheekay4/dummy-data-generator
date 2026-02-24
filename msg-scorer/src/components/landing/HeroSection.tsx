'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6">
      {/* 背景blob */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #EEF2FF 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 左: テキスト */}
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              ✦ AIスコアリングツール
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-outfit font-bold text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6">
            <span className="text-stone-900">この読者層に、</span>
            <br />
            <span className="text-indigo-600">このメッセージは</span>
            <br />
            <span className="text-stone-900">どれだけ届くか。</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed mb-8 max-w-md">
            配信先セグメントを設定して、<br />
            メルマガ・LINE配信文の効果をAIが予測。
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/score"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300"
            >
              無料でスコアリング
              <span className="text-indigo-200">→</span>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            {['✓ 無料で1日5回', '✓ 登録不要', '✓ 30秒で結果'].map((badge) => (
              <span key={badge} className="text-sm text-stone-500 flex items-center gap-1">
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* 右: モックUI */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="relative"
        >
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6">
            {/* スコア表示モック */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-stone-400 mb-1">総合スコア</p>
                <p className="font-outfit font-bold text-5xl text-stone-900 font-mono-score">78</p>
                <p className="text-sm text-stone-500 mt-1">/ 100</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="-rotate-90 w-24 h-24" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" stroke="#E7E5E4" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke="#4F46E5" strokeWidth="8" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - 0.78)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 5軸プレビュー */}
            <div className="space-y-2">
              {[
                { name: '開封誘引力', score: 82 },
                { name: '読了性', score: 65 },
                { name: 'CTA強度', score: 80 },
                { name: '適合度', score: 78 },
                { name: '配信適正', score: 85 },
              ].map(({ name, score }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-20 shrink-0">{name}</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono-score text-stone-600 w-8 text-right">{score}</span>
                </div>
              ))}
            </div>

            {/* インパクト */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
              <div className="flex-1 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium">改善後の推定購入数</p>
                <p className="font-outfit font-bold text-xl text-emerald-700 font-mono-score">+4件 ↑</p>
              </div>
              <div className="text-xs text-stone-400 text-center">
                <p>開封数</p>
                <p className="font-mono-score font-medium text-stone-600">+530件</p>
              </div>
            </div>
          </div>

          {/* 装飾ラベル */}
          <div className="absolute -bottom-4 -left-4 bg-amber-400 text-stone-900 text-xs font-bold px-4 py-2 rounded-full shadow-md">
            配信前チェックで開封率 +5pt
          </div>
        </motion.div>
      </div>
    </section>
  );
}
