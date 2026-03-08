'use client'

import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainer, defaultTransition } from '@/lib/motion'

const PROBLEMS = [
  {
    title: 'ノウハウが人に紐づいている',
    desc: 'ベテランが抜けると、業務の進め方やコツが一緒に消えてしまう',
  },
  {
    title: 'マニュアルを書く余裕がない',
    desc: '日常業務に追われて、引き継ぎ資料を整理する時間が取れない',
  },
  {
    title: '口では説明できるのに書けない',
    desc: '話せばわかるのに、いざ文章にしようとすると手が止まる',
  },
]

export default function ProblemsSection() {
  return (
    <section className="px-4 py-12 bg-white">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-[16px] font-bold text-neutral-800 mb-8 text-center"
        >
          引き継ぎの課題
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="space-y-5"
        >
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              transition={defaultTransition}
              className="flex gap-4 items-start"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[12px] font-bold text-neutral-400">{i + 1}</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-0.5">{p.title}</p>
                <p className="text-[13px] text-neutral-500 leading-[1.8]">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
