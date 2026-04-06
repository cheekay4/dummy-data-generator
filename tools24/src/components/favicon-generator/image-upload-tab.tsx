'use client';

import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import PreviewGrid from './preview-grid';
import type { ResizeImageOptions } from '@/lib/favicon-generator/image-resizer';
import { Upload } from 'lucide-react';

interface ImageUploadTabProps {
  onCanvas: (canvas: HTMLCanvasElement | null) => void;
  options: ResizeImageOptions;
  onOptions: (opts: ResizeImageOptions) => void;
}

const ACCEPT = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];

export default function ImageUploadTab({ onCanvas, options, onOptions }: ImageUploadTabProps) {
  const [preview, setPreview] = useState<string>('');
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [useTransparent, setUseTransparent] = useState(true);

  const processFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0);
        setSourceCanvas(canvas);
        onCanvas(canvas);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [onCanvas]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && ACCEPT.includes(file.type)) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ドロップゾーン */}
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="アップロード済み" className="h-24 w-24 object-contain rounded" />
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">画像をドロップ、またはクリックして選択</p>
            <p className="text-xs text-muted-foreground">PNG / JPG / SVG / WebP / GIF</p>
          </>
        )}
        <input type="file" accept={ACCEPT.join(',')} className="hidden" onChange={handleFileChange} />
      </label>

      {/* オプション */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="transparent"
              checked={useTransparent}
              onCheckedChange={(v) => {
                setUseTransparent(v);
                onOptions({ ...options, bgColor: v ? 'transparent' : '#ffffff' });
              }}
            />
            <Label htmlFor="transparent">透過背景</Label>
          </div>
          {!useTransparent && (
            <div className="flex items-center gap-2">
              <Label>背景色</Label>
              <input
                type="color"
                value={options.bgColor === 'transparent' ? '#ffffff' : (options.bgColor ?? '#ffffff')}
                onChange={(e) => onOptions({ ...options, bgColor: e.target.value })}
                className="h-8 w-16 rounded border cursor-pointer"
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>角丸</Label>
          <Select
            value={String(options.borderRadius ?? 0)}
            onValueChange={(v) => onOptions({ ...options, borderRadius: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">なし（0%）</SelectItem>
              <SelectItem value="10">軽い（10%）</SelectItem>
              <SelectItem value="20">中（20%）</SelectItem>
              <SelectItem value="50">丸（50%）</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>パディング: {options.padding ?? 0}%</Label>
          <Slider
            min={0}
            max={15}
            step={1}
            value={[options.padding ?? 0]}
            onValueChange={([v]) => onOptions({ ...options, padding: v })}
          />
        </div>
      </div>

      {/* プレビューグリッド */}
      <div className="border rounded-lg p-4">
        <p className="text-sm font-medium mb-4">全サイズプレビュー</p>
        <PreviewGrid sourceCanvas={sourceCanvas} options={options} />
      </div>
    </div>
  );
}
