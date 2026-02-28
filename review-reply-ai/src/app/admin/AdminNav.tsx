'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react'

const tabs = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'ユーザー管理', icon: Users },
  { href: '/admin/usage', label: '利用状況', icon: BarChart3 },
  { href: '/admin/system', label: 'システム', icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav className="flex gap-1 mb-6 border-b border-stone-200 pb-px overflow-x-auto">
      {tabs.map((tab) => {
        const active = isActive(tab.href, tab.exact)
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              active
                ? 'text-amber-600 border-b-2 border-amber-500 bg-white'
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
