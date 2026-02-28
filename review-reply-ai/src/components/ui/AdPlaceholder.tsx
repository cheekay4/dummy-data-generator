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
  // 広告未設定時は何も表示しない（広告コード挿入時にここを差し替える）
  return null
}
