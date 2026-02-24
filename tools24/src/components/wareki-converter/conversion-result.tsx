'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ConversionResult } from '@/lib/wareki/converter';

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 px-2 text-xs"
    >
      {copied ? '✓' : 'コピー'}
    </Button>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

function ResultRow({ label, value, copyable = true }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 gap-3">
      <span className="text-sm text-muted-foreground shrink-0 w-44">{label}</span>
      <span className="text-sm font-medium flex-1 break-all">{value}</span>
      {copyable && (
        <div className="shrink-0">
          <CopyButton text={value} />
        </div>
      )}
    </div>
  );
}

interface ConversionResultProps {
  result: ConversionResult | null;
}

export function ConversionResultPanel({ result }: ConversionResultProps) {
  if (!result) return null;

  const rows: { label: string; value: string; copyable?: boolean }[] = [
    { label: '和暦', value: result.warekiStr },
    { label: '西暦', value: result.seirekiStr },
    { label: '西暦（英語）', value: result.seirekiEnStr },
  ];

  if (result.unixSeconds !== null) {
    rows.push(
      { label: 'UNIXタイムスタンプ（秒）', value: String(result.unixSeconds) },
      { label: 'UNIXタイムスタンプ（ミリ秒）', value: String(result.unixMs) },
    );
  }

  if (result.iso8601Str !== null) {
    rows.push({ label: 'ISO 8601', value: result.iso8601Str });
  }

  if (result.dayOfWeekStr !== null) {
    rows.push({ label: '曜日', value: result.dayOfWeekStr, copyable: false });
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">変換結果</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {rows.map((row) => (
          <ResultRow
            key={row.label}
            label={row.label}
            value={row.value}
            copyable={row.copyable}
          />
        ))}
      </CardContent>
    </Card>
  );
}
