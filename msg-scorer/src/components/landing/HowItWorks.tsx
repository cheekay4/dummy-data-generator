'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    num: '①',
    title: 'テキストを入力',
    desc: 'メール件名・本文・LINE配信文を貼り付け。チャネルに合わせた入力フォームが表示されます。',
  },
  {
    num: '②',
    title: 'セグメントと目的を設定',
    desc: '読者属性と配信目的をプリセットからワンタップで設定。詳細なカスタマイズも可能です。',
  },
  {
    num: '③',
    title: 'スコアと改善案を確認',
    desc: '5軸評価・推定CV数・A/Bテスト案を即座に提示。レポートとして出力もできます。',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-stone-400 text-xs uppercase tracking-widest mb-4">使い方</p>
        <h2 className="font-outfit font-bold text-3xl text-stone-900 text-center mb-16">
          3ステップで完了
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.15, ease: 'easeOut' }}
              className="relative text-center"
            >
              <div className="font-outfit font-bold text-7xl text-indigo-100 mb-4 leading-none">
                {step.num}
              </div>
              <h3 className="font-outfit font-semibold text-lg text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
