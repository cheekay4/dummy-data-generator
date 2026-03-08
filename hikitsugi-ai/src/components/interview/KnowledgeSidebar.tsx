'use client'

import { useState } from 'react'
import { ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ExtractedKnowledge } from '@/lib/types'
import { PHASE_LABELS, PHASE_ORDER } from '@/lib/templates'

interface KnowledgeSidebarProps {
  knowledge: ExtractedKnowledge
  currentPhaseIndex: number
  outputSections: string[]
  desktopOnly?: boolean
  mobileOnly?: boolean
}

export default function KnowledgeSidebar({
  knowledge,
  currentPhaseIndex,
  desktopOnly,
  mobileOnly,
}: KnowledgeSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalCount = knowledge.sections.length

  const content = (
    <div className="space-y-2">
      {PHASE_ORDER.map((phase, i) => {
        const items = knowledge.sections.filter((s) => s.phase === phase)
        const isDone = i < currentPhaseIndex
        const isCurrent = i === currentPhaseIndex

        return (
          <div key={phase}>
            <div className="flex items-center gap-1.5 mb-1">
              {isDone ? (
                <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 flex-shrink-0" />
              ) : (
                <Circle size={11} className="text-neutral-300 flex-shrink-0" />
              )}
              <p
                className={`text-[11px] font-semibold ${
                  isDone ? 'text-slate-600' : isCurrent ? 'text-slate-500' : 'text-neutral-300'
                }`}
              >
                {PHASE_LABELS[phase]}
              </p>
            </div>
            {items.length > 0 && (
              <div className="ml-4 space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200/50 rounded-lg px-2.5 py-2"
                  >
                    <p className="text-[11px] text-slate-600 font-medium leading-[1.6]">
                      {item.title}
                    </p>
                    {item.content && (
                      <p className="text-[11px] text-slate-500 leading-[1.6] mt-0.5 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {items.length === 0 && isCurrent && (
              <div className="ml-4">
                <p className="text-[11px] text-neutral-300 italic">ヒアリング中...</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // Desktop sidebar
  if (desktopOnly) {
    return (
      <div className="hidden lg:block w-64 flex-shrink-0 p-4">
        <div className="sticky top-4 bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-neutral-600 mb-3">
            記録済みノウハウ {totalCount > 0 && <span className="text-neutral-400 font-normal">({totalCount})</span>}
          </p>
          {content}
        </div>
      </div>
    )
  }

  // Mobile inline trigger + drawer
  if (mobileOnly) {
    return (
      <>
        <div className="lg:hidden border-t border-neutral-100 px-4 py-2 bg-white flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[11px] text-slate-500 font-medium flex items-center gap-1 hover:text-slate-700 transition-colors"
          >
            記録済みノウハウ {totalCount > 0 && `(${totalCount})`}
            <ChevronUp
              size={12}
              className={`transition-transform ${mobileOpen ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/30 z-20"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 z-20 max-h-[60vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
                <p className="text-xs font-semibold text-neutral-600 mb-3">
                  記録済みノウハウ {totalCount > 0 && `(${totalCount})`}
                </p>
                {content}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return null
}
