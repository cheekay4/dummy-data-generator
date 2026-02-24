'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';

export default function RecipientInput() {
  const { audience, setAudience } = useScoringStore();
  const [focused, setFocused] = useState(false);

  const displayValue = focused
    ? String(audience.totalRecipients)
    : audience.totalRecipients.toLocaleString('ja-JP');

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-stone-700 shrink-0">配信母数</label>
      <div className="flex items-center border border-stone-200 rounded-lg focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200 px-3 py-2">
        <input
          type={focused ? 'number' : 'text'}
          min={100}
          step={1000}
          value={displayValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n) && n > 0) {
              setAudience({ ...audience, totalRecipients: n });
            }
          }}
          className="w-28 bg-transparent outline-none text-right font-mono-score text-stone-900 text-sm"
        />
        <span className="text-sm text-stone-500 ml-2 shrink-0">件</span>
      </div>
      <p className="text-xs text-stone-400">配信リストの件数を入力してください</p>
    </div>
  );
}
