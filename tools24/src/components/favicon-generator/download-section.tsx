'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { resizeImage, canvasToBlob, canvasToPngBuffer } from '@/lib/favicon-generator/image-resizer';
import { createIco } from '@/lib/favicon-generator/ico-encoder';
import { buildManifestJson, buildBrowserConfig, type ManifestConfig } from '@/lib/favicon-generator/manifest-builder';
import { buildHtmlSnippet } from '@/lib/favicon-generator/html-snippet';
import { buildZip, type FaviconFiles } from '@/lib/favicon-generator/zip-builder';
import type { ResizeImageOptions } from '@/lib/favicon-generator/image-resizer';

interface DownloadSectionProps {
  sourceCanvas: HTMLCanvasElement | null;
  resizeOptions: ResizeImageOptions;
}

const FILE_OPTIONS = [
  { key: 'favicon.ico', label: 'favicon.ico（16/32/48px）' },
  { key: 'favicon-16x16.png', label: 'favicon-16x16.png' },
  { key: 'favicon-32x32.png', label: 'favicon-32x32.png' },
  { key: 'apple-touch-icon.png', label: 'apple-touch-icon.png（180px）' },
  { key: 'android-chrome-192x192.png', label: 'android-chrome-192x192.png' },
  { key: 'android-chrome-512x512.png', label: 'android-chrome-512x512.png' },
  { key: 'mstile-150x150.png', label: 'mstile-150x150.png' },
  { key: 'site.webmanifest', label: 'site.webmanifest' },
  { key: 'browserconfig.xml', label: 'browserconfig.xml' },
];

export default function DownloadSection({ sourceCanvas, resizeOptions }: DownloadSectionProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(FILE_OPTIONS.map((o) => o.key))
  );
  const [manifest, setManifest] = useState<ManifestConfig>({
    name: 'My App',
    shortName: 'App',
    themeColor: '#ffffff',
    bgColor: '#ffffff',
  });
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleFile = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const handleDownload = async () => {
    if (!sourceCanvas) return;
    setIsGenerating(true);
    try {
      const files: FaviconFiles = {};
      const makeCanvas = (size: number) =>
        resizeImage(sourceCanvas, { ...resizeOptions, size });

      if (selected.has('favicon.ico')) {
        const buffers = await Promise.all([16, 32, 48].map((s) => canvasToPngBuffer(makeCanvas(s))));
        files['favicon.ico'] = createIco(buffers, [16, 32, 48]);
      }
      if (selected.has('favicon-16x16.png'))
        files['favicon-16x16.png'] = await canvasToBlob(makeCanvas(16));
      if (selected.has('favicon-32x32.png'))
        files['favicon-32x32.png'] = await canvasToBlob(makeCanvas(32));
      if (selected.has('apple-touch-icon.png'))
        files['apple-touch-icon.png'] = await canvasToBlob(makeCanvas(180));
      if (selected.has('android-chrome-192x192.png'))
        files['android-chrome-192x192.png'] = await canvasToBlob(makeCanvas(192));
      if (selected.has('android-chrome-512x512.png'))
        files['android-chrome-512x512.png'] = await canvasToBlob(makeCanvas(512));
      if (selected.has('mstile-150x150.png'))
        files['mstile-150x150.png'] = await canvasToBlob(makeCanvas(150));
      if (selected.has('site.webmanifest'))
        files['site.webmanifest'] = buildManifestJson(manifest);
      if (selected.has('browserconfig.xml'))
        files['browserconfig.xml'] = buildBrowserConfig(manifest.themeColor);

      const zip = await buildZip(files);
      const url = URL.createObjectURL(zip);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon-package.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const htmlSnippet = buildHtmlSnippet(manifest.themeColor);

  const handleCopySnippet = async () => {
    await navigator.clipboard.writeText(htmlSnippet);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  return (
    <div className="space-y-6 border-t pt-6 mt-8">
      <h2 className="text-lg font-semibold">ダウンロード</h2>

      {/* ファイル選択 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {FILE_OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center gap-2">
            <Checkbox
              id={opt.key}
              checked={selected.has(opt.key)}
              onCheckedChange={() => toggleFile(opt.key)}
            />
            <Label htmlFor={opt.key} className="text-sm">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>

      {/* manifest設定 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">アプリ名</Label>
          <Input
            value={manifest.name}
            onChange={(e) => setManifest({ ...manifest, name: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">短縮名</Label>
          <Input
            value={manifest.shortName}
            onChange={(e) => setManifest({ ...manifest, shortName: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">テーマカラー</Label>
          <input
            type="color"
            value={manifest.themeColor}
            onChange={(e) => setManifest({ ...manifest, themeColor: e.target.value })}
            className="h-9 w-full rounded border cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">背景色</Label>
          <input
            type="color"
            value={manifest.bgColor}
            onChange={(e) => setManifest({ ...manifest, bgColor: e.target.value })}
            className="h-9 w-full rounded border cursor-pointer"
          />
        </div>
      </div>

      <Button onClick={handleDownload} disabled={!sourceCanvas || isGenerating || selected.size === 0}>
        {isGenerating ? 'ZIP生成中...' : 'ZIPをダウンロード'}
      </Button>

      {/* HTMLスニペット */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">HTMLスニペット</Label>
          <Button variant="outline" size="sm" onClick={handleCopySnippet}>
            {snippetCopied ? 'コピーしました ✓' : 'コピー'}
          </Button>
        </div>
        <Textarea value={htmlSnippet} readOnly className="font-mono text-xs min-h-[140px]" />
      </div>
    </div>
  );
}
