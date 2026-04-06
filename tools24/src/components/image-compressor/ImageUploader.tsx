'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, ImageDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateImageFile, formatFileSize } from '@/lib/webp-converter/file-utils';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function getAspectRatioLabel(w: number, h: number): string {
  const d = gcd(w, h);
  const rw = w / d;
  const rh = h / d;
  if (rw > 100 || rh > 100) {
    const ratio = w / h;
    if (Math.abs(ratio - 16 / 9) < 0.02) return '16:9';
    if (Math.abs(ratio - 4 / 3) < 0.02) return '4:3';
    if (Math.abs(ratio - 3 / 2) < 0.02) return '3:2';
    if (Math.abs(ratio - 1) < 0.02) return '1:1';
    return `${w}:${h}`;
  }
  return `${rw}:${rh}`;
}

function getFormatLabel(type: string): string {
  switch (type) {
    case 'image/jpeg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WebP';
    default:
      return type.replace('image/', '').toUpperCase();
  }
}

interface ImageUploaderProps {
  sourceFile: File | null;
  sourceImg: HTMLImageElement | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

export default function ImageUploader({
  sourceFile,
  sourceImg,
  onFile,
  onClear,
}: ImageUploaderProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState('');

  useEffect(() => {
    if (!sourceFile) return;
    const url = URL.createObjectURL(sourceFile);
    setThumbUrl(url); // eslint-disable-line react-hooks/set-state-in-effect -- ObjectURL lifecycle requires sync setState
    return (): void => {
      URL.revokeObjectURL(url);
      setThumbUrl('');
    };
  }, [sourceFile]);

  const handleFile = useCallback(
    (file: File): void => {
      setError(null);
      const err = validateImageFile(file, 50);
      if (err) {
        setError(err);
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent): void => {
      if (sourceFile) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            return;
          }
        }
      }
    },
    [handleFile, sourceFile]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return (): void => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  if (sourceFile && sourceImg) {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-4">
          {thumbUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URL
            <img
              src={thumbUrl}
              alt="プレビュー"
              className="w-20 h-20 object-contain rounded border border-border bg-muted/30 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{sourceFile.name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span>形式: {getFormatLabel(sourceFile.type)}</span>
              <span>サイズ: {formatFileSize(sourceFile.size)}</span>
              <span>
                画像: {sourceImg.naturalWidth} x {sourceImg.naturalHeight} px
              </span>
              <span>
                比率:{' '}
                {getAspectRatioLabel(
                  sourceImg.naturalWidth,
                  sourceImg.naturalHeight
                )}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            別の画像
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div
        ref={dropRef}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-border hover:border-muted-foreground/50'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ImageDown className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              画像をドラッグ&ドロップ、またはクリックして選択
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG / PNG / WebP（最大50MB）・Ctrl+V でペーストも可能
            </p>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
