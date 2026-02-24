export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-4xl mx-auto px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <span className="shrink-0 mt-0.5">⚠️</span>
        <span>
          本ツールはAIによる参考分析です。<strong>法的助言ではありません。</strong>
          重要な契約は必ず弁護士にご相談ください。
        </span>
      </div>
    </div>
  );
}
