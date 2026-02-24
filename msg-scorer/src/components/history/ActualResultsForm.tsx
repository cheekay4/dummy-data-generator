'use client';
import { useState } from 'react';
import { type HistoryRecord } from '@/lib/db/score-history';

interface Props {
  record: HistoryRecord;
}

export default function ActualResultsForm({ record }: Props) {
  const [openRate, setOpenRate] = useState(record.actual_open_rate?.toString() ?? '');
  const [ctr, setCtr] = useState(record.actual_ctr?.toString() ?? '');
  const [convRate, setConvRate] = useState(record.actual_conversion_rate?.toString() ?? '');
  const [convCount, setConvCount] = useState(record.actual_conversion_count?.toString() ?? '');
  const [note, setNote] = useState(record.actual_note ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/history/${record.id}/actual`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actual_open_rate:         openRate    ? Number(openRate)    : null,
          actual_ctr:               ctr         ? Number(ctr)         : null,
          actual_conversion_rate:   convRate    ? Number(convRate)    : null,
          actual_conversion_count:  convCount   ? Number(convCount)   : null,
          actual_note:              note || null,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
      <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
        📊 実績入力（任意）
      </h3>
      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '実績開封率 (%)', value: openRate, set: setOpenRate },
            { label: '実績CTR (%)',    value: ctr,       set: setCtr },
            { label: '実績CV率 (%)',   value: convRate,  set: setConvRate },
            { label: '実績CV数',       value: convCount, set: setConvCount },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-xs text-stone-500 mb-1">{label}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">メモ</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例: 月曜朝8時配信"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saved ? '✓ 保存しました' : saving ? '保存中...' : '実績を保存'}
        </button>
      </form>
    </div>
  );
}
