'use client';

import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatFileSize } from '@/lib/webp-converter/file-utils';

type CompressFormat = 'jpeg' | 'webp';

interface CompressPanelProps {
  sourceImg: HTMLImageElement | null;
  sourceFile: File | null;
  onResult: (
    blob: Blob,
    dimensions: { w: number; h: number },
    label: string,
    type: 'resize' | 'compress' | 'crop'
  ) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface Progress {
  round: number;
  totalRounds: number;
  currentSize: number;
  quality: number;
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

const SIZE_PRESETS = [
  { label: '100KB', value: 100, unit: 'KB' as const },
  { label: '200KB', value: 200, unit: 'KB' as const },
  { label: '500KB', value: 500, unit: 'KB' as const },
  { label: '1MB', value: 1, unit: 'MB' as const },
  { label: '2MB', value: 2, unit: 'MB' as const },
];

export default function CompressPanel({
  sourceImg,
  sourceFile,
  onResult,
  isProcessing,
  setIsProcessing,
}: CompressPanelProps): React.ReactElement {
  const [targetSize, setTargetSize] = useState(500);
  const [unit, setUnit] = useState<'KB' | 'MB'>('KB');
  const [outputFormat, setOutputFormat] = useState<CompressFormat>('jpeg');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompress = useCallback(async (): Promise<void> => {
    if (!sourceImg) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setProgress(null);

    try {
      const targetBytes =
        unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;
      const mimeType =
        outputFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';
      let scale = 1.0;
      const maxRounds = 5;
      let lastGoodBlob: Blob | null = null;
      let lastGoodDims = { w: 0, h: 0 };

      for (let round = 0; round < maxRounds; round++) {
        const w = Math.round(sourceImg.naturalWidth * scale);
        const h = Math.round(sourceImg.naturalHeight * scale);
        if (w < 1 || h < 1) break;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context の取得に失敗しました');
        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(sourceImg, 0, 0, w, h);

        let lo = 0.1;
        let hi = 0.95;
        let roundBest: Blob | null = null;

        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2;
          const blob = await canvasToBlob(canvas, mimeType, mid);
          setProgress({
            round: round + 1,
            totalRounds: maxRounds,
            currentSize: blob.size,
            quality: Math.round(mid * 100),
          });

          // yield to UI
          await new Promise((r) => setTimeout(r, 0));

          if (blob.size <= targetBytes) {
            roundBest = blob;
            lo = mid;
          } else {
            hi = mid;
          }
        }

        // 最低品質でも記録（ベストエフォート用）
        const fallback = await canvasToBlob(canvas, mimeType, lo);
        if (!lastGoodBlob || fallback.size < lastGoodBlob.size) {
          lastGoodBlob = fallback;
          lastGoodDims = { w, h };
        }

        if (roundBest) {
          onResult(
            roundBest,
            { w, h },
            `圧縮: ${formatFileSize(sourceFile?.size ?? 0)} → ${formatFileSize(roundBest.size)}`,
            'compress'
          );
          setProgress(null);
          return;
        }

        scale *= 0.9;
      }

      // 達成不可の場合、ベストエフォートで返す
      if (lastGoodBlob) {
        setErrorMsg(
          `指定サイズ（${targetSize}${unit}）までの圧縮ができませんでした。現在の最小サイズ: ${formatFileSize(lastGoodBlob.size)}`
        );
        onResult(
          lastGoodBlob,
          lastGoodDims,
          `圧縮（ベストエフォート）: ${formatFileSize(sourceFile?.size ?? 0)} → ${formatFileSize(lastGoodBlob.size)}`,
          'compress'
        );
      } else {
        setErrorMsg('圧縮処理に失敗しました。');
      }
    } catch {
      setErrorMsg('圧縮処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [
    sourceImg,
    sourceFile,
    targetSize,
    unit,
    outputFormat,
    onResult,
    setIsProcessing,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div>
          <Label htmlFor="target-size" className="text-xs mb-1.5 block">
            目標ファイルサイズ
          </Label>
          <Input
            id="target-size"
            type="number"
            min={1}
            value={targetSize || ''}
            onChange={(e) =>
              setTargetSize(Math.max(1, parseInt(e.target.value, 10) || 0))
            }
            placeholder="例: 500"
          />
        </div>
        <Select value={unit} onValueChange={(v) => setUnit(v as 'KB' | 'MB')}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="KB">KB</SelectItem>
            <SelectItem value="MB">MB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">プリセット</Label>
        <div className="flex flex-wrap gap-2">
          {SIZE_PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setTargetSize(p.value);
                setUnit(p.unit);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">出力形式</Label>
        <Select
          value={outputFormat}
          onValueChange={(v) => setOutputFormat(v as CompressFormat)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          PNGは非可逆圧縮に対応していないため選択できません
        </p>
      </div>

      {progress && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (progress.round / progress.totalRounds) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ラウンド {progress.round}/{progress.totalRounds} — 品質:{' '}
            {progress.quality}% — 現在: {formatFileSize(progress.currentSize)}
          </p>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm text-amber-500">{errorMsg}</p>
      )}

      <Button
        onClick={handleCompress}
        disabled={isProcessing || !sourceImg}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            圧縮中...
          </>
        ) : (
          '圧縮実行'
        )}
      </Button>
    </div>
  );
}
