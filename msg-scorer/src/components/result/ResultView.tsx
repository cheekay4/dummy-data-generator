'use client';
import dynamic from 'next/dynamic';
import { motion, type Variants } from 'framer-motion';
import { useScoringStore } from '@/stores/scoring-store';
import ScoreCircle from './ScoreCircle';
import ImpactCard from './ImpactCard';
import AxisFeedback from './AxisFeedback';
import ImprovementList from './ImprovementList';
import ABComparison from './ABComparison';
import CopyReportButton from './CopyReportButton';
import ShareButton from './ShareButton';
import NGWordWarning from './NGWordWarning';
import FeedbackWidget from './FeedbackWidget';
import LocalizePanel from './LocalizePanel';
import OptOutRiskBadge from './OptOutRiskBadge';
import { detectOptOutRisk } from '@/lib/opt-out-risk';

// SSR 非対応コンポーネント
const RadarChart   = dynamic(() => import('./RadarChart'), { ssr: false });
const PreviewPanel = dynamic(() => import('@/components/preview/PreviewPanel'), { ssr: false });

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      もう一度試す
    </button>
  );
}

export default function ResultView() {
  const { result, channel, text, subject, audience, historyId, shareToken, resetToInput } = useScoringStore();

  if (!result) return null;

  const optOutRisk = detectOptOutRisk(text, subject || undefined);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8"
    >
      {/* NGワード警告（最上位に表示） */}
      {(result.ngWordsFound?.length ?? 0) > 0 && (
        <motion.div variants={fadeUp}>
          <NGWordWarning ngWordsFound={result.ngWordsFound!} />
        </motion.div>
      )}

      {/* 配信停止リスク警告 */}
      {(optOutRisk.level !== 'low' || optOutRisk.reasons.length > 0) && (
        <motion.div variants={fadeUp}>
          <OptOutRiskBadge risk={optOutRisk} />
        </motion.div>
      )}

      {/* LINE 低評価警告（スコア40未満） */}
      {channel === 'line' && result.totalScore < 40 && (
        <motion.div variants={fadeUp}>
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
            <p className="font-medium text-sm text-amber-800 mb-1">
              ⚠️ LINE業界平均を大幅に下回る可能性があります
            </p>
            <p className="text-xs text-amber-700">
              LINEの業界平均開封率は約60%です。現在のスコア（{result.totalScore}点）では
              推定開封率が{result.currentImpact.openRate}%前後にとどまります。
              改善案を参考に内容を見直してください。
            </p>
          </div>
        </motion.div>
      )}

      {/* チーム最低スコアライン未達警告 */}
      {result.minScoreThreshold !== undefined && result.totalScore < result.minScoreThreshold && (
        <motion.div variants={fadeUp}>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
            <p className="font-medium text-sm mb-1">⚠️ チームの最低スコアライン未達</p>
            <p className="text-sm">
              スコア <span className="font-bold">{result.totalScore}/100</span> は、チームの最低ライン{' '}
              <span className="font-bold">{result.minScoreThreshold}</span> を下回っています。
              改善案を参考に修正してください。
            </p>
          </div>
        </motion.div>
      )}

      {/* 上部: もう一度試すボタン */}
      <motion.div variants={fadeUp}>
        <RetryButton onClick={resetToInput} />
      </motion.div>

      {/* スコア + レーダーチャート */}
      <motion.div variants={fadeUp}>
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
      </motion.div>

      {/* プレビュー（Pro機能） */}
      {(channel === 'email-subject' || channel === 'line') && (
        <motion.div variants={fadeUp}>
          <PreviewPanel />
        </motion.div>
      )}

      {/* 予測インパクト */}
      <motion.div variants={fadeUp}>
        <ImpactCard
          current={result.currentImpact}
          improved={result.improvedImpact}
          conversionGoal={audience.conversionGoal}
          totalRecipients={audience.totalRecipients}
          presetName={audience.presetName}
        />
      </motion.div>

      {/* 軸別フィードバック */}
      <motion.div variants={fadeUp}>
        <AxisFeedback axes={result.axes} />
      </motion.div>

      {/* 改善提案 */}
      <motion.div variants={fadeUp}>
        <ImprovementList improvements={result.improvements} />
      </motion.div>

      {/* A/B テスト案 */}
      <motion.div variants={fadeUp}>
        <ABComparison variants={result.abVariants} conversionGoal={audience.conversionGoal} />
      </motion.div>

      {/* 海外向けリメイク（ブログ・SNSのみ） */}
      {channel === 'blog-sns' && (
        <motion.div variants={fadeUp}>
          <LocalizePanel />
        </motion.div>
      )}

      {/* 下部: もう一度試すボタン */}
      <motion.div variants={fadeUp} className="flex items-center justify-between border-t border-stone-100 pt-6">
        <RetryButton onClick={resetToInput} />
        <p className="text-xs text-stone-400">入力内容は保持されます</p>
      </motion.div>

      {/* レポートコピー */}
      <motion.div variants={fadeUp}>
        <CopyReportButton result={result} channel={channel} audience={audience} />
      </motion.div>

      {/* シェア（履歴保存済みの場合） */}
      {historyId && shareToken && (
        <motion.div variants={fadeUp} className="flex justify-center gap-3 flex-wrap">
          <ShareButton shareToken={shareToken} />
          <a
            href="/history"
            className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-stone-600 text-sm hover:bg-stone-50 transition-colors"
          >
            📋 履歴を見る
          </a>
        </motion.div>
      )}

      {/* フィードバック */}
      <motion.div variants={fadeUp}>
        <FeedbackWidget historyId={historyId ?? null} />
      </motion.div>
    </motion.div>
  );
}
