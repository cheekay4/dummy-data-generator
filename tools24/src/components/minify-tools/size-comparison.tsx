'use client';

import { formatBytes, calcReduction } from '@/lib/minify-tools/size-utils';

interface SizeComparisonProps {
  original: string;
  compressed: string;
}

export default function SizeComparison({ original, compressed }: SizeComparisonProps) {
  if (!original || !compressed) return null;

  const originalBytes = new TextEncoder().encode(original).length;
  const compressedBytes = new TextEncoder().encode(compressed).length;
  const { bytes, percent } = calcReduction(original, compressed);
  const ratio = originalBytes > 0 ? (compressedBytes / originalBytes) * 100 : 100;

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">元サイズ: {formatBytes(originalBytes)}</span>
        <span className="font-medium text-green-600 dark:text-green-400">
          -{percent}% ({formatBytes(bytes)} 削減)
        </span>
        <span className="text-muted-foreground">圧縮後: {formatBytes(compressedBytes)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
    </div>
  );
}
