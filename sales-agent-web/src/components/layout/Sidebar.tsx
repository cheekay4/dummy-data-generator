'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'ダッシュボード', emoji: '📊' },
  { href: '/campaigns', label: 'キャンペーン', emoji: '🎯' },
  { href: '/leads', label: 'リード', emoji: '👥' },
  { href: '/drafts', label: '承認待ち', emoji: '✉️' },
  { href: '/schedule', label: 'スケジュール', emoji: '📅' },
  { href: '/replies', label: '返信', emoji: '💬' },
  { href: '/escalations', label: 'エスカレーション', emoji: '🚨' },
  { href: '/pipeline', label: 'パイプライン', emoji: '🔄' },
  { href: '/voc', label: 'VoC', emoji: '📊' },
  { href: '/settings/knowledge', label: 'ナレッジ', emoji: '📚' },
  { href: '/settings', label: '設定', emoji: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 bg-white border-r border-stone-200 flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-stone-100">
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Sales Agent</p>
        <p className="text-lg font-bold text-stone-900 mt-0.5">MsgScore</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, emoji }) => {
          const active =
            href === '/' ? pathname === '/' :
            href === '/settings' ? pathname === '/settings' :
            pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-stone-100">
        <p className="text-xs text-stone-400 text-center">© 2026 Riku / MsgScore</p>
      </div>
    </aside>
  )
}
