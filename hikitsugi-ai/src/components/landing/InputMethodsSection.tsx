'use client'

import { motion } from 'framer-motion'
import { Type, Mic, Upload } from 'lucide-react'
import { fadeUpVariants, staggerContainer, defaultTransition } from '@/lib/motion'

const METHODS = [
  {
    Icon: Type,
    title: 'テキスト入力',
    desc: 'チャット形式で、キーボードから回答します',
    tag: '無料プラン',
    tagClass: 'bg-neutral-100 text-neutral-600',
  },
  {
    Icon: Mic,
    title: '音声チャット',
    desc: '話しかけるだけ。AIも音声で返答します',
    tag: 'Proプラン',
    tagClass: 'bg-slate-50 text-slate-700',
  },
  {
    Icon: Upload,
    title: '録音アップロード',
    desc: 'インタビュー録音を文字起こし・自動整理します',
    tag: 'Proプラン',
    tagClass: 'bg-slate-50 text-slate-700',
  },
]

export default function InputMethodsSection() {
  return (
    <section className="px-4 py-12 bg-white">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-[16px] font-bold text-neutral-800 mb-6 text-center"
        >
          3つの伝え方
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="space-y-3"
        >
          {METHODS.map((m, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              transition={defaultTransition}
              className="flex gap-4 items-center p-4 rounded-xl border border-neutral-200"
            >
              <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0 text-neutral-500">
                <m.Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-semibold text-neutral-800">{m.title}</p>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${m.tagClass}`}>
                    {m.tag}
                  </span>
                </div>
                <p className="text-[12px] text-neutral-500">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
