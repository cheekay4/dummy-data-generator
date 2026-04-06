'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ENCODING_LABELS } from '@/lib/mojibake-fixer/convert';
import type { DetectionResult } from '@/lib/mojibake-fixer/detect';
import { ArrowRight } from 'lucide-react';

interface DetectionPanelProps {
  result: DetectionResult | null;
  isLoading: boolean;
}

const CONFIDENCE_CONFIG = {
  high: { label: '高', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  medium: { label: '中', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  low: { label: '低', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
};

export default function DetectionPanel({ result, isLoading }: DetectionPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">判定中...</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const conf = CONFIDENCE_CONFIG[result.confidence];

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium">推定パターン:</p>
          <span className="text-sm font-mono">{ENCODING_LABELS[result.from]}</span>
          <span className="text-sm text-muted-foreground">のバイト列を</span>
          <span className="text-sm font-mono">{ENCODING_LABELS[result.to]}</span>
          <span className="text-sm text-muted-foreground">として誤解釈</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">修復</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">信頼度:</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${conf.className}`}>
            {conf.label}（スコア: {(result.score * 100).toFixed(0)}%）
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
