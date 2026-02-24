'use client';
import { type HistoryRecord } from '@/lib/db/score-history';
import HistoryCard from './HistoryCard';

export default function HistoryList({ records }: { records: HistoryRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">まだ履歴がありません</p>
        <p className="text-xs mt-1">スコアリングを実行すると、ここに記録されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((r) => (
        <HistoryCard key={r.id} record={r} />
      ))}
    </div>
  );
}
