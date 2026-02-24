'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '📊',
    title: 'セグメント×目的別スコアリング',
    description: '読者属性と配信目的（購入・来店・クリック等）を設定することで、そのメッセージが「このターゲットに刺さるか」をAIが精密に評価します。',
  },
  {
    icon: '📈',
    title: '予測インパクト表示',
    description: '「改善で+4件の購入」が一目でわかる。推定開封数・クリック数・CV数を数字で提示。上司への報告資料にそのまま使えます。',
  },
  {
    icon: '💬',
    title: 'メール＋LINE両対応',
    description: '件名・本文・LINE配信文を1つのツールで。チャネルごとの特性（文字数制限・モバイル率）を考慮した評価を行います。',
  },
];

export default function FeatureCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 px-4 sm:px-6 bg-stone-50/60" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-stone-400 text-xs uppercase tracking-widest mb-4">特徴</p>
        <h2 className="font-outfit font-bold text-3xl text-stone-900 text-center mb-12">
          配信前チェックを、もっとスマートに
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
              className="bg-white rounded-2xl p-8 border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                {f.icon}
              </div>
              <h3 className="font-outfit font-semibold text-lg text-stone-900 mb-3">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
