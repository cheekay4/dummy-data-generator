'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { AUDIENCE_PRESETS } from '@/lib/presets';

const DEFAULT_GENDER = AUDIENCE_PRESETS['ec-general'].gender;

const inputClass =
  'w-20 text-right border border-stone-200 rounded-lg px-2 py-1 text-sm font-mono bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-150';

export default function GenderSliders() {
  const { audience, setAudience } = useScoringStore();
  const { female, male, other } = audience.gender;
  const totalRecipients = audience.totalRecipients;

  // Draft states for direct number editing
  const [draftFemaleCount, setDraftFemaleCount] = useState<string | null>(null);
  const [draftMaleCount, setDraftMaleCount]     = useState<string | null>(null);
  const [draftFemalePct, setDraftFemalePct]     = useState<string | null>(null);
  const [draftMalePct, setDraftMalePct]         = useState<string | null>(null);

  const femalePerson = Math.round((female / 100) * totalRecipients);
  const malePerson   = Math.round((male   / 100) * totalRecipients);

  const setFemale = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    const remaining = 100 - clamped;
    const ratio = male + other > 0 ? male / (male + other) : 0.85;
    const newMale  = Math.round(remaining * ratio);
    const newOther = remaining - newMale;
    setAudience({ ...audience, gender: { female: clamped, male: newMale, other: newOther } });
  };

  const setMale = (val: number) => {
    const clamped = Math.min(100 - female, Math.max(0, val));
    const newOther = Math.max(0, 100 - female - clamped);
    setAudience({ ...audience, gender: { female, male: clamped, other: newOther } });
  };

  const commitFemaleCount = () => {
    if (draftFemaleCount === null) return;
    const n = parseInt(draftFemaleCount, 10);
    if (!isNaN(n) && n >= 0 && totalRecipients > 0) {
      setFemale(Math.round((n / totalRecipients) * 100));
    }
    setDraftFemaleCount(null);
  };

  const commitMaleCount = () => {
    if (draftMaleCount === null) return;
    const n = parseInt(draftMaleCount, 10);
    if (!isNaN(n) && n >= 0 && totalRecipients > 0) {
      setMale(Math.round((n / totalRecipients) * 100));
    }
    setDraftMaleCount(null);
  };

  const commitFemalePct = () => {
    if (draftFemalePct === null) return;
    const n = parseFloat(draftFemalePct);
    if (!isNaN(n)) setFemale(n);
    setDraftFemalePct(null);
  };

  const commitMalePct = () => {
    if (draftMalePct === null) return;
    const n = parseFloat(draftMalePct);
    if (!isNaN(n)) setMale(n);
    setDraftMalePct(null);
  };

  const resetGender = () =>
    setAudience({ ...audience, gender: { ...DEFAULT_GENDER } });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">性別構成</p>
        <button
          onClick={resetGender}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          リセット
        </button>
      </div>

      <div className="space-y-2.5">
        {/* 女性 */}
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-sm text-stone-600">女性</span>
          <input
            type="range" min={0} max={100}
            value={female}
            onChange={(e) => setFemale(Number(e.target.value))}
            className="flex-1"
            style={{ accentColor: '#ec4899' }}
          />
          <input
            type="number" min={0}
            value={draftFemaleCount ?? femalePerson}
            onChange={(e) => setDraftFemaleCount(e.target.value)}
            onBlur={commitFemaleCount}
            onKeyDown={(e) => { if (e.key === 'Enter') commitFemaleCount(); }}
            className={inputClass}
            aria-label="女性 人数"
          />
          <span className="text-xs text-stone-400 shrink-0">人</span>
          <input
            type="number" min={0} max={100} step={0.1}
            value={draftFemalePct ?? parseFloat(female.toFixed(1))}
            onChange={(e) => setDraftFemalePct(e.target.value)}
            onBlur={commitFemalePct}
            onKeyDown={(e) => { if (e.key === 'Enter') commitFemalePct(); }}
            className={inputClass}
            aria-label="女性 割合"
          />
          <span className="text-xs text-stone-400 shrink-0">%</span>
        </div>

        {/* 男性 */}
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-sm text-stone-600">男性</span>
          <input
            type="range" min={0} max={100 - female}
            value={male}
            onChange={(e) => setMale(Number(e.target.value))}
            className="flex-1"
            style={{ accentColor: '#6366f1' }}
          />
          <input
            type="number" min={0}
            value={draftMaleCount ?? malePerson}
            onChange={(e) => setDraftMaleCount(e.target.value)}
            onBlur={commitMaleCount}
            onKeyDown={(e) => { if (e.key === 'Enter') commitMaleCount(); }}
            className={inputClass}
            aria-label="男性 人数"
          />
          <span className="text-xs text-stone-400 shrink-0">人</span>
          <input
            type="number" min={0} max={100 - female} step={0.1}
            value={draftMalePct ?? parseFloat(male.toFixed(1))}
            onChange={(e) => setDraftMalePct(e.target.value)}
            onBlur={commitMalePct}
            onKeyDown={(e) => { if (e.key === 'Enter') commitMalePct(); }}
            className={inputClass}
            aria-label="男性 割合"
          />
          <span className="text-xs text-stone-400 shrink-0">%</span>
        </div>

        {/* その他（自動計算） */}
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-sm text-stone-500">その他</span>
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full">
            <div className="h-1.5 bg-stone-300 rounded-full" style={{ width: `${other}%` }} />
          </div>
          <span className={`${inputClass} bg-stone-50 text-stone-400`} aria-label="その他 人数">
            {Math.round((other / 100) * totalRecipients)}
          </span>
          <span className="text-xs text-stone-400 shrink-0">人</span>
          <span className={`${inputClass} bg-stone-50 text-stone-400`} aria-label="その他 割合">
            {other}
          </span>
          <span className="text-xs text-stone-400 shrink-0">%</span>
        </div>
      </div>
    </div>
  );
}
