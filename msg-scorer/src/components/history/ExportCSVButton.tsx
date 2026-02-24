'use client';
import { type HistoryRecord } from '@/lib/db/score-history';
import { generateHistoryCSV, downloadCSV } from '@/lib/csv-export';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

interface Props {
  records: HistoryRecord[];
}

export default function ExportCSVButton({ records }: Props) {
  const { isPro } = useUser();

  if (!isPro) {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-stone-400 text-sm cursor-pointer hover:border-indigo-300 hover:text-indigo-500 transition-colors"
        title="Proプランで利用可能"
      >
        ⬇ CSV出力 <span className="text-[10px] font-bold bg-indigo-100 text-indigo-500 px-1.5 py-0.5 rounded">PRO</span>
      </Link>
    );
  }

  function handleExport() {
    const csv = generateHistoryCSV(records);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `msgscore-history-${date}.csv`);
  }

  return (
    <button
      onClick={handleExport}
      disabled={records.length === 0}
      className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-stone-600 text-sm hover:bg-stone-50 transition-colors disabled:opacity-50"
    >
      ⬇ CSV出力
    </button>
  );
}
