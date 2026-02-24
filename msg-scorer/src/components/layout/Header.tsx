'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthButton from './AuthButton';
import { useTeam } from '@/hooks/useTeam';
import { TEAM_PLAN_LABELS } from '@/lib/plan';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { team, loading: teamLoading } = useTeam();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-stone-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-indigo-600 text-xl font-bold font-outfit">◆</span>
          <span className="font-outfit font-bold text-lg text-stone-900 group-hover:text-indigo-600 transition-colors duration-200">
            MsgScore
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/score"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
          >
            スコアリング
          </Link>
          <Link
            href="/mypage"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
          >
            マイページ
          </Link>
          {!teamLoading && team && (
            <Link
              href="/team"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
            >
              チーム
            </Link>
          )}
          <Link
            href="/pricing"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
          >
            料金
          </Link>
          {!teamLoading && team && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              {TEAM_PLAN_LABELS[team.plan] ?? team.plan}
            </span>
          )}
          <AuthButton />
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden p-2 text-stone-600 hover:text-stone-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className="block w-5 h-0.5 bg-current mb-1 transition-transform" />
          <span className="block w-5 h-0.5 bg-current mb-1 transition-opacity" />
          <span className="block w-5 h-0.5 bg-current transition-transform" />
        </button>
      </div>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-white/95 border-t border-stone-100"
          >
            <nav className="flex flex-col px-4 py-4 gap-3">
              <Link
                href="/score"
                className="text-sm text-stone-600 hover:text-stone-900 py-2"
                onClick={() => setMenuOpen(false)}
              >
                スコアリング
              </Link>
              <Link
                href="/mypage"
                className="text-sm text-stone-600 hover:text-stone-900 py-2"
                onClick={() => setMenuOpen(false)}
              >
                マイページ
              </Link>
              {!teamLoading && team && (
                <Link
                  href="/team"
                  className="text-sm text-stone-600 hover:text-stone-900 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  チーム
                </Link>
              )}
              <Link
                href="/pricing"
                className="text-sm text-stone-600 hover:text-stone-900 py-2"
                onClick={() => setMenuOpen(false)}
              >
                料金
              </Link>
              <div className="px-1">
                <AuthButton />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
