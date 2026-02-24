'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTeam } from '@/hooks/useTeam';
import type { ImportBatch } from '@/lib/types';

export default function ImportHistoryPage() {
  const { team, isOwner, loading } = useTeam();
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<{ id: string; content: string; created_at: string }[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!team) return;
    fetch('/api/team/import/history')
      .then(r => r.json())
      .then((d: { batches?: ImportBatch[] }) => setBatches(d.batches ?? []))
      .finally(() => setFetching(false));
  }, [team]);

  async function handleViewAnalysis(batchId: string) {
    if (selectedBatch === batchId) { setSelectedBatch(null); return; }
    setSelectedBatch(batchId);
    const res = await fetch(`/api/team/import/history?batchId=${batchId}`, { method: 'PATCH' });
    const d = await res.json() as { knowledge?: { id: string; content: string; created_at: string }[] };
    setKnowledge(d.knowledge ?? []);
  }

  async function handleDelete(batchId: string) {
    if (!confirm('このインポートバッチのデータを削除しますか？')) return;
    setDeleting(batchId);
    await fetch(`/api/team/import/history?batchId=${batchId}`, { method: 'DELETE' });
    setBatches(prev => prev.filter(b => b.import_batch_id !== batchId));
    if (selectedBatch === batchId) setSelectedBatch(null);
    setDeleting(null);
  }

  if (loading || fetching) return <div className="p-8 text-stone-500">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">📥 インポート履歴</h1>
        <Link href="/team/import" className="text-sm text-indigo-600 hover:underline">← 新規インポート</Link>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <p className="text-4xl mb-3">📭</p>
          <p>まだインポート履歴がありません。</p>
          <Link href="/team/import" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
            最初のインポートを実行する →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map(batch => (
            <div key={batch.import_batch_id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-800">
                    {new Date(batch.imported_at).toLocaleDateString('ja-JP')}
                    <span className="ml-2 text-sm text-stone-500">{batch.count}件</span>
                  </p>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">{batch.import_batch_id.slice(0, 8)}...</p>
                </div>
                <div className="flex items-center gap-2">
                  {batch.has_analysis && (
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">分析済み ✅</span>
                  )}
                  {batch.has_analysis && (
                    <button
                      onClick={() => handleViewAnalysis(batch.import_batch_id)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      {selectedBatch === batch.import_batch_id ? '閉じる' : '分析結果を見る'}
                    </button>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(batch.import_batch_id)}
                      disabled={deleting === batch.import_batch_id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      {deleting === batch.import_batch_id ? '削除中...' : 'データを削除'}
                    </button>
                  )}
                </div>
              </div>

              {selectedBatch === batch.import_batch_id && knowledge.length > 0 && (
                <div className="border-t border-stone-100 bg-stone-50 p-4">
                  <p className="text-xs font-semibold text-stone-600 mb-2">🧠 AI分析インサイト</p>
                  <div className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed">
                    {knowledge[0]?.content ?? '（分析結果なし）'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
