'use client';
import { useScoringStore } from '@/stores/scoring-store';
import { AGE_GROUP_COLORS } from '@/lib/constants';
import AgeSliderRow from './AgeSliderRow';
import {
  type AgeKey,
  calcTotal,
  calcTotalPersonCount,
  updateBySlider as _updateBySlider,
  updateDirect as _updateDirect,
  updateByPersonCount as _updateByPersonCount,
} from '@/lib/age-slider-logic';
import { AUDIENCE_PRESETS } from '@/lib/presets';

const AGE_GROUPS: { key: AgeKey; label: string }[] = [
  { key: 'under20',     label: '~19歳' },
  { key: 'twenties',    label: '20代' },
  { key: 'thirties',    label: '30代' },
  { key: 'forties',     label: '40代' },
  { key: 'fifties',     label: '50代~' },
  { key: 'sixtiesPlus', label: '60歳以上' },
];

const DEFAULT_AGE_DIST = AUDIENCE_PRESETS['ec-general'].ageDistribution;

export default function AgeSliders() {
  const { audience, setAudience } = useScoringStore();
  const dist = audience.ageDistribution;
  const total = calcTotal(dist);
  const totalRecipients = audience.totalRecipients;
  const isOver = total > 100;
  const isExact = Math.abs(total - 100) < 0.15;

  const updateBySlider = (key: AgeKey, val: number) =>
    setAudience({ ...audience, ageDistribution: _updateBySlider(dist, key, val) });

  const updateDirect = (key: AgeKey, pct: number) =>
    setAudience({ ...audience, ageDistribution: _updateDirect(dist, key, pct) });

  const updateByPersonCount = (key: AgeKey, count: number) =>
    setAudience({ ...audience, ageDistribution: _updateByPersonCount(dist, key, count, totalRecipients) });

  const resetAge = () =>
    setAudience({ ...audience, ageDistribution: { ...DEFAULT_AGE_DIST } });

  const totalPersonCount = calcTotalPersonCount(dist, totalRecipients);
  const remainingPct = parseFloat((100 - total).toFixed(1));
  const remainingCount = Math.round((remainingPct / 100) * totalRecipients);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">年代構成</p>
        <button
          onClick={resetAge}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          リセット
        </button>
      </div>

      <div className="space-y-2.5">
        {AGE_GROUPS.map(({ key, label }, i) => (
          <AgeSliderRow
            key={key}
            label={label}
            percent={dist[key]}
            totalRecipients={totalRecipients}
            color={AGE_GROUP_COLORS[i]}
            hasError={isOver}
            onSliderChange={(val) => updateBySlider(key, val)}
            onPersonCountChange={(count) => updateByPersonCount(key, count)}
            onPercentChange={(pct) => updateDirect(key, pct)}
          />
        ))}
      </div>

      {/* 合計表示 */}
      <div className={`mt-3 text-sm font-medium ${
        isOver ? 'text-red-500' : isExact ? 'text-emerald-600' : 'text-stone-500'
      }`}>
        合計: {totalPersonCount.toLocaleString('ja-JP')}人 / {total}%
        {isExact && ' ✅'}
        {!isOver && !isExact && ` （残り ${remainingPct}% · あと${remainingCount.toLocaleString('ja-JP')}人）`}
        {isOver && ' ⚠️ 100%を超えています'}
      </div>

      {/* エラーメッセージ */}
      {isOver && (
        <p className="mt-1.5 text-xs text-red-500">
          合計が100%を超えています（現在 {total}%）。各年代の割合を調整してください。
        </p>
      )}
      {!isOver && totalPersonCount > totalRecipients && (
        <p className="mt-1.5 text-xs text-red-500">
          合計が母数（{totalRecipients.toLocaleString('ja-JP')}人）を超えています。各年代の人数を調整してください。
        </p>
      )}
    </div>
  );
}
