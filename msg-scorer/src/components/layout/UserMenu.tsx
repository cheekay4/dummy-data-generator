'use client';
import { useState, useRef, useEffect } from 'react';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ProBadge from '@/components/ui/ProBadge';
import { useTeam } from '@/hooks/useTeam';
import { TEAM_PLAN_LABELS } from '@/lib/plan';

interface Props {
  user: User;
  isPro: boolean;
}

export default function UserMenu({ user, isPro }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { team } = useTeam();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const initial = (user.email ?? 'U')[0].toUpperCase();
  const planLabel = team
    ? TEAM_PLAN_LABELS[team.plan] ?? team.plan
    : isPro ? 'Proプラン' : 'Freeプラン';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
          {initial}
        </div>
        {isPro && !team && <ProBadge />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-50">
          <div className="px-3 py-2 border-b border-stone-100">
            <p className="text-xs font-medium text-stone-700 truncate">{user.email}</p>
            <p className="text-xs text-stone-400 mt-0.5">{planLabel}</p>
          </div>
          <Link
            href="/mypage"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            マイページ
          </Link>
          <Link
            href="/mypage?tab=settings"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            設定
          </Link>
          {team && (
            <>
              <Link
                href="/team"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                チーム管理
              </Link>
              <Link
                href="/team/settings"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                プラン管理
              </Link>
            </>
          )}
          {!isPro && !team && (
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
            >
              Proにアップグレード
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 transition-colors border-t border-stone-100 mt-1"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
