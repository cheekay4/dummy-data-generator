'use client';
import { useScoringStore } from '@/stores/scoring-store';

export default function AdvancedSettings() {
  const { audience, setAudience } = useScoringStore();
  const { deviceMobile, existingCustomer, avgOpenRate, avgCtr } = audience.attributes;

  const update = (key: keyof typeof audience.attributes, val: number | undefined) => {
    setAudience({ ...audience, attributes: { ...audience.attributes, [key]: val } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-600 w-28 shrink-0">モバイル閲覧率</span>
          <input
            type="number" min={0} max={100} step={1}
            value={deviceMobile}
            onChange={(e) => update('deviceMobile', Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-24 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono-score text-stone-900 outline-none focus:border-indigo-400 transition-colors"
          />
          <span className="text-sm text-stone-500">%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-600 w-28 shrink-0">既存顧客率</span>
          <input
            type="number" min={0} max={100} step={1}
            value={existingCustomer}
            onChange={(e) => update('existingCustomer', Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-24 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono-score text-stone-900 outline-none focus:border-indigo-400 transition-colors"
          />
          <span className="text-sm text-stone-500">%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-600 w-28 shrink-0">過去平均開封率</span>
          <input
            type="number" min={0} max={100} step={0.1}
            value={avgOpenRate ?? ''}
            onChange={(e) => update('avgOpenRate', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="未入力"
            className="w-24 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono-score text-stone-900 outline-none focus:border-indigo-400 transition-colors"
          />
          <span className="text-sm text-stone-500">%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-600 w-28 shrink-0">過去平均CTR</span>
          <input
            type="number" min={0} max={100} step={0.1}
            value={avgCtr ?? ''}
            onChange={(e) => update('avgCtr', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="未入力"
            className="w-24 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono-score text-stone-900 outline-none focus:border-indigo-400 transition-colors"
          />
          <span className="text-sm text-stone-500">%</span>
        </div>
      </div>
      <p className="text-xs text-stone-400">空欄の場合は業界平均値で推定します</p>
    </div>
  );
}
