'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateResult, AdjustmentType } from '@/lib/keigo/types';
import { Copy, Mail } from 'lucide-react';

interface ResultDisplayProps {
  result: GenerateResult;
  onAdjust: (adjustment: AdjustmentType) => void;
  isLoading: boolean;
}

function CopyBtn({ text, label = 'コピー' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} className="h-7 px-2 text-xs gap-1">
      <Copy className="h-3 w-3" />
      {copied ? 'コピーしました ✓' : label}
    </Button>
  );
}

export function ResultDisplay({ result, onAdjust, isLoading }: ResultDisplayProps) {
  const mailtoHref = `mailto:?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Step 3: 結果</h2>

      {/* Subject */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">件名</span>
          <CopyBtn text={result.subject} />
        </div>
        <div className="px-3 py-2 rounded-md border bg-muted/30 text-sm font-medium">
          {result.subject}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">本文</span>
          <CopyBtn
            text={`件名: ${result.subject}\n\n${result.body}`}
            label="全文コピー"
          />
        </div>
        <textarea
          readOnly
          value={result.body}
          rows={12}
          className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none resize-y font-sans leading-relaxed"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild className="gap-1">
          <a href={mailtoHref}>
            <Mail className="h-3.5 w-3.5" />
            メールアプリで開く
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjust('more-formal')}
          disabled={isLoading}
        >
          もう少しフォーマルに
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjust('more-casual')}
          disabled={isLoading}
        >
          もう少しカジュアルに
        </Button>
      </div>

      {/* Techniques */}
      {result.techniques && result.techniques.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">敬語チェック結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.techniques.map((t, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground line-through shrink-0">{t.original}</span>
                    <span className="text-muted-foreground shrink-0">→</span>
                    <span className="font-medium text-primary shrink-0">{t.converted}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-4">{t.explanation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
