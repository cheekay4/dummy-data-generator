'use client';
import dynamic from 'next/dynamic';
import { type HistoryRecord } from '@/lib/db/score-history';
import { useUser } from '@/hooks/useUser';
import ProGate from '@/components/ui/ProGate';

const TrendChartInner = dynamic(() => import('./ScoreTrendChart'), { ssr: false });

interface Props {
  records: HistoryRecord[];
}

export default function ScoreTrend({ records }: Props) {
  const { isPro } = useUser();

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6">
      <h2 className="text-sm font-semibold text-stone-700 mb-4">📈 スコア推移</h2>
      <ProGate isPro={isPro} label="スコア推移はProプランの機能です">
        <TrendChartInner records={records} />
      </ProGate>
    </div>
  );
}
