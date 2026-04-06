'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { autoDetect, type DetectionResult } from '@/lib/mojibake-fixer/detect';
import DetectionPanel from './detection-panel';
import ManualMode from './manual-mode';
import ByteDumpPanel from './byte-dump-panel';

export default function MojibakeFixerMain() {
  const [input, setInput] = useState('');
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualResult, setManualResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [bomMode, setBomMode] = useState<'none' | 'bom'>('none');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // デバウンス300msでautoDetect
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) {
      setDetection(null);
      setManualResult('');
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      const result = autoDetect(input);
      setDetection(result);
      setIsLoading(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const displayResult = manualResult || detection?.fixedText || '';

  const handleFileRead = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setInput(text);
        setManualResult('');
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  }, []);

  const handleCopy = useCallback(async () => {
    if (!displayResult) return;
    await navigator.clipboard.writeText(displayResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [displayResult]);

  const handleDownload = useCallback(() => {
    if (!displayResult) return;
    let content: BlobPart;
    let type: string;
    if (bomMode === 'bom') {
      // UTF-8 BOM付き
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const encoder = new TextEncoder();
      const body = encoder.encode(displayResult);
      content = new Blob([bom, body], { type: 'text/plain;charset=utf-8' });
      type = 'text/plain;charset=utf-8';
    } else {
      content = displayResult;
      type = 'text/plain;charset=utf-8';
    }
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fixed.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [displayResult, bomMode]);

  return (
    <div className="space-y-6">
      {/* 入力エリア */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium">文字化けテキスト</p>
          <div className="flex gap-2 flex-wrap">
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                ファイル読み込み
              </span>
              <input
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={handleFileRead}
              />
            </label>
            <Button variant="outline" size="sm" onClick={() => { setInput(''); setManualResult(''); setDetection(null); }}>
              クリア
            </Button>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setManualResult(''); }}
          placeholder="文字化けしたテキストをここに貼り付けてください..."
          className="min-h-[150px] font-mono text-sm"
          rows={10}
        />
      </div>

      {/* 自動判定結果 */}
      {(isLoading || detection) && (
        <DetectionPanel result={detection} isLoading={isLoading} />
      )}

      {/* 修復結果 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium">修復結果</p>
          <div className="flex gap-2 flex-wrap items-center">
            <select
              value={bomMode}
              onChange={(e) => setBomMode(e.target.value as 'none' | 'bom')}
              className="text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="none">UTF-8（BOMなし）</option>
              <option value="bom">UTF-8（BOM付き・Excel対応）</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!displayResult}>
              {copied ? 'コピーしました ✓' : 'コピー'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!displayResult}>
              ダウンロード
            </Button>
          </div>
        </div>
        <Textarea
          value={displayResult}
          readOnly
          className="min-h-[150px] font-mono text-sm bg-muted"
          placeholder="修復結果がここに表示されます"
          rows={10}
        />
      </div>

      {/* 手動モード */}
      <ManualMode inputText={input} onFixed={setManualResult} />

      {/* バイトダンプ */}
      <ByteDumpPanel text={input} />
    </div>
  );
}
