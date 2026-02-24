'use client';

import { useState, useEffect } from 'react';
import {
  parseJWT,
  unixToJST,
  getTokenStatus,
  formatTokenStatus,
  type ParsedJWT,
} from '@/lib/encode-decode/jwt';

const TIMESTAMP_KEYS = ['exp', 'nbf', 'iat'];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="px-2 py-0.5 text-xs border rounded hover:bg-muted transition-colors"
    >
      {copied ? '✓' : 'コピー'}
    </button>
  );
}

function JsonDisplay({
  data,
  highlightTimestamps,
}: {
  data: Record<string, unknown>;
  highlightTimestamps?: boolean;
}) {
  const entries = Object.entries(data);
  return (
    <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">
      {'{\n'}
      {entries.map(([k, v], i) => {
        const isTs = highlightTimestamps && TIMESTAMP_KEYS.includes(k) && typeof v === 'number';
        const comma = i < entries.length - 1 ? ',' : '';
        return (
          <span key={k}>
            {'  '}
            <span className="text-blue-600 dark:text-blue-400">&quot;{k}&quot;</span>
            {': '}
            <span className={isTs ? 'text-amber-600 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}>
              {JSON.stringify(v)}
            </span>
            {comma}
            {isTs && (
              <span className="text-muted-foreground ml-2 text-xs not-italic">
                {`// ${unixToJST(v as number)}`}
              </span>
            )}
            {'\n'}
          </span>
        );
      })}
      {'}'}
    </pre>
  );
}

export function JwtDecoderTab() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedJWT | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setError(null);
      return;
    }
    const timer = setTimeout(() => {
      try {
        setParsed(parseJWT(input));
        setError(null);
      } catch (e) {
        setParsed(null);
        setError(e instanceof Error ? e.message : '解析に失敗しました');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const tokenStatus = parsed ? getTokenStatus(parsed.payload) : null;
  const statusDisplay = tokenStatus ? formatTokenStatus(tokenStatus) : null;

  const statusColor =
    statusDisplay?.color === 'green'
      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
      : statusDisplay?.color === 'red'
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
      : statusDisplay?.color === 'yellow'
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
      : 'text-muted-foreground bg-muted/30 border-border';

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          JWTトークン（入力と同時にリアルタイムでデコード）
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          className="w-full px-3 py-2 text-xs font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y break-all"
          spellCheck={false}
        />
        {input && !parsed && !error && (
          <p className="text-xs text-muted-foreground mt-1">解析中...</p>
        )}
      </div>

      {error && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
          {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-4">
          {/* Status badge */}
          {statusDisplay && (
            <div className={`px-3 py-2 border rounded-md text-xs font-medium ${statusColor}`}>
              {statusDisplay.color === 'green' ? '🟢' : statusDisplay.color === 'red' ? '🔴' : '🟡'}{' '}
              {statusDisplay.label}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/40 px-3 py-2 flex items-center justify-between border-b border-red-200 dark:border-red-800">
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                ヘッダー
              </span>
              <CopyBtn text={JSON.stringify(parsed.header, null, 2)} />
            </div>
            <div className="px-3 py-3 bg-red-50/30 dark:bg-red-950/20">
              <JsonDisplay data={parsed.header} />
            </div>
          </div>

          {/* Payload */}
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-purple-50 dark:bg-purple-950/40 px-3 py-2 flex items-center justify-between border-b border-purple-200 dark:border-purple-800">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                ペイロード
              </span>
              <CopyBtn text={JSON.stringify(parsed.payload, null, 2)} />
            </div>
            <div className="px-3 py-3 bg-purple-50/30 dark:bg-purple-950/20">
              <JsonDisplay data={parsed.payload} highlightTimestamps />
            </div>
          </div>

          {/* Signature */}
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-cyan-50 dark:bg-cyan-950/40 px-3 py-2 flex items-center justify-between border-b border-cyan-200 dark:border-cyan-800">
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                署名（Signature）
              </span>
              <CopyBtn text={parsed.signature} />
            </div>
            <div className="px-3 py-3 bg-cyan-50/30 dark:bg-cyan-950/20">
              <p className="text-xs font-mono break-all text-muted-foreground">
                {parsed.signature}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                ※ 署名の検証にはサーバーサイドで秘密鍵が必要です。このツールではデコードのみ行います。
              </p>
            </div>
          </div>
        </div>
      )}

      {!input && (
        <div className="text-xs text-muted-foreground space-y-1 px-1">
          <p>JWT（JSON Web Token）は <code className="bg-muted px-1 rounded">header.payload.signature</code> の3パート構造です。</p>
          <p>ペイロードの <code className="bg-muted px-1 rounded">iat</code>・<code className="bg-muted px-1 rounded">exp</code>・<code className="bg-muted px-1 rounded">nbf</code> フィールドは自動的にJST日時に変換されます。</p>
        </div>
      )}
    </div>
  );
}
