'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { renderStamp } from '@/lib/digital-stamp/canvas-renderer';
import { renderStampSVG } from '@/lib/digital-stamp/svg-renderer';
import type { StampOptions } from '@/lib/digital-stamp/stamp-types';

interface DownloadPanelProps {
  options: StampOptions;
}

const SIZES = [200, 300, 400, 500];

export default function DownloadPanel({ options }: DownloadPanelProps) {
  const [downloadSize, setDownloadSize] = useState(300);

  const downloadPng = (transparent = true) => {
    const canvas = document.createElement('canvas');
    renderStamp(canvas, { ...options, size: downloadSize });
    if (!transparent) {
      const out = document.createElement('canvas');
      out.width = downloadSize;
      out.height = downloadSize;
      const ctx = out.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, downloadSize, downloadSize);
        ctx.drawImage(canvas, 0, 0);
      }
      out.toBlob((blob) => {
        if (!blob) return;
        triggerDownload(URL.createObjectURL(blob), 'stamp.jpg');
      }, 'image/jpeg', 0.95);
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), 'stamp.png');
    }, 'image/png');
  };

  const downloadSvg = () => {
    const svg = renderStampSVG(options);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    triggerDownload(URL.createObjectURL(blob), 'stamp.svg');
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>出力サイズ</Label>
        <Select value={String(downloadSize)} onValueChange={(v) => setDownloadSize(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>{s}px</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => downloadPng(true)} variant="default">
          PNG（透過）
        </Button>
        <Button onClick={() => downloadSvg()} variant="outline">
          SVGダウンロード
        </Button>
        <Button onClick={() => downloadPng(false)} variant="outline">
          JPG（白背景）
        </Button>
      </div>
    </div>
  );
}
