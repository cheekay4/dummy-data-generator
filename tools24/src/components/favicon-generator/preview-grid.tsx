'use client';

import { useEffect, useRef } from 'react';
import { resizeImage } from '@/lib/favicon-generator/image-resizer';
import type { ResizeImageOptions } from '@/lib/favicon-generator/image-resizer';

const SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 512];
const LABELS: Record<number, string> = {
  16: 'ブラウザタブ',
  32: 'タスクバー',
  48: 'デスクトップ',
  64: 'デスクトップ大',
  96: '高解像度',
  128: 'Webアプリ',
  180: 'Apple Touch',
  192: 'PWA小',
  512: 'PWA大',
};

interface PreviewGridProps {
  sourceCanvas: HTMLCanvasElement | null;
  options: ResizeImageOptions;
}

function SizeCanvas({
  sourceCanvas,
  options,
  size,
}: {
  sourceCanvas: HTMLCanvasElement | null;
  options: ResizeImageOptions;
  size: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sourceCanvas || !canvasRef.current) return;
    const resized = resizeImage(sourceCanvas, { ...options, size });
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = size;
    canvasRef.current.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(resized, 0, 0, size, size);
  }, [sourceCanvas, options, size]);

  const displaySize = Math.min(size, 64);

  return (
    <div className="text-center">
      <div
        className="border rounded inline-block"
        style={{
          width: displaySize,
          height: displaySize,
          backgroundImage:
            'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 8px 8px',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: displaySize, height: displaySize }}
        />
      </div>
      <p className="text-xs mt-1 text-muted-foreground">{size}px</p>
      <p className="text-xs text-muted-foreground/70">{LABELS[size]}</p>
    </div>
  );
}

export default function PreviewGrid({ sourceCanvas, options }: PreviewGridProps) {
  if (!sourceCanvas) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        画像をアップロードするとプレビューが表示されます
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {SIZES.map((size) => (
        <SizeCanvas key={size} sourceCanvas={sourceCanvas} options={options} size={size} />
      ))}
    </div>
  );
}
