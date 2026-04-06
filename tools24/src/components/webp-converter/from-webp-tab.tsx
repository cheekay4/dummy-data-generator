'use client';

import { useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileDropzone from './file-dropzone';
import ConversionCard from './conversion-card';
import { convertFromWebP } from '@/lib/webp-converter/converter';

const ACCEPT = ['image/webp'];

interface FileState {
  file: File;
  blob: Blob | null;
  isConverting: boolean;
  error: string | null;
}

export default function FromWebPTab() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(90);

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      const states: FileState[] = newFiles.map((f) => ({
        file: f,
        blob: null,
        isConverting: true,
        error: null,
      }));
      setFiles((prev) => [...prev, ...states]);

      for (const file of newFiles) {
        try {
          const blob = await convertFromWebP(file, outputFormat, quality);
          setFiles((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => s.file === file);
            if (idx !== -1) next[idx] = { ...next[idx], blob, isConverting: false };
            return next;
          });
        } catch {
          setFiles((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => s.file === file);
            if (idx !== -1)
              next[idx] = { ...next[idx], isConverting: false, error: '変換に失敗しました' };
            return next;
          });
        }
      }
    },
    [outputFormat, quality]
  );

  const handleZipDownload = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const state of files) {
      if (state.blob) {
        const name = state.file.name.replace(/\.webp$/i, `.${outputFormat}`);
        zip.file(name, state.blob);
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasConverted = files.some((f) => f.blob !== null);

  return (
    <div className="space-y-6">
      <FileDropzone accept={ACCEPT} multiple onFiles={handleFiles} label="WebPファイルをドロップ" />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>出力形式</Label>
          <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as 'png' | 'jpeg')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {outputFormat === 'jpeg' && (
          <div className="space-y-2">
            <Label>品質: {quality}</Label>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
            />
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{files.length}件</p>
            {hasConverted && (
              <Button variant="outline" size="sm" onClick={handleZipDownload}>
                一括ZIPダウンロード
              </Button>
            )}
          </div>
          {files.map((state, i) => (
            <ConversionCard
              key={i}
              file={state.file}
              convertedBlob={state.blob}
              isConverting={state.isConverting}
              outputName={state.file.name.replace(/\.webp$/i, `.${outputFormat}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
