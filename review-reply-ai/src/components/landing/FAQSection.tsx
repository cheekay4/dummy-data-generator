'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: '本当に無料ですか？',
    a: '1日3回まで完全無料です。登録・クレジットカード不要でご利用いただけます。Proプランは月390円で無制限にご利用いただけます。',
  },
  {
    q: '生成された返信はそのまま使えますか？',
    a: 'そのままコピーしてご利用いただけます。お店の状況に合わせて必要に応じて微修正することをおすすめします。',
  },
  {
    q: 'ネガティブな口コミにも対応できますか？',
    a: '星1の厳しい口コミにも対応しています。感情的にならず、謝罪→改善の姿勢→再来店のお願いという流れでプロフェッショナルな返信を生成します。',
  },
  {
    q: 'クリニックの口コミにも使えますか？',
    a: '対応しています。医療広告ガイドラインに配慮し、治療効果の保証や誇大表現を避けた返信を生成するよう設計されています。',
  },
  {
    q: '英語・中国語の口コミにも対応していますか？',
    a: '外国語の口コミを入力すると、日本語の返信文を生成します。将来的に多言語返信にも対応予定です。',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-10">
          よくある質問
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-stone-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-medium text-stone-800">{faq.q}</span>
                <span className="text-stone-400 text-xl ml-4">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
