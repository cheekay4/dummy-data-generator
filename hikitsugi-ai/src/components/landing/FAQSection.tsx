'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUpVariants, defaultTransition } from '@/lib/motion'

const FAQS = [
  {
    q: '本当に無料で使えますか？',
    a: 'はい。メールアドレスで登録するだけで、マニュアルを3件まで無料で作成できます。クレジットカードの登録は不要です。',
  },
  {
    q: 'どんな業種に対応していますか？',
    a: '飲食店・美容院・士業事務所の専用ひな形に加え、どの業種でも使える汎用ひな形を用意しています。AIが業種に合わせた質問で業務ノウハウを引き出します。',
  },
  {
    q: 'マニュアルの作成にどのくらいかかりますか？',
    a: 'AIとの対話は通常15〜30分ほどです。その後、AIがマニュアルを自動生成します。生成は1〜2分程度で完了します。',
  },
  {
    q: '音声入力は対応していますか？',
    a: 'Proプランで音声チャット（話しながら対話）と録音アップロード（事前録音をアップロードして文字起こし）に対応しています。無料プランはテキスト入力のみです。',
  },
  {
    q: '生成されたマニュアルは編集できますか？',
    a: 'はい。生成後にMarkdown形式で直接編集できます。Proプランではバージョン管理機能も利用できます。',
  },
  {
    q: 'データのセキュリティは大丈夫ですか？',
    a: '通信はすべてHTTPS暗号化されています。データはSupabase（PostgreSQL）に保存され、他のユーザーからアクセスすることはできません。詳細はプライバシーポリシーをご覧ください。',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="px-4 py-12 bg-white">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariants}
          transition={defaultTransition}
          className="text-[16px] font-bold text-neutral-800 mb-6 text-center"
        >
          よくある質問
        </motion.h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={fadeUpVariants}
              transition={{ ...defaultTransition, delay: i * 0.05 }}
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-[13px] font-medium text-neutral-800 pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <Minus size={14} className="text-neutral-400 flex-shrink-0" />
                ) : (
                  <Plus size={14} className="text-neutral-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-[13px] text-neutral-500 leading-[1.85]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
