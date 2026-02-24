'use client';
import dynamic from 'next/dynamic';
import { type HistoryRecord } from '@/lib/db/score-history';
import ScoreCircle from '@/components/result/ScoreCircle';
import ImpactCard from '@/components/result/ImpactCard';
import AxisFeedback from '@/components/result/AxisFeedback';
import ImprovementList from '@/components/result/ImprovementList';
import ABComparison from '@/components/result/ABComparison';
import ShareButton from '@/components/result/ShareButton';
import ActualResultsForm from '@/components/history/ActualResultsForm';
import PredictionVsActual from '@/components/history/PredictionVsActual';

const RadarChart = dynamic(() => import('@/components/result/RadarChart'), { ssr: false });

const CHANNEL_LABELS: Record<string, string> = {
  'email-subject': 'メール件名',
  'email-body':    'メール本文',
  'line':          'LINE配信文',
};

export default function HistoryDetailClient({ record }: { record: HistoryRecord }) {
  const { result, audience, channel } = record;
  const date = new Date(record.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="space-y-8">
      {/* ヘッダー情報 */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-600 rounded-md font-medium">
            {CHANNEL_LABELS[channel] ?? channel}
          </span>
          <span className="text-xs text-stone-400">{date}</span>
        </div>
        <p className="text-sm text-stone-700">
          {record.subject ? (
            <><span className="font-medium">件名:</span> {record.subject}</>
          ) : (
            record.input_text.slice(0, 100) + (record.input_text.length > 100 ? '…' : '')
          )}
        </p>
      </div>

      {/* スコア + レーダーチャート */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="shrink-0">
          <p className="text-xs text-stone-400 text-center mb-3 uppercase tracking-wider">総合スコア</p>
          <ScoreCircle score={result.totalScore} />
        </div>
        <div className="flex-1 w-full">
          <p className="text-xs text-stone-400 text-center mb-1 uppercase tracking-wider">5軸評価</p>
          <RadarChart axes={result.axes} />
        </div>
      </div>

      {/* 予測インパクト */}
      <ImpactCard
        current={result.currentImpact}
        improved={result.improvedImpact}
        conversionGoal={audience.conversionGoal}
        totalRecipients={audience.totalRecipients}
        presetName={audience.presetName}
      />

      {/* 軸別フィードバック */}
      <AxisFeedback axes={result.axes} />

      {/* 改善提案 */}
      <ImprovementList improvements={result.improvements} />

      {/* A/B テスト案 */}
      <ABComparison variants={result.abVariants} conversionGoal={audience.conversionGoal} />

      {/* 予測 vs 実績 */}
      <PredictionVsActual record={record} />

      {/* 実績入力 */}
      <ActualResultsForm record={record} />

      {/* シェアボタン */}
      <div className="flex justify-center pt-2">
        <ShareButton shareToken={record.share_token} />
      </div>
    </div>
  );
}
