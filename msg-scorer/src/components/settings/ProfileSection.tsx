'use client';
import { type User } from '@supabase/supabase-js';

export default function ProfileSection({ user }: { user: User }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="font-semibold text-stone-800 mb-4">プロフィール</h2>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {(user.email ?? 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-800">{user.email}</p>
          <p className="text-xs text-stone-400 mt-0.5">
            登録日: {new Date(user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  );
}
