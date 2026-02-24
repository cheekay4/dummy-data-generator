'use client';
import { motion } from 'framer-motion';

interface Props {
  improvements: string[];
}

export default function ImprovementList({ improvements }: Props) {
  return (
    <div>
      <h3 className="font-outfit font-semibold text-stone-900 mb-4">✨ 改善提案</h3>
      <div className="space-y-3">
        {improvements.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08, ease: 'easeOut' }}
            className="flex gap-4 bg-white border border-stone-200 rounded-xl px-5 py-4"
          >
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold font-mono-score text-indigo-600">
              {i + 1}
            </span>
            <p className="text-sm text-stone-700 leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
