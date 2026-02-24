import type { Sentiment } from '@/lib/types'

interface Props {
  sentiment: Sentiment
  rating: number
}

const SENTIMENT_CONFIG = {
  positive: { label: 'ポジティブ', icon: '😊', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  negative: { label: 'ネガティブ', icon: '😔', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  mixed: { label: 'ミックス', icon: '😐', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
}

export default function SentimentBadge({ sentiment, rating }: Props) {
  const config = SENTIMENT_CONFIG[sentiment]
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-medium text-sm">{config.label}</span>
      <span className="text-sm opacity-70">（星{rating}）</span>
    </div>
  )
}
