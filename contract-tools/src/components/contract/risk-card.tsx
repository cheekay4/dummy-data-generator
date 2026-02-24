import type { RiskItem } from '@/lib/contract/types';

interface RiskCardProps {
  risk: RiskItem;
}

const LEVEL_STYLES = {
  high: {
    badge: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    border: 'border-red-200 dark:border-red-800',
    label: '🔴 高リスク',
  },
  medium: {
    badge: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    border: 'border-amber-200 dark:border-amber-800',
    label: '🟡 中リスク',
  },
  low: {
    badge: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    border: 'border-blue-200 dark:border-blue-800',
    label: '🔵 低リスク',
  },
};

export function RiskCard({ risk }: RiskCardProps) {
  const style = LEVEL_STYLES[risk.riskLevel];

  return (
    <div className={`rounded-lg border ${style.border} overflow-hidden`}>
      <div className={`px-4 py-2.5 flex items-center gap-2 border-b ${style.badge}`}>
        <span className="text-xs font-semibold">{style.label}</span>
        <span className="text-xs font-medium">
          {risk.articleNumber} {risk.articleTitle}
        </span>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">【該当箇所】</p>
          <blockquote className="border-l-2 border-muted pl-3 text-muted-foreground text-xs leading-relaxed italic">
            {risk.excerpt}
          </blockquote>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">【問題点】</p>
          <p className="text-sm">{risk.issue}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">【改善案】</p>
          <p className="text-sm bg-green-50 dark:bg-green-950/30 rounded px-3 py-2 border border-green-200 dark:border-green-800">
            {risk.suggestion}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">【一般的な慣行】</p>
          <p className="text-xs text-muted-foreground">{risk.commonPractice}</p>
        </div>
      </div>
    </div>
  );
}
