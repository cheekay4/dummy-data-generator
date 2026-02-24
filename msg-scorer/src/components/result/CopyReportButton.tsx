'use client';
import { useState } from 'react';
import { ScoreResponse, Channel, AudienceSegment, CONVERSION_LABELS } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

interface Props {
  result: ScoreResponse;
  channel: Channel;
  audience: AudienceSegment;
}

function fmt(n: number, decimals = 0): string {
  return decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
}

function buildReport(result: ScoreResponse, channel: Channel, audience: AudienceSegment): string {
  const { totalScore, axes, improvements, currentImpact, improvedImpact } = result;
  const convLabel = CONVERSION_LABELS[audience.conversionGoal];
  const isClick = audience.conversionGoal === 'click';

  const axisLines = axes
    .map((a) => `  ${a.name.padEnd(10)}: ${a.score}/100`)
    .join('\n');

  const currentLines = [
    `    開封率 ${fmt(currentImpact.openRate, 1)}%（${fmt(currentImpact.openCount)}件）`,
    `    CTR ${fmt(currentImpact.ctr, 1)}%（${fmt(currentImpact.clickCount)}件）`,
    ...(!isClick ? [`    ${currentImpact.conversionLabel} ${fmt(currentImpact.conversionCount)}件（CVR ${fmt(currentImpact.conversionRate, 1)}%）`] : []),
  ].join('\n');

  const improvedLines = [
    `    開封率 ${fmt(improvedImpact.openRate, 1)}%（${fmt(improvedImpact.openCount)}件）`,
    `    CTR ${fmt(improvedImpact.ctr, 1)}%（${fmt(improvedImpact.clickCount)}件）`,
    ...(!isClick ? [`    ${improvedImpact.conversionLabel} ${fmt(improvedImpact.conversionCount)}件（CVR ${fmt(improvedImpact.conversionRate, 1)}%）`] : []),
  ].join('\n');

  const openDiff = improvedImpact.openCount - currentImpact.openCount;
  const cvDiff   = improvedImpact.conversionCount - currentImpact.conversionCount;

  return `📊 MsgScore レポート
━━━━━━━━━━━━━━━━━━━━
チャネル: ${CHANNEL_LABELS[channel].name}
配信目的: ${convLabel.name}
セグメント: ${audience.presetName ?? 'カスタム設定'}（配信母数: ${audience.totalRecipients.toLocaleString('ja-JP')}件）

■ 総合スコア: ${totalScore}/100

■ 5軸評価
${axisLines}

■ 予測インパクト
  現在:
${currentLines}
  改善後:
${improvedLines}
  改善効果: +${openDiff}件の開封${!isClick ? ` / +${cvDiff}件の${currentImpact.conversionLabel}` : ''}

■ 改善提案
${improvements.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

※ MsgScore (msgscore.jp) で生成`;
}

export default function CopyReportButton({ result, channel, audience }: Props) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  const handleCopy = async () => {
    const text = buildReport(result, channel, audience);
    await navigator.clipboard.writeText(text);
    setState('copied');
    trackEvent('report_copied', { total_score: result.totalScore });
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button
      onClick={() => void handleCopy()}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
        state === 'copied'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
      }`}
    >
      {state === 'copied' ? '📋 レポートをコピーしました ✓' : '📋 レポートをコピー'}
    </button>
  );
}
