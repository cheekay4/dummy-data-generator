'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProBadge from '@/components/ui/ProBadge';

interface Props {
  isPro: boolean;
}

export default function PlanSection({ isPro }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: 'month' }),
      });
      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="font-semibold text-stone-800 mb-4">プラン</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPro ? (
            <>
              <ProBadge />
              <div>
                <p className="text-sm font-medium text-stone-800">Proプラン</p>
                <p className="text-xs text-stone-400">¥980/月</p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-stone-800">Freeプラン</p>
              <p className="text-xs text-stone-400">1日5回まで</p>
            </div>
          )}
        </div>

        {isPro ? (
          <button
            onClick={handlePortal}
            disabled={loading}
            className="text-sm px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : '請求・解約管理'}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Proにアップグレード'}
          </button>
        )}
      </div>

      {!isPro && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Proプランで：無制限スコアリング・履歴保存・カスタムセグメント・CSVエクスポート・プレビュー機能
            <Link href="/pricing" className="text-indigo-500 hover:underline ml-1">詳細を見る</Link>
          </p>
        </div>
      )}
    </div>
  );
}
