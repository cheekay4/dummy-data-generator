'use client';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { PredictedImpact, ConversionGoal } from '@/lib/types';
import { CONVERSION_LABELS } from '@/lib/types';

interface Props {
  current: PredictedImpact;
  improved: PredictedImpact;
  conversionGoal: ConversionGoal;
  totalRecipients: number;
  presetName?: string;
}

function MetricRow({
  label,
  currentRate,
  currentCount,
  improvedRate,
  improvedCount,
  unit = '件',
}: {
  label: string;
  currentRate: number;
  currentCount: number;
  improvedRate: number;
  improvedCount: number;
  unit?: string;
}) {
  const diff = improvedCount - currentCount;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 現在 */}
      <div>
        <p className="text-xs text-stone-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold font-mono-score text-stone-800">
          <AnimatedNumber value={currentRate} decimals={1} /><span className="text-base font-normal">%</span>
        </p>
        <p className="text-sm font-mono-score text-stone-500">
          <AnimatedNumber value={currentCount} />{unit}
        </p>
      </div>
      {/* 改善後 */}
      <div>
        <p className="text-xs text-emerald-600 mb-0.5">{label}</p>
        <p className="text-2xl font-bold font-mono-score text-emerald-700">
          <AnimatedNumber value={improvedRate} decimals={1} /><span className="text-base font-normal">%</span>
        </p>
        <p className="text-sm font-mono-score text-emerald-600">
          <AnimatedNumber value={improvedCount} />{unit}
          {diff > 0 && (
            <span className="ml-1 text-xs font-bold text-emerald-600">
              +<AnimatedNumber value={diff} />{unit} ↑
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default function ImpactCard({ current, improved, conversionGoal, totalRecipients, presetName }: Props) {
  const isClick = conversionGoal === 'click';
  const convLabel = CONVERSION_LABELS[conversionGoal];
  const cvDiff = improved.conversionCount - current.conversionCount;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-outfit font-semibold text-stone-900 flex items-center gap-2">
          📈 予測インパクト
        </h3>
        <div className="text-right">
          <p className="text-xs text-stone-400">
            {presetName ?? 'カスタム'} ／ <span className="font-mono-score">{totalRecipients.toLocaleString('ja-JP')}</span>件
          </p>
          <p className="text-xs text-amber-700 font-medium mt-0.5">
            {convLabel.icon} {convLabel.name}
          </p>
        </div>
      </div>

      {/* 列ヘッダー */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-center text-xs font-medium text-stone-500">
          現在
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center text-xs font-medium text-emerald-600">
          改善後（A案）
        </div>
      </div>

      {/* メトリクス */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 space-y-4">
        <MetricRow
          label="開封率 / 開封数"
          currentRate={current.openRate}
          currentCount={current.openCount}
          improvedRate={improved.openRate}
          improvedCount={improved.openCount}
        />
        <div className="border-t border-stone-100" />
        <MetricRow
          label="CTR / クリック数"
          currentRate={current.ctr}
          currentCount={current.clickCount}
          improvedRate={improved.ctr}
          improvedCount={improved.clickCount}
        />
        {!isClick && (
          <>
            <div className="border-t border-stone-100" />
            <MetricRow
              label={`CVR / ${current.conversionLabel}`}
              currentRate={current.conversionRate}
              currentCount={current.conversionCount}
              improvedRate={improved.conversionRate}
              improvedCount={improved.conversionCount}
            />
          </>
        )}
      </div>

      {/* サマリー */}
      {cvDiff > 0 && (
        <p className="mt-4 text-sm text-indigo-700 bg-indigo-100 rounded-lg px-4 py-2 text-center">
          💡 改善案Aの適用で、約
          <span className="font-bold font-mono-score mx-1">+{cvDiff}</span>
          {isClick ? 'クリック' : current.conversionLabel}が見込めます
        </p>
      )}

      <p className="mt-3 text-xs text-stone-400 text-center">
        ⚠️ 推定値です。実際の数値は配信環境により異なります。
      </p>
    </div>
  );
}
