'use client';
import Link from 'next/link';
import { type HistoryRecord } from '@/lib/db/score-history';

const CHANNEL_LABELS: Record<string, string> = {
  'email-subject': '件名',
  'email-body':    '本文',
  'line':          'LINE',
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-100 text-emerald-700' :
    score >= 60 ? 'bg-indigo-100 text-indigo-700' :
    score >= 40 ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';
  return (
    <span className={`text-lg font-bold font-mono-score px-2 py-0.5 rounded-lg ${color}`}>
      {score}
    </span>
  );
}

export default function HistoryCard({ record }: { record: HistoryRecord }) {
  const date = new Date(record.created_at).toLocaleDateString('ja-JP', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const preview = record.subject || record.input_text;
  const truncated = preview.length > 60 ? preview.slice(0, 60) + '…' : preview;

  return (
    <Link href={`/history/${record.id}`}>
      <div className="bg-white border border-stone-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md font-medium">
                {CHANNEL_LABELS[record.channel] ?? record.channel}
              </span>
              <span className="text-xs text-stone-400">{date}</span>
              {record.actual_open_rate != null && (
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-medium">
                  実績あり
                </span>
              )}
            </div>
            <p className="text-sm text-stone-700 truncate">{truncated}</p>
            {record.audience.presetName && (
              <p className="text-xs text-stone-400 mt-1">{record.audience.presetName}</p>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <ScoreBadge score={record.result.totalScore} />
            <span className="text-stone-300 group-hover:text-indigo-400 transition-colors">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
