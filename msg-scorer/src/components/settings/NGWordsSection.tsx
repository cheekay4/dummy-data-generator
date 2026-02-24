'use client';
import { useState } from 'react';
import { DEFAULT_NG_WORDS } from '@/lib/ng-words';

interface Props {
  initialWords: string[];
}

export default function NGWordsSection({ initialWords }: Props) {
  const [words, setWords] = useState<string[]>(initialWords);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addWord() {
    const w = input.trim();
    if (!w || words.includes(w)) return;
    setWords([...words, w]);
    setInput('');
  }

  function removeWord(w: string) {
    setWords(words.filter((x) => x !== w));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/settings/ng-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="font-semibold text-stone-800 mb-1">NGワード設定</h2>
      <p className="text-xs text-stone-400 mb-4">スコアリング時に景表法リスクとして検出するワードを追加できます</p>

      {/* デフォルトワード */}
      <div className="mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">共通NGワード（変更不可）</p>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_NG_WORDS.map((w) => (
            <span key={w} className="px-2 py-1 bg-stone-100 text-stone-500 text-xs rounded-lg">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* カスタムワード */}
      <div>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">カスタム NGワード</p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWord())}
            placeholder="単語を入力"
            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            onClick={addWord}
            disabled={!input.trim()}
            className="px-3 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            追加
          </button>
        </div>

        {words.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {words.map((w) => (
              <span key={w} className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg">
                {w}
                <button
                  onClick={() => removeWord(w)}
                  className="text-amber-400 hover:text-amber-600 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 mb-4">カスタムNGワードは設定されていません</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saved ? '✓ 保存しました' : saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
