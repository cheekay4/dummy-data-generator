'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  'AIがインタビュー内容を分析しています...',
  '業務の手順を整理しています...',
  '判断基準とコツをまとめています...',
  'マニュアルを構成しています...',
  '仕上げ中です...',
]

export default function GeneratingOverlay() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, STEPS.length - 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        {/* Animated dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-slate-600 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        <h2 className="text-[16px] font-bold text-neutral-900 mb-2">
          マニュアルを作成しています
        </h2>

        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[13px] text-neutral-500 mb-8"
          >
            {STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-slate-600 rounded-full"
            initial={{ width: '5%' }}
            animate={{ width: `${Math.min(((stepIndex + 1) / STEPS.length) * 90 + 10, 95)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}
