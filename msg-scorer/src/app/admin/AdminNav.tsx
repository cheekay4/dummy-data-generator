'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin',       label: 'ダッシュボード' },
  { href: '/admin/users', label: 'ユーザー管理' },
  { href: '/admin/teams', label: 'チーム管理' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-stone-200 pb-0">
      {LINKS.map(({ href, label }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              active
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
