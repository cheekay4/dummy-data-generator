'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { extractTextFromJson } from '@/lib/input-extractors';

const SAMPLE = `{
  "subject": "【期間限定】春の新作コスメが最大50%OFF",
  "body": "こんにちは。期間限定のセールが始まりました..."
}`;

export default function JsonInput() {
  const { setText } = useScoringStore();
  const [jsonRaw, setJsonRaw] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [showSample, setShowSample] = useState(false);

  function handleExtract() {
    setError('');
    const { text, error: err } = extractTextFromJson(jsonRaw);
    if (err) {
      setError(err);
      return;
    }
    setPreview(text);
    setText(text);
  }

  return (
    <div className="space-y-3">
      <div className={`border rounded-xl transition-all duration-200 focus-within:ring-2 ${
        error
          ? 'border-red-300 focus-within:ring-red-100'
          : 'border-stone-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'
      }`}>
        <textarea
          value={jsonRaw}
          onChange={(e) => { setJsonRaw(e.target.value); setError(''); setPreview(''); }}
          placeholder='{"subject": "件名", "body": "本文"}'
          rows={6}
          className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300 p-4 rounded-xl min-h-[160px] font-mono"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <button
            onClick={() => setShowSample(!showSample)}
            className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            {showSample ? '▲ サンプルを隠す' : '▼ サンプルを見る'}
          </button>
          <button
            onClick={handleExtract}
            disabled={!jsonRaw.trim()}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            テキストを抽出
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}

      {showSample && (
        <pre className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600 overflow-x-auto">
          {SAMPLE}
        </pre>
      )}

      {preview && !error && (
        <div>
          <p className="text-xs text-stone-500 mb-1.5">抽出プレビュー</p>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm text-stone-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
}
