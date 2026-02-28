import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function EditAdviceBanner() {
  return (
    <Link
      href="/advice"
      className="block border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl px-4 py-3 transition-colors"
    >
      <p className="text-sm text-amber-700 flex items-center gap-1">
        <span className="font-medium">AI返信をもっとあなたらしくするコツ</span>
        <ChevronRight className="w-4 h-4" />
        <span>手直しガイドを見る</span>
      </p>
    </Link>
  )
}
