'use client'

import { PHASE_ORDER, PHASE_LABELS } from '@/lib/templates'

interface ProgressBarProps {
  currentPhaseIndex: number
}

export default function ProgressBar({ currentPhaseIndex }: ProgressBarProps) {
  return (
    <div className="flex gap-1">
      {PHASE_ORDER.map((phase, i) => (
        <div key={phase} className="flex-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < currentPhaseIndex
                ? 'bg-slate-600'
                : i === currentPhaseIndex
                ? 'bg-slate-400'
                : 'bg-neutral-100'
            }`}
          />
          <p
            className={`text-[11px] text-center mt-1 ${
              i <= currentPhaseIndex ? 'text-slate-600 font-medium' : 'text-neutral-300'
            }`}
          >
            {PHASE_LABELS[phase]}
          </p>
        </div>
      ))}
    </div>
  )
}
