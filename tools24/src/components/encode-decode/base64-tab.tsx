'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { encodeBase64, decodeBase64, fileToBase64, byteCount } from '@/lib/encode-decode/base64';

const textareaCls =
  'w-full px-3 py-2 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y';
const selectCls =
  'px-2 py-1 text-xs border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring';

type Encoding = 'utf-8' | 'shift-jis' | 'euc-jp';

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} className="h-7 px-2 text-xs">
      {copied ? 'コピーしました ✓' : 'コピー'}
    </Button>
  );
}

export function Base64Tab() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encoding, setEncoding] = useState<Encoding>('utf-8');
  const [dataUri, setDataUri] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runEncode = () => {
    try {
      setOutput(encodeBase64(input));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エンコードに失敗しました');
    }
  };

  const runDecode = () => {
    try {
      setOutput(decodeBase64(input, encoding));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'デコードに失敗しました');
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`ファイルサイズが大きすぎます（${(file.size / 1024 / 1024).toFixed(1)} MB）。10MB以下のファイルを使用してください。`);
      return;
    }
    try {
      const { base64, dataUri: uri } = await fileToBase64(file);
      setOutput(dataUri ? uri : base64);
      setFileInfo(`${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type || '不明'})`);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ファイルの読み込みに失敗しました');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
          <label className="text-xs font-medium text-muted-foreground">入力</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {byteCount(input)} bytes
            </span>
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value as Encoding)}
              className={selectCls}
              title="デコード時の文字コード"
            >
              <option value="utf-8">UTF-8</option>
              <option value="shift-jis">Shift_JIS</option>
              <option value="euc-jp">EUC-JP</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => { setInput(''); setOutput(''); setError(null); setFileInfo(null); }}
            >
              クリア
            </Button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          placeholder="エンコードまたはデコードしたいテキストを入力"
          className={textareaCls}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={runEncode}>エンコード ↓</Button>
        <Button variant="secondary" onClick={runDecode}>デコード ↓</Button>
      </div>

      {error && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1 gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            出力 {output && <span className="font-normal">({byteCount(output)} bytes)</span>}
          </label>
          {output && <CopyBtn text={output} />}
        </div>
        <textarea
          value={output}
          readOnly
          rows={10}
          placeholder="変換結果がここに表示されます"
          className={`${textareaCls} bg-muted/30`}
        />
      </div>

      {/* File drop */}
      <div className="border-t pt-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          ファイルをBase64に変換
        </p>
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dataUri}
              onChange={(e) => setDataUri(e.target.checked)}
              className="rounded"
            />
            Data URI形式（data:image/png;base64,...）
          </label>
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition-colors text-sm ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <p className="text-muted-foreground">
            ファイルをドロップ、またはクリックして選択
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            画像・PDF・テキスト等あらゆるファイルに対応
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {fileInfo && (
          <p className="text-xs text-muted-foreground mt-1">
            読み込み済み: {fileInfo}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        ※ エンコードはUTF-8で実行されます。文字コード選択はBase64デコード時のみ有効です。
      </p>
    </div>
  );
}
