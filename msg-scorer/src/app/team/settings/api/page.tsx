'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTeam } from '@/hooks/useTeam';
import type { ApiKey } from '@/lib/types';

export default function ApiKeysPage() {
  const { team, isOwner, loading } = useTeam();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [fetching, setFetching] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!team) return;
    fetch('/api/team/settings/api-keys')
      .then(r => r.json())
      .then((d: { keys?: ApiKey[] }) => setKeys(d.keys ?? []))
      .finally(() => setFetching(false));
  }, [team]);

  async function handleGenerate() {
    setGenerating(true);
    setError('');
    const res = await fetch('/api/team/settings/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName || 'Default' }),
    });
    const d = await res.json() as { success?: boolean; key?: string; id?: string; prefix?: string; error?: string };
    if (!d.success) {
      setError(d.error ?? '生成に失敗しました');
    } else {
      setRevealedKey(d.key ?? '');
      const keysRes = await fetch('/api/team/settings/api-keys');
      const keysData = await keysRes.json() as { keys?: ApiKey[] };
      setKeys(keysData.keys ?? []);
      setNewKeyName('');
    }
    setGenerating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm('このAPIキーを無効化しますか？この操作は元に戻せません。')) return;
    await fetch(`/api/team/settings/api-keys?id=${id}`, { method: 'DELETE' });
    setKeys(prev => prev.map(k => k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k));
  }

  if (loading || fetching) return <div className="p-8 text-stone-500">読み込み中...</div>;
  if (!team) return <div className="p-8 text-stone-500">チームに所属していません。</div>;
  if (!isOwner) return <div className="p-8 text-stone-500">管理者のみアクセスできます。</div>;

  // Team Pro ゲーティング
  if (team.plan !== 'team_pro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden border border-stone-200">
          <div className="blur-sm pointer-events-none p-8 space-y-3">
            <h1 className="text-2xl font-bold text-stone-900">🔑 APIキー管理</h1>
            <p className="text-stone-500">外部ツールからMsgScoreのスコアリングAPIを呼び出せます。</p>
            <div className="h-20 bg-stone-100 rounded-xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center space-y-3 p-8">
              <p className="text-lg font-semibold text-stone-800">Team Proプランが必要です</p>
              <Link href="/pricing" className="inline-block mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Team Proにアップグレード
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeKeys = keys.filter(k => !k.revoked_at);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/team" className="text-stone-400 hover:text-stone-600 text-sm">← チーム</Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-bold text-stone-900">🔑 APIキー管理</h1>
      </div>

      <p className="text-sm text-stone-500">
        MsgScoreのスコアリングAPIを外部から呼び出せます。MAツール連携や自動化スクリプトに利用してください。
      </p>

      {/* 生成直後のキー表示モーダル */}
      {revealedKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-bold text-stone-900">APIキーを保存してください</h2>
                <p className="text-sm text-stone-500 mt-1">このキーは一度しか表示されません。安全な場所に保存してください。</p>
              </div>
            </div>
            <div className="bg-stone-900 rounded-xl p-4">
              <code className="text-green-400 text-xs break-all leading-relaxed">{revealedKey}</code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(revealedKey);
                setCopied(true);
                setTimeout(() => { setCopied(false); setRevealedKey(null); }, 2000);
              }}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              {copied ? 'コピーしました ✅' : 'コピーして閉じる'}
            </button>
          </div>
        </div>
      )}

      {/* アクティブなキー一覧 */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-700">
            アクティブなキー <span className="text-stone-400">({activeKeys.length}/5)</span>
          </p>
          <Link href="/team/settings/api/docs" className="text-xs text-indigo-600 hover:underline">
            APIドキュメント →
          </Link>
        </div>

        {activeKeys.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">APIキーがありません</p>
        ) : (
          <div className="space-y-3">
            {activeKeys.map(k => (
              <div key={k.id} className="flex items-start justify-between p-3 bg-stone-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-stone-800">📌 {k.name}</p>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">{k.key_prefix}••••••••••••••••••••</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    作成: {new Date(k.created_at).toLocaleDateString('ja-JP')}
                    {k.last_used_at && (
                      <span> / 最終利用: {new Date(k.last_used_at).toLocaleDateString('ja-JP')}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0 mt-0.5"
                >
                  無効化
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 無効化済みのキー */}
        {keys.some(k => k.revoked_at) && (
          <details className="border-t border-stone-100 pt-3">
            <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600">
              無効化済みのキー ({keys.filter(k => k.revoked_at).length}件)
            </summary>
            <div className="space-y-2 mt-2">
              {keys.filter(k => k.revoked_at).map(k => (
                <div key={k.id} className="flex items-center gap-3 p-2 rounded-lg opacity-50">
                  <p className="text-xs text-stone-500 font-mono">{k.key_prefix}••••</p>
                  <p className="text-xs text-stone-400">{k.name}</p>
                  <span className="text-xs text-red-400 ml-auto">無効化済み</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* 新規生成フォーム */}
        {activeKeys.length < 5 && (
          <div className="border-t border-stone-100 pt-4 space-y-3">
            <p className="text-xs text-stone-500">新しいAPIキーを生成</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder="キーの名前（例: 本番用、MA連携用）"
                className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {generating ? '生成中...' : '+ 生成'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )}
        {activeKeys.length >= 5 && (
          <p className="text-xs text-amber-600 border-t border-stone-100 pt-3">
            上限（5個）に達しました。不要なキーを無効化してから新規生成してください。
          </p>
        )}
      </div>

      {/* エンドポイント情報 */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-2">
        <p className="text-xs font-semibold text-stone-600">APIエンドポイント</p>
        <code className="block text-xs text-stone-700 font-mono bg-white border border-stone-100 rounded-lg px-3 py-2">
          POST https://msg-scorer.vercel.app/api/v1/score
        </code>
        <p className="text-xs text-stone-400">
          1,000回/日の利用上限。超過時はHTTP 429を返します。
        </p>
        <Link href="/team/settings/api/docs" className="text-xs text-indigo-600 hover:underline inline-block mt-1">
          APIドキュメントを見る →
        </Link>
      </div>
    </div>
  );
}
