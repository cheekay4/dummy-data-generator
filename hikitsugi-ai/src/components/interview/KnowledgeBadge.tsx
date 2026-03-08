import { CheckCircle2 } from 'lucide-react'
import type { ExtractedKnowledgeItem } from '@/lib/types'

interface KnowledgeBadgeProps {
  item: ExtractedKnowledgeItem
}

export default function KnowledgeBadge({ item }: KnowledgeBadgeProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg px-3 py-2 flex items-start gap-1.5">
      <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-emerald-700">
        <span className="font-medium">{item.title}</span>
        {item.content && <span className="text-emerald-600/70"> — {item.content}</span>}
      </p>
    </div>
  )
}
