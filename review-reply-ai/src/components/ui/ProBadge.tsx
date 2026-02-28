export default function ProBadge({ size = 'sm' }: { size?: 'xs' | 'sm' }) {
  return (
    <span className={`bg-amber-100 text-amber-700 font-bold rounded-full ${
      size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
    }`}>
      ✨ Pro
    </span>
  )
}
