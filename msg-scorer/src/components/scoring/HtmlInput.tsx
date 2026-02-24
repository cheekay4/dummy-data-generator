'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { extractTextFromHtml } from '@/lib/input-extractors';

export default function HtmlInput() {
  const { setText } = useScoringStore();
  const [htmlRaw, setHtmlRaw] = useState('');
  const [preview, setPreview] = useState('');

  function handleExtract() {
    const extracted = extractTextFromHtml(htmlRaw);
    setPreview(extracted);
    setText(extracted);
  }

  return (
    <div className="space-y-3">
      <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
        <textarea
          value={htmlRaw}
          onChange={(e) => { setHtmlRaw(e.target.value); setPreview(''); }}
          placeholder="HTMLソースを貼り付けてください..."
          rows={6}
          className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300 p-4 rounded-xl min-h-[160px] font-mono"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-stone-400">
            &lt;style&gt; / &lt;script&gt; 除去 → タグ除去 → テキスト化
          </span>
          <button
            onClick={handleExtract}
            disabled={!htmlRaw.trim()}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            テキストを抽出
          </button>
        </div>
      </div>

      {preview && (
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
