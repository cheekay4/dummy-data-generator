import type { AnalysisResult } from '@/lib/contract/types';
import { RiskGauge } from './risk-gauge';

interface SummaryTabProps {
  result: AnalysisResult;
}

export function SummaryTab({ result }: SummaryTabProps) {
  // riskScore = -1 means the input was not a contract
  if (result.riskScore < 0) {
    return (
      <div className="space-y-4">
        <div className="px-4 py-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg space-y-2">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            ⚠️ 契約書として認識できませんでした
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            入力されたテキストは契約書ではない可能性があります。契約書の全文または主要条項を貼り付けてください。
          </p>
          {result.summary && (
            <p className="text-sm text-muted-foreground border-t border-amber-200 dark:border-amber-800 pt-2 mt-2">
              {result.summary}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Contract type */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">契約書タイプ:</span>
        <span className="font-semibold">{result.contractType}</span>
      </div>

      {/* Risk score */}
      <div className="p-4 border rounded-lg">
        <p className="text-xs font-medium text-muted-foreground mb-3">リスクスコア</p>
        <RiskGauge score={result.riskScore} />
      </div>

      {/* Summary */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">要約</p>
        <p className="text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* Key points */}
      {result.keyPoints.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">重要ポイント</p>
          <div className="rounded-lg border divide-y">
            {result.keyPoints.map((kp, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground shrink-0 w-28">{kp.label}</span>
                <span>{kp.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing clauses */}
      {result.missingClauses.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">欠落している重要条項</p>
          <div className="space-y-2">
            {result.missingClauses.map((mc, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-md border text-sm ${
                  mc.importance === 'high'
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                }`}
              >
                <p className="font-medium">{mc.clause}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{mc.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
