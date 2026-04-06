'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { minifyHTML } from '@/lib/minify-tools/html-minify';
import { minifyCSS } from '@/lib/minify-tools/css-minify';
import { minifyJS } from '@/lib/minify-tools/js-minify';
import { formatBytes, calcReduction } from '@/lib/minify-tools/size-utils';

interface BatchFile {
  name: string;
  original: string;
  compressed: string;
  originalSize: number;
  compressedSize: number;
  percent: number;
}

export default function BatchDropzone() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(async (fileList: File[]) => {
    const results: BatchFile[] = [];
    for (const file of fileList) {
      const content = await file.text();
      let compressed = content;
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'html' || ext === 'htm') {
        compressed = minifyHTML(content, { removeComments: true, collapseWhitespace: true, removeOptionalTags: true });
      } else if (ext === 'css') {
        compressed = minifyCSS(content, { removeComments: true, collapseWhitespace: true, removeLastSemicolon: true, shortenColors: true, removeZeroUnits: true });
      } else if (ext === 'js' || ext === 'mjs') {
        compressed = await minifyJS(content, { removeComments: true, collapseWhitespace: true, removeConsoleLog: false, shortenVariables: false });
      }
      const { percent } = calcReduction(content, compressed);
      const originalSize = new TextEncoder().encode(content).length;
      const compressedSize = new TextEncoder().encode(compressed).length;
      results.push({ name: file.name, original: content, compressed, originalSize, compressedSize, percent });
    }
    setFiles((prev) => [...prev, ...results]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase();
        return ['html', 'htm', 'css', 'js', 'mjs'].includes(ext ?? '');
      });
      processFiles(droppedFiles);
    },
    [processFiles]
  );

  const handleDownloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const f of files) {
      const ext = f.name.split('.').pop() ?? '';
      const minName = f.name.replace(`.${ext}`, `.min.${ext}`);
      zip.file(minName, f.compressed);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 border-t pt-6 mt-4">
      <p className="text-sm font-medium">一括圧縮（複数ファイル）</p>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">.html / .css / .js ファイルをまとめてドロップ</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{files.length}件</p>
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              全てZIPダウンロード
            </Button>
          </div>
          {files.map((f, i) => (
            <Card key={i}>
              <CardContent className="pt-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(f.originalSize)} → {formatBytes(f.compressedSize)}
                    <span className="ml-2 text-green-600 dark:text-green-400">-{f.percent}%</span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([f.compressed], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const ext = f.name.split('.').pop() ?? '';
                    a.download = f.name.replace(`.${ext}`, `.min.${ext}`);
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  保存
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
