'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const personas = [
  { icon: '🛒', text: 'ECの開封率・購入率を\n上げたい' },
  { icon: '📰', text: 'ニュースレターの\nクリック率を改善したい' },
  { icon: '💇', text: '美容サロンのLINE配信で\n予約を増やしたい' },
  { icon: '🏢', text: 'BtoBのセミナー集客\nメールを最適化したい' },
  { icon: '🎓', text: 'スクールの体験申込を\n増やしたい' },
  { icon: '🍽️', text: '飲食店のクーポン\n配信を効果的にしたい' },
];

export default function TargetPersonas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 px-4 sm:px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-stone-400 text-xs uppercase tracking-widest mb-8">
          こんな方におすすめ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.07, ease: 'easeOut' }}
              className="flex items-start gap-3 bg-white/60 rounded-xl px-5 py-4 border border-stone-100"
            >
              <span className="text-2xl shrink-0">{p.icon}</span>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
