'use client';

interface RiskGaugeProps {
  score: number;
}

export function RiskGauge({ score }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));

  const { color, bgColor, label, description } =
    clamped <= 30
      ? {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-500',
          label: '🟢 低リスク',
          description: '標準的な契約内容です',
        }
      : clamped <= 60
      ? {
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500',
          label: '🟡 中リスク',
          description: 'いくつか注意すべき条項があります',
        }
      : {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-500',
          label: '🔴 高リスク',
          description: '不利な条項が複数含まれています',
        };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${color}`}>{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{clamped}</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} rounded-full transition-all duration-700`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
