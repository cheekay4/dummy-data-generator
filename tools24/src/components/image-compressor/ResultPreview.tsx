'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  formatFileSize,
  calcReductionRate,
} from '@/lib/webp-converter/file-utils';
import type { OperationRecord } from './ImageCompressorMain';

interface ResultPreviewProps {
  sourceFile: File;
  sourceImg: HTMLImageElement | null;
  resultBlob: Blob;
  resultDimensions: { w: number; h: number } | null;
  onContinue: () => void;
  onClear: () => void;
  history: OperationRecord[];
}

function getExtension(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.bin';
  }
}

export default function ResultPreview({
  sourceFile,
  sourceImg,
  resultBlob,
  resultDimensions,
  onContinue,
  onClear,
  history,
}: ResultPreviewProps): React.ReactElement {
  const [resultUrl, setResultUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(resultBlob);
    // ObjectURL must be set synchronously after creation for cleanup tracking
    setResultUrl(url); // eslint-disable-line react-hooks/set-state-in-effect -- managing ObjectURL lifecycle
    return (): void => {
      URL.revokeObjectURL(url);
    };
  }, [resultBlob]);

  const reduction = useMemo(
    () => calcReductionRate(sourceFile.size, resultBlob.size),
    [sourceFile.size, resultBlob.size]
  );

  const downloadName = useMemo(() => {
    const base = sourceFile.name.replace(/\.[^.]+$/, '');
    const lastOp = history[history.length - 1];
    const suffix = lastOp
      ? lastOp.type === 'resize'
        ? '_resized'
        : lastOp.type === 'compress'
          ? '_compressed'
          : '_cropped'
      : '_processed';
    return `${base}${suffix}${getExtension(resultBlob.type)}`;
  }, [sourceFile.name, resultBlob.type, history]);

  const handleDownload = (): void => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="p-6 space-y-5">
      <h3 className="font-bold text-sm">処理結果</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Before</p>
          <div className="border border-border rounded bg-muted/30 p-2 flex items-center justify-center min-h-[120px]">
            {sourceImg && (
              /* eslint-disable-next-line @next/next/no-img-element -- dynamic blob URL */
              <img
                src={URL.createObjectURL(sourceFile)}
                alt="Before"
                className="max-w-full max-h-[200px] object-contain"
                onLoad={(e) => {
                  URL.revokeObjectURL((e.target as HTMLImageElement).src);
                }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(sourceFile.size)}
            {sourceImg &&
              ` / ${sourceImg.naturalWidth}×${sourceImg.naturalHeight}`}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">After</p>
          <div className="border border-border rounded bg-muted/30 p-2 flex items-center justify-center min-h-[120px]">
            {resultUrl && (
              /* eslint-disable-next-line @next/next/no-img-element -- dynamic blob URL */
              <img
                src={resultUrl}
                alt="After"
                className="max-w-full max-h-[200px] object-contain"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(resultBlob.size)}
            {resultDimensions &&
              ` / ${resultDimensions.w}×${resultDimensions.h}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        {reduction > 0 ? (
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-bold">
            {reduction}% 削減
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold">
            {Math.abs(reduction)}% 増加
          </span>
        )}
      </div>

      {history.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground mb-2">操作履歴</p>
          <ol className="space-y-1">
            {history.map((op, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <span className="font-mono text-foreground w-5">
                  {i + 1}.
                </span>
                <span>{op.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-1.5" />
          ダウンロード
        </Button>
        <Button variant="outline" onClick={onContinue}>
          <ArrowRight className="w-4 h-4 mr-1.5" />
          この結果で続けて加工
        </Button>
        <Button variant="ghost" onClick={onClear}>
          <RefreshCw className="w-4 h-4 mr-1.5" />
          別の画像を選択
        </Button>
      </div>
    </Card>
  );
}
