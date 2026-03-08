'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainer, defaultTransition } from '@/lib/motion'
import { TEMPLATES_LIST } from '@/lib/templates'

export default function TemplateShowcase() {
  return (
    <section className="px-4 py-12 bg-neutral-50">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-center mb-6"
        >
          <h2 className="text-[16px] font-bold text-neutral-800 mb-1">業種別ひな形</h2>
          <p className="text-[12px] text-neutral-400">業種に合わせた質問でノウハウを引き出します</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-2.5"
        >
          {TEMPLATES_LIST.map((t) => (
            <motion.div
              key={t.templateKey}
              variants={fadeUpVariants}
              transition={defaultTransition}
            >
              <Link
                href="/interview/new"
                className="flex flex-col p-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-neutral-300 transition-all block"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-3 text-lg">
                  {t.icon}
                </div>
                <p className="text-[13px] font-semibold text-neutral-800 mb-1">{t.businessType}</p>
                <p className="text-[11px] text-neutral-500 leading-[1.6]">{t.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
