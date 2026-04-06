'use client';
import { useState } from 'react';

interface Props {
  label: string;
  percent: number;
  totalRecipients: number;
  color: string;
  hasError: boolean;
  onPersonCountChange: (count: number) => void;
  onPercentChange: (pct: number) => void;
}

const inputClass = (hasError: boolean) =>
  `flex-1 min-w-[5rem] text-right border rounded-lg px-2 py-1 text-sm font-mono bg-white outline-none transition-all duration-150 ${
    hasError
      ? 'border-red-400 ring-2 ring-red-100'
      : 'border-stone-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
  }`;

export default function AgeSliderRow({
  label,
  percent,
  totalRecipients,
  color,
  hasError,
  onPersonCountChange,
  onPercentChange,
}: Props) {
  const personCount = Math.round((percent / 100) * totalRecipients);

  const [draftPerson, setDraftPerson] = useState<string | null>(null);
  const [draftPercent, setDraftPercent] = useState<string | null>(null);

  const commitPerson = () => {
    if (draftPerson === null) return;
    const n = parseInt(draftPerson, 10);
    if (!isNaN(n) && n >= 0) onPersonCountChange(n);
    setDraftPerson(null);
  };

  const commitPercent = () => {
    if (draftPercent === null) return;
    const n = parseFloat(draftPercent);
    if (!isNaN(n) && n >= 0) onPercentChange(n);
    setDraftPercent(null);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-sm text-stone-600" style={{ color }}>{label}</span>

      {/* 人数入力 */}
      <input
        type="number"
        min={0}
        value={draftPerson ?? personCount}
        onChange={(e) => setDraftPerson(e.target.value)}
        onBlur={commitPerson}
        onKeyDown={(e) => { if (e.key === 'Enter') commitPerson(); }}
        className={inputClass(hasError)}
        aria-label={`${label} 人数`}
      />
      <span className="text-xs text-stone-400 shrink-0">人</span>

      {/* パーセント入力 */}
      <input
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={draftPercent ?? parseFloat(percent.toFixed(1))}
        onChange={(e) => setDraftPercent(e.target.value)}
        onBlur={commitPercent}
        onKeyDown={(e) => { if (e.key === 'Enter') commitPercent(); }}
        className={inputClass(hasError)}
        aria-label={`${label} 割合`}
      />
      <span className="text-xs text-stone-400 shrink-0">%</span>
    </div>
  );
}
