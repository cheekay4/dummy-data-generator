'use client';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import UserMenu from './UserMenu';

export default function AuthButton() {
  const { user, loading, isPro } = useUser();

  if (loading) {
    return <div className="w-20 h-8 bg-stone-100 rounded-xl animate-pulse" />;
  }

  if (user) {
    return <UserMenu user={user} isPro={isPro} />;
  }

  return (
    <Link
      href="/login"
      className="text-sm px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 transition-all duration-200"
    >
      ログイン
    </Link>
  );
}
