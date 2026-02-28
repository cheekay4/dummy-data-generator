import Link from 'next/link'

interface Props {
  message?: string
}

export default function UpgradeCTA({ message = 'Proにアップグレードすると、すべての機能が使えます。' }: Props) {
  return (
    <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex items-center justify-between gap-4">
      <p className="text-sm text-stone-700">{message}</p>
      <Link
        href="/pricing"
        className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Proへ →
      </Link>
    </div>
  )
}
