'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainer, defaultTransition } from '@/lib/motion'

const FREE_FEATURES = [
  'マニュアル3件まで作成',
  'テキスト入力',
  'Markdown形式で出力',
]

const PRO_FEATURES = [
  'マニュアル無制限',
  '音声チャット・録音対応',
  'PDF・Word出力',
  '全業種ひな形',
  'バージョン管理',
  '共有リンク',
]

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-12 bg-neutral-50">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-center mb-8"
        >
          <h2 className="text-[16px] font-bold text-neutral-800 mb-1">料金</h2>
          <p className="text-[12px] text-neutral-400">いつでも解約できます</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="space-y-3"
        >
          <motion.div
            variants={fadeUpVariants}
            transition={defaultTransition}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-neutral-800">無料プラン</h3>
              <div>
                <span className="text-[24px] font-bold text-neutral-900">0</span>
                <span className="text-[12px] text-neutral-400 ml-0.5">円</span>
              </div>
            </div>
            {FREE_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <Check size={10} className="text-neutral-400 flex-shrink-0" />
                <p className="text-[12px] text-neutral-500">{f}</p>
              </div>
            ))}
            <Link
              href="/interview/new"
              className="block w-full mt-4 py-3 rounded-lg border border-neutral-300 text-neutral-700 text-[13px] font-medium text-center hover:bg-neutral-50 transition-colors"
            >
              無料で始める
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            transition={defaultTransition}
            className="rounded-xl border-2 border-slate-600 bg-white p-5 relative"
          >
            <div className="absolute -top-3 left-5">
              <span className="bg-slate-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                おすすめ
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-3 mt-1">
              <h3 className="text-[14px] font-semibold text-neutral-800">Proプラン</h3>
              <div>
                <span className="text-[24px] font-bold text-neutral-900">1,980</span>
                <span className="text-[12px] text-neutral-400 ml-0.5">円/月</span>
              </div>
            </div>
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <Check size={10} className="text-slate-600 flex-shrink-0" />
                <p className="text-[12px] text-neutral-600">{f}</p>
              </div>
            ))}
            <Link
              href="/interview/new"
              className="block w-full mt-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-[13px] font-semibold text-center transition-colors"
            >
              Proプランを始める
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
