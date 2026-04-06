'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CodeOutputProps {
  value: string;
  filename: string;
}

export default function CodeOutput({ value, filename }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">圧縮結果: {filename}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!value}>
            {copied ? 'コピーしました ✓' : 'コピー'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!value}>
            ダウンロード
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        readOnly
        className="min-h-[150px] font-mono text-sm bg-muted"
        placeholder="圧縮結果がここに表示されます"
      />
    </div>
  );
}
