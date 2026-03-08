'use client'

import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainer, defaultTransition } from '@/lib/motion'

const STEPS = [
  {
    n: '01',
    title: '業種を選ぶ',
    desc: '飲食店・美容院・士業など、業種のひな形を選択します',
  },
  {
    n: '02',
    title: 'AIと対話する',
    desc: 'テキスト入力、音声チャット、録音アップロードに対応しています',
  },
  {
    n: '03',
    title: 'マニュアル完成',
    desc: '構造化された引き継ぎ資料をPDF・Wordでダウンロードできます',
  },
]

export default function StepsSection() {
  return (
    <section className="px-4 py-12 bg-neutral-50">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-center mb-8"
        >
          <h2 className="text-[16px] font-bold text-neutral-800 mb-1">使い方</h2>
          <p className="text-[12px] text-neutral-400">3つのステップで完成</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="space-y-6"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              variants={fadeUpVariants}
              transition={defaultTransition}
              className="flex gap-4 items-start"
            >
              <span className="text-[32px] font-bold leading-none text-slate-600/15 flex-shrink-0 w-10">
                {s.n}
              </span>
              <div className="pt-1">
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">{s.title}</p>
                <p className="text-[13px] text-neutral-500 leading-[1.8]">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
