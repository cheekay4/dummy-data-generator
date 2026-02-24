'use client';
import { useState } from 'react';

interface Props {
  hasToken: boolean;
}

export default function ExtensionTokenSection({ hasToken: initialHasToken }: Props) {
  const [hasToken, setHasToken] = useState(initialHasToken);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/extension/token', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '生成に失敗しました');
        return;
      }
      setNewToken(data.token);
      setHasToken(true);
    } catch {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke() {
    if (!confirm('トークンを無効化しますか？Chrome拡張から接続できなくなります。')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/extension/token', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? '無効化に失敗しました');
        return;
      }
      setHasToken(false);
      setNewToken(null);
    } catch {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!newToken) return;
    navigator.clipboard.writeText(newToken);
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="font-semibold text-stone-800 mb-1">Chrome拡張トークン</h2>
      <p className="text-xs text-stone-400 mb-4">
        Gmail・LINE OA Managerの作成画面でスコアリングを使うためのトークンです。
        トークンは生成時に1回だけ表示されます。
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {newToken && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-medium text-amber-700 mb-2">
            トークンを安全な場所に保存してください（再表示できません）
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs bg-white border border-amber-200 rounded-lg px-3 py-2 text-amber-900 break-all">
              {newToken}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-2 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
            >
              コピー
            </button>
          </div>
        </div>
      )}

      {hasToken && !newToken && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-emerald-600 text-sm">✓</span>
          <span className="text-xs text-emerald-700 font-medium">トークン設定済み</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? '処理中...' : hasToken ? '再生成' : 'トークンを生成'}
        </button>

        {hasToken && (
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            無効化
          </button>
        )}
      </div>
    </div>
  );
}
