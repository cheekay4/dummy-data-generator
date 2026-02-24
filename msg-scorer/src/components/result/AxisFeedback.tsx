'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreAxis } from '@/lib/types';

function AxisItem({ axis, index }: { axis: ScoreAxis; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const barColor =
    axis.score >= 71 ? 'bg-emerald-500' :
    axis.score >= 41 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors text-left"
      >
        {/* 軸名 */}
        <span className="text-sm font-medium text-stone-700 w-28 shrink-0">{axis.name}</span>

        {/* プログレスバー */}
        <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-2 rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${axis.score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
          />
        </div>

        {/* スコア */}
        <span className="w-10 text-right text-sm font-mono-score font-medium text-stone-700 shrink-0">
          {axis.score}
        </span>

        {/* トグル */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone-400 text-xs shrink-0"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <p className="px-5 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
              {axis.feedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  axes: ScoreAxis[];
}

export default function AxisFeedback({ axes }: Props) {
  return (
    <div>
      <h3 className="font-outfit font-semibold text-stone-900 mb-4">📋 軸別フィードバック</h3>
      <div className="space-y-2">
        {axes.map((axis, i) => (
          <AxisItem key={axis.name} axis={axis} index={i} />
        ))}
      </div>
    </div>
  );
}
