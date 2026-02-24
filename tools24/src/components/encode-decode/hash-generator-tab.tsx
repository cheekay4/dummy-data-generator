'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { generateAllHashes, HASH_ALGORITHMS, type HashAlgorithm } from '@/lib/encode-decode/hash';

const textareaCls =
  'w-full px-3 py-2 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y';

type Mode = 'text' | 'compare' | 'file';

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="px-2 py-0.5 text-xs border rounded hover:bg-muted transition-colors">
      {copied ? '✓' : '📋'}
    </button>
  );
}

type Hashes = Record<HashAlgorithm, string>;

function HashTable({
  hashes,
  uppercase,
  compareHashes,
}: {
  hashes: Hashes;
  uppercase: boolean;
  compareHashes?: Hashes;
}) {
  const transform = (h: string) => (uppercase ? h.toUpperCase() : h);
  const copyAll = async () => {
    const text = HASH_ALGORITHMS.map(
      (algo) => `${algo}: ${transform(hashes[algo])}`,
    ).join('\n');
    await navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">ハッシュ結果</span>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={copyAll}>
          全てコピー
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-3 py-2 text-left font-medium w-24">アルゴリズム</th>
              <th className="px-3 py-2 text-left font-medium font-mono">ハッシュ値</th>
              <th className="px-3 py-2 text-center font-medium w-12">コピー</th>
              {compareHashes && (
                <th className="px-3 py-2 text-center font-medium w-12">一致</th>
              )}
            </tr>
          </thead>
          <tbody>
            {HASH_ALGORITHMS.map((algo) => {
              const val = transform(hashes[algo]);
              const cmpVal = compareHashes ? transform(compareHashes[algo]) : null;
              const matches = cmpVal ? val === cmpVal : null;
              return (
                <tr key={algo} className="border-t">
                  <td className="px-3 py-2 font-medium">{algo}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground break-all">{val}</td>
                  <td className="px-3 py-2 text-center">
                    <CopyBtn text={val} />
                  </td>
                  {compareHashes && (
                    <td className="px-3 py-2 text-center">
                      {matches === null ? '-' : matches ? '✅' : '❌'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HashGeneratorTab() {
  const [mode, setMode] = useState<Mode>('text');
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [hashes2, setHashes2] = useState<Hashes | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [checkHash, setCheckHash] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate on text input (debounced)
  // Note: empty string is a valid input (its hashes are well-defined, e.g. MD5 = d41d8cd...)
  useEffect(() => {
    if (mode !== 'text' && mode !== 'compare') return;
    if (input === null || input === undefined) { setHashes(null); return; }
    const t = setTimeout(async () => {
      setIsGenerating(true);
      try {
        setHashes(await generateAllHashes(input));
      } finally {
        setIsGenerating(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [input, mode]);

  useEffect(() => {
    if (mode !== 'compare') return;
    if (!input2) { setHashes2(null); return; }
    const t = setTimeout(async () => {
      setHashes2(await generateAllHashes(input2));
    }, 300);
    return () => clearTimeout(t);
  }, [input2, mode]);

  const handleFile = async (file: File) => {
    setIsGenerating(true);
    setFileInfo(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    try {
      const buf = await file.arrayBuffer();
      setHashes(await generateAllHashes(buf));
    } finally {
      setIsGenerating(false);
    }
  };

  const MODE_TABS: { id: Mode; label: string }[] = [
    { id: 'text', label: 'テキスト' },
    { id: 'compare', label: '2つの文字列を比較' },
    { id: 'file', label: 'ファイル' },
  ];

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-1 flex-wrap">
        {MODE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setMode(t.id); setHashes(null); setHashes2(null); setFileInfo(null); }}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === t.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Text mode */}
      {(mode === 'text' || mode === 'compare') && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {mode === 'compare' ? '文字列 1' : 'テキスト入力'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              placeholder="ハッシュを生成したいテキストを入力"
              className={textareaCls}
            />
          </div>
          {mode === 'compare' && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                文字列 2
              </label>
              <textarea
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                rows={5}
                placeholder="比較する文字列を入力"
                className={textareaCls}
              />
            </div>
          )}
        </div>
      )}

      {/* File mode */}
      {mode === 'file' && (
        <div className="space-y-3">
          <div
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg px-4 py-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <p className="text-sm text-muted-foreground">ファイルをドロップ、またはクリックして選択</p>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {fileInfo && <p className="text-xs text-muted-foreground">読み込み済み: {fileInfo}</p>}

          {/* Checksum verification */}
          {hashes && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                チェックサム検証（期待するハッシュ値を入力）
              </label>
              <input
                type="text"
                value={checkHash}
                onChange={(e) => setCheckHash(e.target.value)}
                placeholder="期待するハッシュ値（任意のアルゴリズム）"
                className="w-full px-3 py-2 text-xs font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {checkHash && (
                <p className={`text-xs mt-1 font-medium ${
                  Object.values(hashes).some(
                    (h) => h.toLowerCase() === checkHash.toLowerCase(),
                  )
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {Object.values(hashes).some(
                    (h) => h.toLowerCase() === checkHash.toLowerCase(),
                  )
                    ? '✅ ハッシュが一致しました'
                    : '❌ ハッシュが一致しません'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Case toggle */}
      <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
        <input
          type="checkbox"
          checked={uppercase}
          onChange={(e) => setUppercase(e.target.checked)}
          className="rounded"
        />
        大文字で表示
      </label>

      {isGenerating && <p className="text-xs text-muted-foreground">計算中...</p>}

      {/* Results */}
      {hashes && !isGenerating && (
        <HashTable
          hashes={hashes}
          uppercase={uppercase}
          compareHashes={mode === 'compare' && hashes2 ? hashes2 : undefined}
        />
      )}
    </div>
  );
}
