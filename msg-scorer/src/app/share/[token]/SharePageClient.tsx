'use client';
import dynamic from 'next/dynamic';
import { type HistoryRecord } from '@/lib/db/score-history';
import ScoreCircle from '@/components/result/ScoreCircle';
import ImpactCard from '@/components/result/ImpactCard';
import AxisFeedback from '@/components/result/AxisFeedback';
import ImprovementList from '@/components/result/ImprovementList';
import ABComparison from '@/components/result/ABComparison';
import Link from 'next/link';

const RadarChart = dynamic(() => import('@/components/result/RadarChart'), { ssr: false });

const CHANNEL_LABELS: Record<string, string> = {
  'email-subject': 'メール件名',
  'email-body':    'メール本文',
  'line':          'LINE配信文',
};

export default function SharePageClient({ record }: { record: HistoryRecord }) {
  const { result, audience, channel } = record;
  const date = new Date(record.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 共有バナー */}
      <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
        <p className="text-xs text-indigo-500 mb-1">MsgScore でシェアされた結果</p>
        <h1 className="font-outfit font-bold text-lg text-stone-900">
          {CHANNEL_LABELS[channel] ?? channel} — スコアリング結果
        </h1>
        <p className="text-xs text-stone-400 mt-1">{date}</p>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="shrink-0">
            <p className="text-xs text-stone-400 text-center mb-3 uppercase tracking-wider">総合スコア</p>
            <ScoreCircle score={result.totalScore} />
          </div>
          <div className="flex-1 w-full">
            <RadarChart axes={result.axes} />
          </div>
        </div>

        <ImpactCard
          current={result.currentImpact}
          improved={result.improvedImpact}
          conversionGoal={audience.conversionGoal}
          totalRecipients={audience.totalRecipients}
          presetName={audience.presetName}
        />
        <AxisFeedback axes={result.axes} />
        <ImprovementList improvements={result.improvements} />
        <ABComparison variants={result.abVariants} conversionGoal={audience.conversionGoal} />
      </div>

      <div className="mt-10 text-center border-t border-stone-100 pt-8">
        <p className="text-sm text-stone-500 mb-3">あなたのメッセージも採点してみませんか？</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          MsgScore を試す（無料）
        </Link>
      </div>
    </div>
  );
}
