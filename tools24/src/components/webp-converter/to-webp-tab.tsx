'use client';

import { useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FileDropzone from './file-dropzone';
import ConversionCard from './conversion-card';
import { convertToWebP, type ResizeOptions } from '@/lib/webp-converter/converter';
import { validateImageFile, formatFileSize } from '@/lib/webp-converter/file-utils';

const MAX_FILES = 20;
const ACCEPT = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

interface FileState {
  file: File;
  blob: Blob | null;
  isConverting: boolean;
  error: string | null;
}

export default function ToWebPTab() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [quality, setQuality] = useState(80);
  const [lossless, setLossless] = useState(false);
  const [resize, setResize] = useState<ResizeOptions>({ mode: 'none', value: 0 });
  const [totalSaved, setTotalSaved] = useState(0);

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      const limited = newFiles.slice(0, MAX_FILES - files.length);
      const states: FileState[] = limited.map((f) => ({
        file: f,
        blob: null,
        isConverting: true,
        error: null,
      }));
      setFiles((prev) => [...prev, ...states]);

      for (let i = 0; i < limited.length; i++) {
        const file = limited[i];
        const err = validateImageFile(file);
        if (err) {
          setFiles((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => s.file === file);
            if (idx !== -1) next[idx] = { ...next[idx], isConverting: false, error: err };
            return next;
          });
          continue;
        }
        try {
          const blob = await convertToWebP(file, quality, lossless, resize);
          setFiles((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => s.file === file);
            if (idx !== -1) next[idx] = { ...next[idx], blob, isConverting: false };
            return next;
          });
          setTotalSaved((prev) => prev + Math.max(0, file.size - blob.size));
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
    [files.length, quality, lossless, resize]
  );

  const handleZipDownload = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const state of files) {
      if (state.blob) {
        const name = state.file.name.replace(/\.[^.]+$/, '.webp');
        zip.file(name, state.blob);
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webp-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasConverted = files.some((f) => f.blob !== null);

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPT}
        multiple
        onFiles={handleFiles}
        label={`画像をドロップ（最大${MAX_FILES}枚）`}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>品質: {quality}</Label>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={([v]) => setQuality(v)}
            disabled={lossless}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={lossless} onCheckedChange={setLossless} id="lossless" />
          <Label htmlFor="lossless">ロスレス（無劣化）</Label>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="resize">
            <AccordionTrigger className="text-sm">リサイズオプション</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-3 items-center pt-2">
                <Select
                  value={resize.mode}
                  onValueChange={(v) => setResize({ ...resize, mode: v as ResizeOptions['mode'] })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">リサイズなし</SelectItem>
                    <SelectItem value="maxWidth">最大幅 (px)</SelectItem>
                    <SelectItem value="maxHeight">最大高さ (px)</SelectItem>
                    <SelectItem value="ratio">比率 (%)</SelectItem>
                  </SelectContent>
                </Select>
                {resize.mode !== 'none' && (
                  <Input
                    type="number"
                    className="w-24"
                    value={resize.value || ''}
                    onChange={(e) => setResize({ ...resize, value: Number(e.target.value) })}
                    placeholder={resize.mode === 'ratio' ? '%' : 'px'}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {files.length}件
              {totalSaved > 0 && ` • 合計 ${formatFileSize(totalSaved)} 削減`}
            </p>
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
              outputName={state.file.name.replace(/\.[^.]+$/, '.webp')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
