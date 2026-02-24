'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';

const MARKETS = [
  { value: 'US',  locale: 'en-US', label: '🇺🇸 北米（英語）' },
  { value: 'UK',  locale: 'en-GB', label: '🇬🇧 英国（英語）' },
  { value: 'AU',  locale: 'en-AU', label: '🇦🇺 オーストラリア（英語）' },
  { value: 'SG',  locale: 'en-SG', label: '🇸🇬 シンガポール（英語）' },
] as const;

export default function LocalizePanel() {
  const { text, subject } = useScoringStore();
  const [market, setMarket] = useState<typeof MARKETS[number]>(MARKETS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    remade: string;
    notes: string[];
    toneUsed: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fullText = subject ? `${subject}\n\n${text}` : text;

  async function generate() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          targetLocale: market.locale,
          targetMarket: market.value,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'エラーが発生しました'); return; }
      setResult(data);
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!result) return;
    await navigator.clipboard.writeText(result.remade);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌐</span>
        <div>
          <p className="text-sm font-semibold text-indigo-900">海外向けリメイク</p>
          <p className="text-xs text-indigo-600">単純な翻訳ではなく、海外の商慣習に合わせてリメイクします</p>
        </div>
      </div>

      {/* マーケット選択 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-stone-600 shrink-0">対象市場:</span>
        <select
          value={market.value}
          onChange={(e) => {
            const m = MARKETS.find(m => m.value === e.target.value);
            if (m) setMarket(m);
          }}
          className="text-sm border border-indigo-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {MARKETS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={loading || !fullText.trim()}
          className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '生成中...' : '海外版を生成'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* 結果表示 */}
      {result && (
        <div className="space-y-3">
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                {market.label} 向けリメイク
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">トーン: {result.toneUsed}</span>
                <button
                  onClick={copyText}
                  className="text-xs px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors"
                >
                  {copied ? '✓ コピー済み' : 'コピー'}
                </button>
              </div>
            </div>
            <p className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">{result.remade}</p>
          </div>

          {/* 適応ポイント */}
          <div className="bg-white/70 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">適応ポイント</p>
            <ul className="space-y-1.5">
              {result.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                  <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
