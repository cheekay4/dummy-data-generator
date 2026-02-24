import type { AnalysisResult } from '@/lib/contract/types';
import { RiskCard } from './risk-card';

interface RisksTabProps {
  result: AnalysisResult;
}

const RISK_ORDER = { high: 0, medium: 1, low: 2 };

export function RisksTab({ result }: RisksTabProps) {
  const sorted = [...result.risks].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-3xl mb-3">🟢</p>
        <p className="font-medium">リスクのある条項は検出されませんでした</p>
      </div>
    );
  }

  const highCount = sorted.filter((r) => r.riskLevel === 'high').length;
  const mediumCount = sorted.filter((r) => r.riskLevel === 'medium').length;
  const lowCount = sorted.filter((r) => r.riskLevel === 'low').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        {highCount > 0 && (
          <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
            🔴 高リスク {highCount}件
          </span>
        )}
        {mediumCount > 0 && (
          <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
            🟡 中リスク {mediumCount}件
          </span>
        )}
        {lowCount > 0 && (
          <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
            🔵 低リスク {lowCount}件
          </span>
        )}
      </div>
      <div className="space-y-4">
        {sorted.map((risk, i) => (
          <RiskCard key={i} risk={risk} />
        ))}
      </div>
    </div>
  );
}
