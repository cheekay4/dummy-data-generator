import { type HistoryRecord } from '@/lib/db/score-history';

interface Props {
  record: HistoryRecord;
}

function Row({ label, predicted, actual }: { label: string; predicted: number | null; actual: number | null }) {
  if (predicted == null && actual == null) return null;

  const diff = predicted != null && actual != null ? actual - predicted : null;
  const diffColor = diff == null ? '' : diff >= 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="grid grid-cols-3 gap-2 text-sm py-2 border-b border-stone-100 last:border-0">
      <span className="text-stone-500 text-xs">{label}</span>
      <span className="text-stone-700 text-xs text-center">{predicted != null ? `${predicted}%` : '-'}</span>
      <div className="flex items-center gap-1">
        <span className="text-stone-700 text-xs">{actual != null ? `${actual}%` : '-'}</span>
        {diff != null && (
          <span className={`text-xs ${diffColor}`}>
            ({diff >= 0 ? '+' : ''}{diff.toFixed(1)})
          </span>
        )}
      </div>
    </div>
  );
}

export default function PredictionVsActual({ record }: Props) {
  const { result, actual_open_rate, actual_ctr, actual_conversion_rate } = record;

  if (actual_open_rate == null && actual_ctr == null && actual_conversion_rate == null) return null;

  return (
    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
      <h4 className="text-xs font-semibold text-stone-700 mb-3">予測 vs 実績</h4>
      <div className="grid grid-cols-3 gap-2 mb-1">
        <span className="text-xs text-stone-400">指標</span>
        <span className="text-xs text-stone-400 text-center">予測</span>
        <span className="text-xs text-stone-400">実績 (差異)</span>
      </div>
      <Row label="開封率" predicted={result.currentImpact.openRate} actual={actual_open_rate} />
      <Row label="CTR"    predicted={result.currentImpact.ctr}       actual={actual_ctr} />
      <Row label="CV率"   predicted={result.currentImpact.conversionRate} actual={actual_conversion_rate} />
    </div>
  );
}
