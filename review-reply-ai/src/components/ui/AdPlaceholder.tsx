interface AdPlaceholderProps {
  size: 'leaderboard' | 'rectangle' | 'square'
  className?: string
}

const SIZE_MAP = {
  leaderboard: { width: 728, height: 90, label: '広告 728×90' },
  rectangle: { width: 336, height: 280, label: '広告 336×280' },
  square: { width: 300, height: 250, label: '広告 300×250' },
}

export default function AdPlaceholder({ size, className = '' }: AdPlaceholderProps) {
  const { width, height, label } = SIZE_MAP[size]
  return (
    <div
      className={`flex items-center justify-center bg-stone-100 border border-dashed border-stone-300 rounded-lg text-stone-400 text-xs ${className}`}
      style={{ width: '100%', maxWidth: width, height, margin: '0 auto' }}
    >
      {label}
    </div>
  )
}
