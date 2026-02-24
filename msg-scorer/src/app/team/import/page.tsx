'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Papa from 'papaparse';
import { useTeam } from '@/hooks/useTeam';
import { parseCsvText } from '@/lib/csv-import';
import type { CsvParseResult } from '@/lib/types';

export default function TeamImportPage() {
  const { team, myMember, isOwner, loading } = useTeam();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [filename, setFilename] = useState('');
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  if (loading) return <div className="p-8 text-stone-500">読み込み中...</div>;
  if (!team) return <div className="p-8 text-stone-500">チームに所属していません。</div>;
  if (!isOwner) return <div className="p-8 text-stone-500">管理者のみアクセスできます。</div>;

  // Team Pro ゲーティング
  if (team.plan !== 'team_pro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden border border-stone-200">
          <div className="blur-sm pointer-events-none p-8 space-y-4">
            <h1 className="text-2xl font-bold text-stone-900">📥 配信実績インポート</h1>
            <p className="text-stone-500">過去の配信実績CSVをインポートしてスコアリング精度を向上させます。</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center space-y-3 p-8">
              <p className="text-lg font-semibold text-stone-800">Team Proプランが必要です</p>
              <p className="text-sm text-stone-500">CSVインポート、Slack連携、外部APIはTeam Proプランでご利用いただけます。</p>
              <Link href="/pricing" className="inline-block mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Team Proにアップグレード
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('CSVファイルを選択してください。');
      return;
    }
    setFilename(file.name);
    setError('');
    setParseResult(null);
    setDone(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const result = parseCsvText(text);
        setParseResult(result);
      } catch {
        setError('CSVのパースに失敗しました。ファイルを確認してください。');
      }
    };
    // UTF-8 で読み込み（Shift-JIS の場合は文字化けするが許容）
    reader.readAsText(file, 'UTF-8');
  }

  async function handleImport() {
    if (!parseResult || parseResult.records.length === 0) return;
    setImporting(true);
    setError('');

    try {
      const res = await fetch('/api/team/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: parseResult.records, filename }),
      });
      const data = await res.json() as { success?: boolean; batchId?: string; error?: string };
      if (!data.success) throw new Error(data.error ?? 'インポート失敗');

      // 非同期で傾向分析を実行
      setImporting(false);
      setAnalyzing(true);
      const analyzeRes = await fetch('/api/team/import/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: data.batchId }),
      });
      if (!analyzeRes.ok) {
        // 分析失敗はサイレント（インポート自体は成功）
      }

      setAnalyzing(false);
      setDone(true);
    } catch (e) {
      setImporting(false);
      setAnalyzing(false);
      setError(e instanceof Error ? e.message : 'エラーが発生しました。');
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-stone-900">インポート完了！</h2>
        <p className="text-stone-500">実績データがインポートされ、組織ナレッジとして活用されます。</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setDone(false); setParseResult(null); setFilename(''); }} className="px-4 py-2 border border-stone-300 rounded-xl text-sm text-stone-700 hover:bg-stone-50">
            続けてインポート
          </button>
          <Link href="/team/import/history" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
            インポート履歴を確認
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">📥 配信実績インポート</h1>
        <Link href="/team/import/history" className="text-sm text-indigo-600 hover:underline">履歴を見る →</Link>
      </div>

      <p className="text-sm text-stone-500">
        過去の配信実績をインポートして、組織のナレッジを強化しましょう。インポートした実績はスコアリングの精度向上に活用されます。
      </p>

      {/* ドロップゾーン */}
      {!parseResult && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-stone-300 hover:border-indigo-300 bg-stone-50'}`}
        >
          <div className="text-4xl mb-3">📄</div>
          <p className="text-stone-600 font-medium mb-1">ここにCSVファイルをドロップ</p>
          <p className="text-stone-400 text-sm mb-4">または</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            ファイルを選択
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <p className="text-xs text-stone-400 mt-3">対応形式: CSV (UTF-8 / Shift-JIS)</p>
          <a href="/api/team/import/template" className="text-xs text-indigo-500 hover:underline mt-1 inline-block">
            テンプレートをダウンロード
          </a>
        </div>
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>}

      {/* プレビュー */}
      {parseResult && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-stone-800">📊 インポートプレビュー</h2>
            <p className="text-sm text-stone-600">
              ファイル: <span className="font-mono text-stone-800">{filename}</span>
            </p>
            <p className="text-sm text-stone-600">
              有効行数:{' '}
              <span className="font-semibold text-emerald-600">{parseResult.summary.validRows}件</span>
              {' '}/ 全{parseResult.summary.totalRows}行
              {parseResult.summary.invalidRows > 0 && (
                <span className="text-amber-600 ml-1">（{parseResult.summary.invalidRows}件スキップ）</span>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500 mb-1">チャネル</p>
                <p>メール {parseResult.summary.channels.email}件 / LINE {parseResult.summary.channels.line}件</p>
              </div>
              {parseResult.summary.dateRange && (
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">期間</p>
                  <p className="font-mono text-xs">{parseResult.summary.dateRange.from} 〜 {parseResult.summary.dateRange.to}</p>
                </div>
              )}
              {parseResult.summary.avgOpenRate.email != null && (
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">平均開封率</p>
                  <p>メール {parseResult.summary.avgOpenRate.email}%
                    {parseResult.summary.avgOpenRate.line != null && ` / LINE ${parseResult.summary.avgOpenRate.line}%`}
                  </p>
                </div>
              )}
              {parseResult.summary.avgCtr.email != null && (
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">平均CTR</p>
                  <p>メール {parseResult.summary.avgCtr.email}%
                    {parseResult.summary.avgCtr.line != null && ` / LINE ${parseResult.summary.avgCtr.line}%`}
                  </p>
                </div>
              )}
            </div>

            {/* スキップ行 */}
            {parseResult.errors.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-amber-700">スキップされた行</p>
                {parseResult.errors.slice(0, 5).map((e, i) => (
                  <p key={i} className="text-xs text-amber-600">行{e.row}: {e.message}</p>
                ))}
                {parseResult.errors.length > 5 && (
                  <p className="text-xs text-amber-500">他 {parseResult.errors.length - 5} 件...</p>
                )}
              </div>
            )}

            {/* プレビューテーブル */}
            {parseResult.records.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-1 text-stone-500">日付</th>
                      <th className="text-left py-1 text-stone-500">CH</th>
                      <th className="text-left py-1 text-stone-500 max-w-[120px]">件名/本文</th>
                      <th className="text-right py-1 text-stone-500">開封率</th>
                      <th className="text-right py-1 text-stone-500">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.records.slice(0, 5).map((r, i) => (
                      <tr key={i} className="border-b border-stone-100">
                        <td className="py-1 font-mono">{r.date ?? '-'}</td>
                        <td className="py-1">{r.channel}</td>
                        <td className="py-1 max-w-[120px] truncate">{r.subject ?? r.body ?? '-'}</td>
                        <td className="py-1 text-right">{r.open_rate != null ? `${r.open_rate}%` : '-'}</td>
                        <td className="py-1 text-right">{r.ctr != null ? `${r.ctr}%` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parseResult.records.length > 5 && (
                  <p className="text-xs text-stone-400 mt-1">... 他 {parseResult.records.length - 5} 件</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setParseResult(null); setFilename(''); }}
              className="flex-1 py-3 border border-stone-300 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleImport}
              disabled={importing || analyzing || parseResult.records.length === 0}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importing ? '保存中...' : analyzing ? '🧠 傾向分析中...' : 'インポートを実行'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
