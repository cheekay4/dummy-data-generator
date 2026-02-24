'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  encodeComponent,
  decodeComponent,
  encodeFullURI,
  isEncoded,
  isDoubleEncoded,
  buildEncodingTable,
} from '@/lib/encode-decode/url-encode';

const textareaCls =
  'w-full px-3 py-2 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y';

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

export function UrlEncodeTab() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [encTable, setEncTable] = useState<
    { seq: string; char: string; codePoint: string }[]
  >([]);

  const run = (fn: () => string) => {
    try {
      const result = fn();
      setOutput(result);
      setError(null);
      const table = buildEncodingTable(input, result);
      setEncTable(table);
    } catch (e) {
      setError(e instanceof Error ? e.message : '変換に失敗しました');
    }
  };

  const doubleEncoded = isDoubleEncoded(input);
  const alreadyEncoded = isEncoded(input);

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {doubleEncoded && (
        <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-md text-xs text-amber-800 dark:text-amber-300">
          ⚠️ 二重エンコードの可能性があります（%25XX パターンを検出）
        </div>
      )}
      {!doubleEncoded && alreadyEncoded && (
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700 rounded-md text-xs text-blue-800 dark:text-blue-300">
          ℹ️ 入力にパーセントエンコード済みの文字が含まれています
        </div>
      )}

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">入力</label>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => { setInput(''); setOutput(''); setError(null); setEncTable([]); }}
          >
            クリア
          </Button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="https://example.com/検索?q=日本語テスト"
          className={textareaCls}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run(() => encodeComponent(input))}>
          エンコード ↓ (encodeURIComponent)
        </Button>
        <Button variant="secondary" onClick={() => run(() => decodeComponent(input))}>
          デコード ↓
        </Button>
        <Button variant="outline" onClick={() => run(() => encodeFullURI(input))}>
          全体エンコード ↓ (encodeURI)
        </Button>
      </div>

      {error && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">出力</label>
          {output && <CopyBtn text={output} />}
        </div>
        <textarea
          value={output}
          readOnly
          rows={6}
          placeholder="変換結果がここに表示されます"
          className={`${textareaCls} bg-muted/30`}
        />
      </div>

      {/* Encoding table */}
      {encTable.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            エンコードされた文字の内訳
          </p>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">文字</th>
                  <th className="px-3 py-2 text-left font-medium">Unicodeコードポイント</th>
                  <th className="px-3 py-2 text-left font-medium font-mono">エンコード結果</th>
                </tr>
              </thead>
              <tbody>
                {encTable.map((row) => (
                  <tr key={row.char} className="border-t">
                    <td className="px-3 py-1.5 font-medium">{row.char}</td>
                    <td className="px-3 py-1.5 font-mono text-muted-foreground">{row.codePoint}</td>
                    <td className="px-3 py-1.5 font-mono text-blue-600 dark:text-blue-400">
                      {row.seq}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explanation */}
      <details className="border rounded-lg group">
        <summary className="px-3 py-2 text-xs font-medium cursor-pointer list-none flex items-center justify-between select-none">
          <span>encodeURIComponent と encodeURI の違い</span>
          <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-3 pb-3 border-t pt-2 text-xs text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">encodeURIComponent</strong>：
            URLの<strong>部品</strong>（クエリパラメータの値など）をエンコード。
            <code className="bg-muted px-1 rounded">: / ? # [ ] @ ! $ &amp; &apos; ( ) * + , ; =</code> もエンコードします。
          </p>
          <p>
            <strong className="text-foreground">encodeURI</strong>：
            URL全体をエンコード。パス区切り（<code className="bg-muted px-1 rounded">/</code>）や
            クエリ区切り（<code className="bg-muted px-1 rounded">?</code><code className="bg-muted px-1 rounded">&</code>）は変換しません。
            URLの構造を保ちたい場合に使用します。
          </p>
        </div>
      </details>
    </div>
  );
}
