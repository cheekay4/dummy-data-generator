import type { AnalysisResult, RiskLevel } from '@/lib/contract/types';

interface ArticlesTabProps {
  result: AnalysisResult;
}

const RISK_ICON: Record<RiskLevel, string> = {
  high: '🔴',
  medium: '🟡',
  low: '🔵',
  none: '🟢',
};

const STATUS_STYLE: Record<string, string> = {
  '要確認': 'text-red-600 dark:text-red-400',
  '注意': 'text-amber-600 dark:text-amber-400',
  '問題なし': 'text-green-600 dark:text-green-400',
};

export function ArticlesTab({ result }: ArticlesTabProps) {
  if (result.articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>条項情報がありません</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="px-3 py-2.5 text-left font-medium w-16">#</th>
            <th className="px-3 py-2.5 text-left font-medium">条項名</th>
            <th className="px-3 py-2.5 text-center font-medium w-16">リスク</th>
            <th className="px-3 py-2.5 text-left font-medium w-24">ステータス</th>
            <th className="px-3 py-2.5 text-left font-medium">概要</th>
          </tr>
        </thead>
        <tbody>
          {result.articles.map((article, i) => (
            <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
              <td className="px-3 py-2 text-muted-foreground text-xs">{article.number}</td>
              <td className="px-3 py-2 font-medium">{article.title}</td>
              <td className="px-3 py-2 text-center text-base">
                {RISK_ICON[article.riskLevel]}
              </td>
              <td className={`px-3 py-2 text-xs font-medium ${STATUS_STYLE[article.status] ?? ''}`}>
                {article.status}
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground">{article.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
