'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { extractTextFromLineJson } from '@/lib/input-extractors';

const SAMPLE = `{
  "type": "text",
  "text": "春のキャンペーン開催中！今月末まで全品20%OFF🌸\\n詳しくはこちら👇"
}`;

export default function LineJsonInput() {
  const { setText } = useScoringStore();
  const [jsonRaw, setJsonRaw] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [showSample, setShowSample] = useState(false);

  function handleExtract() {
    setError('');
    const { text, error: err } = extractTextFromLineJson(jsonRaw);
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
          placeholder='{"type": "text", "text": "..."}'
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
        <div>
          <p className="text-xs text-stone-400 mb-1">
            text / flex / template タイプに対応。配列と単一オブジェクト両方OK
          </p>
          <pre className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600 overflow-x-auto">
            {SAMPLE}
          </pre>
        </div>
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
