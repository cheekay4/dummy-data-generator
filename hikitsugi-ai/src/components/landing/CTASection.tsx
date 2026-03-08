'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Smartphone, ChevronRight } from 'lucide-react'
import { fadeUpVariants, defaultTransition } from '@/lib/motion'

export default function CTASection() {
  return (
    <>
      <section className="px-4 py-14 bg-stone-50">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUpVariants}
            transition={defaultTransition}
          >
            <h2 className="text-[18px] font-bold text-neutral-900 mb-3 tracking-tight">
              AIが質問するだけで、<br />
              引き継ぎマニュアルが完成します。
            </h2>
            <p className="text-[13px] text-neutral-500 mb-8 leading-[1.85]">
              答えるだけで、後任者が読める資料になります。<br />
              まずは無料でお試しください。
            </p>
            <Link
              href="/interview/new"
              className="inline-block bg-neutral-900 hover:bg-neutral-700 text-white font-semibold py-4 px-8 rounded-xl text-[15px] transition-all active:scale-[0.98]"
            >
              無料でマニュアルを作成する →
            </Link>
            <p className="text-[11px] text-neutral-400 mt-3">3件まで無料 ・ クレジットカード不要</p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 bg-white border-t border-neutral-100">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUpVariants}
            transition={defaultTransition}
          >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone size={18} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-neutral-800">
                  スマートフォンアプリ準備中
                </p>
                <p className="text-[12px] text-neutral-500">
                  現場で録音、移動中に確認。Webと自動同期。
                </p>
              </div>
              <ChevronRight size={14} className="text-neutral-400 flex-shrink-0" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
