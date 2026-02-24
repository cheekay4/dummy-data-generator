'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AccountDeleteSection() {
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const CONFIRM_WORD = 'アカウントを削除する';
  const canDelete = confirm === CONFIRM_WORD;

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? '削除に失敗しました');
        setDeleting(false);
        return;
      }

      // サーバー側でAuth削除済み → クライアントでもサインアウト
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/?deleted=1';
    } catch {
      setError('ネットワークエラーが発生しました');
      setDeleting(false);
    }
  }

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-sm font-semibold text-stone-700">アカウントの削除</h2>
        <span className="text-xs text-stone-400">{expanded ? '▲ 閉じる' : '▼ 開く'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-red-800">⚠️ この操作は取り消せません</p>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>すべてのスコア履歴・カスタムセグメントが削除されます</li>
              <li>Proプランのサブスクリプションが即時キャンセルされます</li>
              <li>拡張機能トークンが無効化されます</li>
              <li>チームメンバーシップが解除されます（チーム自体は残ります）</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              確認のため <span className="font-mono bg-stone-100 px-1 rounded">アカウントを削除する</span> と入力してください
            </label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="アカウントを削除する"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300/50"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? '削除中...' : 'アカウントを完全に削除する'}
          </button>
        </div>
      )}
    </section>
  );
}
