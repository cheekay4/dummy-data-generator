import { DetectionResult, DETECTION_LABELS, DetectionType } from "@/lib/types";

interface DetectionSummaryProps {
  result: DetectionResult;
}

export function DetectionSummary({ result }: DetectionSummaryProps) {
  const detected = Object.entries(result.counts).filter(([, count]) => count > 0) as [DetectionType, number][];

  if (detected.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 rounded-lg border bg-muted/20">
        個人情報は検出されませんでした
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
      <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">検出結果</p>
      <ul className="space-y-1">
        {detected.map(([type, count]) => (
          <li key={type} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <span>✓</span>
            <span>{DETECTION_LABELS[type]}</span>
            <span className="font-medium">{count}件</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
