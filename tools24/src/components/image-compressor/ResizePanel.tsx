'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp';

interface ResizePanelProps {
  sourceImg: HTMLImageElement | null;
  sourceFile: File;
  onResult: (
    blob: Blob,
    dimensions: { w: number; h: number },
    label: string,
    type: 'resize' | 'compress' | 'crop'
  ) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Blob生成に失敗しました'));
      },
      mimeType,
      quality
    );
  });
}

function getMimeType(format: OutputFormat, originalType: string): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return originalType === 'image/webp' ||
        originalType === 'image/png' ||
        originalType === 'image/jpeg'
        ? originalType
        : 'image/png';
  }
}

const PRESETS = [
  { label: '50%', scale: 0.5 },
  { label: '25%', scale: 0.25 },
  { label: '1920×1080', w: 1920, h: 1080 },
  { label: '1280×720', w: 1280, h: 720 },
  { label: '800×600', w: 800, h: 600 },
  { label: 'OGP 1200×630', w: 1200, h: 630 },
] as const;

export default function ResizePanel({
  sourceImg,
  sourceFile,
  onResult,
  isProcessing,
  setIsProcessing,
}: ResizePanelProps): React.ReactElement {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState(85);
  const lastEdited = useRef<'width' | 'height'>('width');

  useEffect(() => {
    if (sourceImg) {
      setWidth(sourceImg.naturalWidth);
      setHeight(sourceImg.naturalHeight);
    }
  }, [sourceImg]);

  const handleWidthChange = useCallback(
    (val: string): void => {
      const w = Math.max(1, parseInt(val, 10) || 0);
      setWidth(w);
      lastEdited.current = 'width';
      if (lockAspect && sourceImg && sourceImg.naturalWidth > 0) {
        const ratio = sourceImg.naturalHeight / sourceImg.naturalWidth;
        setHeight(Math.round(w * ratio));
      }
    },
    [lockAspect, sourceImg]
  );

  const handleHeightChange = useCallback(
    (val: string): void => {
      const h = Math.max(1, parseInt(val, 10) || 0);
      setHeight(h);
      lastEdited.current = 'height';
      if (lockAspect && sourceImg && sourceImg.naturalHeight > 0) {
        const ratio = sourceImg.naturalWidth / sourceImg.naturalHeight;
        setWidth(Math.round(h * ratio));
      }
    },
    [lockAspect, sourceImg]
  );

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]): void => {
      if (!sourceImg) return;
      if ('scale' in preset) {
        setWidth(Math.round(sourceImg.naturalWidth * preset.scale));
        setHeight(Math.round(sourceImg.naturalHeight * preset.scale));
        setLockAspect(true);
      } else {
        setWidth(preset.w);
        setHeight(preset.h);
        if (
          preset.label === 'OGP 1200×630'
        ) {
          setLockAspect(false);
        }
      }
    },
    [sourceImg]
  );

  const handleResize = useCallback(async (): Promise<void> => {
    if (!sourceImg || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context の取得に失敗しました');
      const mimeType = getMimeType(outputFormat, sourceFile.type);
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(sourceImg, 0, 0, width, height);
      const q = mimeType === 'image/png' ? 1 : quality / 100;
      const blob = await canvasToBlob(canvas, mimeType, q);
      onResult(
        blob,
        { w: width, h: height },
        `リサイズ: ${sourceImg.naturalWidth}×${sourceImg.naturalHeight} → ${width}×${height}`,
        'resize'
      );
    } catch {
      // エラーは静かに無視（UIで表示する場合は別途対応）
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceImg,
    width,
    height,
    outputFormat,
    quality,
    sourceFile.type,
    onResult,
    setIsProcessing,
  ]);

  const showQuality = outputFormat !== 'png' && (outputFormat !== 'original' || sourceFile.type !== 'image/png');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <Label htmlFor="resize-width" className="text-xs mb-1.5 block">
            幅（px）
          </Label>
          <Input
            id="resize-width"
            type="number"
            min={1}
            value={width || ''}
            onChange={(e) => handleWidthChange(e.target.value)}
            placeholder={sourceImg ? `${sourceImg.naturalWidth}` : ''}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLockAspect((v) => !v)}
          className="shrink-0 self-end"
          title={lockAspect ? 'アスペクト比ロック中' : 'アスペクト比フリー'}
        >
          {lockAspect ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </Button>
        <div>
          <Label htmlFor="resize-height" className="text-xs mb-1.5 block">
            高さ（px）
          </Label>
          <Input
            id="resize-height"
            type="number"
            min={1}
            value={height || ''}
            onChange={(e) => handleHeightChange(e.target.value)}
            placeholder={sourceImg ? `${sourceImg.naturalHeight}` : ''}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">プリセット</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">出力形式</Label>
          <Select
            value={outputFormat}
            onValueChange={(v) => setOutputFormat(v as OutputFormat)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">元の形式のまま</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {showQuality && (
          <div>
            <Label className="text-xs mb-1.5 block">
              品質: {quality}
            </Label>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              className="mt-2"
            />
          </div>
        )}
      </div>

      <Button onClick={handleResize} disabled={isProcessing || !sourceImg}>
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            処理中...
          </>
        ) : (
          'リサイズ実行'
        )}
      </Button>
    </div>
  );
}
