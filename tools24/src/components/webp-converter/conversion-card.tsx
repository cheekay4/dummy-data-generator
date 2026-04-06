'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, calcReductionRate } from '@/lib/webp-converter/file-utils';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversionCardProps {
  file: File;
  convertedBlob: Blob | null;
  isConverting: boolean;
  outputName: string;
}

export default function ConversionCard({
  file,
  convertedBlob,
  isConverting,
  outputName,
}: ConversionCardProps) {
  const [beforeUrl, setBeforeUrl] = useState<string>('');
  const [afterUrl, setAfterUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setBeforeUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!convertedBlob) {
      setAfterUrl('');
      return;
    }
    const url = URL.createObjectURL(convertedBlob);
    setAfterUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [convertedBlob]);

  const reduction = convertedBlob ? calcReductionRate(file.size, convertedBlob.size) : 0;

  const badgeClass = cn(
    'text-xs',
    reduction >= 50
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      : reduction >= 20
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  );

  const handleDownload = () => {
    if (!afterUrl) return;
    const a = document.createElement('a');
    a.href = afterUrl;
    a.download = outputName;
    a.click();
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          {/* サムネイル */}
          <div className="flex gap-2 shrink-0">
            {beforeUrl && (
              <div className="text-center">
                <img src={beforeUrl} alt="before" className="w-16 h-16 object-contain rounded border" />
                <p className="text-xs text-muted-foreground mt-1">変換前</p>
              </div>
            )}
            {afterUrl && (
              <div className="text-center">
                <img src={afterUrl} alt="after" className="w-16 h-16 object-contain rounded border" />
                <p className="text-xs text-muted-foreground mt-1">変換後</p>
              </div>
            )}
          </div>

          {/* 情報 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
              {convertedBlob && (
                <>
                  {' → '}
                  {formatFileSize(convertedBlob.size)}
                  <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded ${badgeClass}`}>
                    -{reduction}%
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{outputName}</p>
          </div>

          {/* ダウンロードボタン */}
          <div className="shrink-0">
            {isConverting ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : convertedBlob ? (
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                保存
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
