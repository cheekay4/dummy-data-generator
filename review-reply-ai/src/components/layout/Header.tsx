'use client'

import Link from 'next/link'
import AuthButton from '@/components/auth/AuthButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-amber-500">⭐</span>
          <span className="font-bold text-stone-800 text-sm md:text-base">AI口コミ返信ジェネレーター</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/#pricing" className="text-stone-600 hover:text-amber-600 transition-colors hidden sm:block">
            料金
          </a>
          <a href="/#faq" className="text-stone-600 hover:text-amber-600 transition-colors hidden sm:block">
            FAQ
          </a>
          <a
            href="/generator"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-colors hidden sm:block"
          >
            今すぐ試す
          </a>
          <AuthButton />
        </nav>
      </div>
    </header>
  )
}
