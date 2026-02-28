import Link from 'next/link'

export default function EditAdviceBanner() {
  return (
    <Link
      href="/advice"
      className="block border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl px-4 py-3 transition-colors"
    >
      <p className="text-sm text-amber-700">
        💡 <span className="font-medium">AI返信をもっとあなたらしくするコツ</span> → 手直しガイドを見る
      </p>
    </Link>
  )
}
