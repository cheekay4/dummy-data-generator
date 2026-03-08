'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUpVariants, defaultTransition } from '@/lib/motion'

const CATCHCOPIES = [
  'あの人の頭の中を、\nマニュアルにします。',
  '退職まであと2週間。\n引き継ぎ、間に合います。',
  '「聞けばよかった」を、なくす。',
  'ベテランの勘と経験、\nAIが聞き出してドキュメントに。',
]

export default function HeroSection() {
  const [catchcopy, setCatchcopy] = useState(CATCHCOPIES[0])

  useEffect(() => {
    const random = CATCHCOPIES[Math.floor(Math.random() * CATCHCOPIES.length)]
    setCatchcopy(random)
  }, [])

  return (
    <section className="relative px-4 pt-14 pb-12 bg-stone-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400" />

      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={defaultTransition}
        >
          <p className="text-slate-600 text-[11px] font-semibold tracking-widest uppercase mb-5">
            業務の引き継ぎ支援ツール
          </p>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-neutral-900 leading-[1.5] mb-5 tracking-tight whitespace-pre-line">
            {catchcopy}
          </h1>
          <p className="text-neutral-500 text-[14px] leading-[1.9] mb-8">
            AIが業務のノウハウを対話で聞き出して、<br className="hidden sm:block" />
            後任者が読める引き継ぎ資料を自動作成します。<br className="hidden sm:block" />
            テキスト入力・音声チャット・録音に対応。
          </p>

          <Link
            href="/interview/new"
            className="inline-block w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-xl text-[15px] text-center transition-all active:scale-[0.98]"
          >
            無料でマニュアルを作成する
          </Link>
          <p className="text-center sm:text-left text-[12px] text-neutral-400 mt-3">
            3件まで無料 ・ クレジットカード登録不要
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto mt-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ ...defaultTransition, delay: 0.2 }}
          className="flex justify-center gap-6 sm:gap-10 py-4 bg-white rounded-xl border border-neutral-100"
        >
          {[
            { n: '3つ', l: 'の入力方式' },
            { n: '4業種', l: 'のひな形' },
            { n: 'PDF', l: '/ Word出力' },
          ].map((t, i) => (
            <div key={i} className="text-center">
              <p className="text-[16px] font-bold text-neutral-800">{t.n}</p>
              <p className="text-[10px] text-neutral-400">{t.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
