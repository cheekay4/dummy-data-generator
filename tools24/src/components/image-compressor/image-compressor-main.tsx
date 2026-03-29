"use client";

import { useState, useCallback } from "react";
import { Download, Trash2, Image as ImageIcon, Archive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/image-compressor/drop-zone";
import {
  type ImageFile,
  type CompressOptions,
  generateId,
  loadImage,
  compressImage,
  formatBytes,
  getReductionPercent,
} from "@/lib/image-compressor/compressor";

const PRESETS = [
  { label: "元のサイズ", width: 0, height: 0 },
  { label: "SNS (1200x630)", width: 1200, height: 630 },
  { label: "サムネイル (300x300)", width: 300, height: 300 },
  { label: "OGP (1200x630)", width: 1200, height: 630 },
] as const;

const FORMAT_OPTIONS = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
] as const;

export function ImageCompressorMain(): React.ReactElement {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<CompressOptions["outputFormat"]>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = [];
    for (const file of files) {
      const img = await loadImage(file);
      newImages.push({
        id: generateId(),
        file,
        originalUrl: img.src,
        originalSize: file.size,
        compressedBlob: null,
        compressedUrl: null,
        compressedSize: null,
        width: img.width,
        height: img.height,
        newWidth: img.width,
        newHeight: img.height,
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleCompress = useCallback(async () => {
    setProcessing(true);
    const opts: CompressOptions = {
      quality: quality / 100,
      outputFormat,
      ...(maxWidth > 0 ? { maxWidth } : {}),
      ...(maxHeight > 0 ? { maxHeight } : {}),
    };

    const updated = await Promise.all(
      images.map(async (img) => {
        try {
          const { blob, width, height } = await compressImage(img.file, opts);
          const url = URL.createObjectURL(blob);
          return {
            ...img,
            compressedBlob: blob,
            compressedUrl: url,
            compressedSize: blob.size,
            newWidth: width,
            newHeight: height,
          };
        } catch {
          return img;
        }
      })
    );
    setImages(updated);
    setProcessing(false);
  }, [images, quality, outputFormat, maxWidth, maxHeight]);

  const handleDownload = useCallback((img: ImageFile) => {
    if (!img.compressedUrl) return;
    const ext = outputFormat.split("/")[1];
    const name = img.file.name.replace(/\.[^.]+$/, `.${ext}`);
    const a = document.createElement("a");
    a.href = img.compressedUrl;
    a.download = name;
    a.click();
  }, [outputFormat]);

  const handleDownloadAll = useCallback(async () => {
    const compressed = images.filter((img) => img.compressedBlob);
    if (compressed.length === 0) return;

    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const ext = outputFormat.split("/")[1];

    for (const img of compressed) {
      const name = img.file.name.replace(/\.[^.]+$/, `.${ext}`);
      zip.file(name, img.compressedBlob!);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "compressed-images.zip";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [images, outputFormat]);

  const handlePreset = useCallback((w: number, h: number) => {
    setMaxWidth(w);
    setMaxHeight(h);
  }, []);

  const handleClear = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
  }, [images]);

  const hasCompressed = images.some((img) => img.compressedBlob !== null);

  return (
    <div className="space-y-6">
      <DropZone onFiles={handleFiles} accept="image/png,image/jpeg,image/webp" />

      {images.length > 0 && (
        <>
          {/* Settings */}
          <div className="rounded-xl border bg-card p-4 space-y-4">
            {/* Quality */}
            <div>
              <label className="text-sm font-medium">品質: {quality}%</label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-1 w-full accent-primary"
              />
            </div>

            {/* Output format */}
            <div>
              <label className="text-sm font-medium">出力形式</label>
              <div className="mt-1 flex gap-2">
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setOutputFormat(f.value as CompressOptions["outputFormat"])}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      outputFormat === f.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resize presets */}
            <div>
              <label className="text-sm font-medium">リサイズ</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.width, p.height)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      maxWidth === p.width && maxHeight === p.height
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <label>幅:</label>
                <input
                  type="number"
                  min={0}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-20 rounded border bg-background px-2 py-1 text-sm"
                  placeholder="自動"
                />
                <label>高さ:</label>
                <input
                  type="number"
                  min={0}
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(Number(e.target.value))}
                  className="w-20 rounded border bg-background px-2 py-1 text-sm"
                  placeholder="自動"
                />
                <span className="text-xs text-muted-foreground">0 = 制限なし</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button onClick={handleCompress} disabled={processing}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${processing ? "animate-spin" : ""}`} />
              {processing ? "処理中..." : "すべて圧縮"}
            </Button>
            {hasCompressed && (
              <Button variant="outline" onClick={handleDownloadAll}>
                <Archive className="mr-1.5 h-4 w-4" />
                一括ダウンロード (ZIP)
              </Button>
            )}
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              クリア
            </Button>
          </div>

          {/* Image list */}
          <div className="space-y-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-4 rounded-xl border bg-card p-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{img.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {img.width}x{img.height} / {formatBytes(img.originalSize)}
                    {img.compressedSize !== null && (
                      <>
                        {" → "}
                        <span className="font-medium text-foreground">
                          {formatBytes(img.compressedSize)}
                        </span>
                        {" "}
                        <span className="text-green-600 dark:text-green-400">
                          (-{getReductionPercent(img.originalSize, img.compressedSize)}%)
                        </span>
                      </>
                    )}
                  </p>
                </div>
                {img.compressedBlob && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(img)}
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    保存
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
