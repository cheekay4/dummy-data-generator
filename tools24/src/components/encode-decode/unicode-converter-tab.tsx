'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  convertText,
  getCharDetails,
  decodeJSUnicodeEscape,
  decodeHTMLEntities,
  fullWidthToHalfWidth,
  halfWidthToFullWidth,
  type UnicodeConversions,
} from '@/lib/encode-decode/unicode';

type InputMode = 'text-to-unicode' | 'escape-to-text';

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
    <button onClick={copy} className="px-2 py-0.5 text-xs border rounded hover:bg-muted transition-colors">
      {copied ? '✓' : '📋'}
    </button>
  );
}

const CONVERSION_ROWS: { key: keyof UnicodeConversions; label: string }[] = [
  { key: 'codePoints', label: 'Unicodeコードポイント' },
  { key: 'jsEscape', label: 'Unicodeエスケープ (JS)' },
  { key: 'htmlDecimal', label: 'HTMLエンティティ (10進)' },
  { key: 'htmlHex', label: 'HTMLエンティティ (16進)' },
  { key: 'utf8Bytes', label: 'UTF-8バイト列' },
  { key: 'utf16', label: 'UTF-16コード' },
  { key: 'percentEncoded', label: 'パーセントエンコード' },
];

export function UnicodeConverterTab() {
  const [inputMode, setInputMode] = useState<InputMode>('text-to-unicode');
  const [input, setInput] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const conversions = useMemo<UnicodeConversions | null>(() => {
    if (!input || inputMode !== 'text-to-unicode') return null;
    return convertText(input);
  }, [input, inputMode]);

  const decodedText = useMemo<string | null>(() => {
    if (!input || inputMode !== 'escape-to-text') return null;
    try {
      setDecodeError(null);
      // Try JS escape first, then HTML entities
      let result = decodeJSUnicodeEscape(input);
      result = decodeHTMLEntities(result);
      return result;
    } catch (e) {
      setDecodeError(e instanceof Error ? e.message : '変換に失敗しました');
      return null;
    }
  }, [input, inputMode]);

  const charDetails = useMemo(() => {
    if (!input || !showDetails || inputMode !== 'text-to-unicode') return null;
    return getCharDetails(input.slice(0, 100)); // limit to 100 chars for performance
  }, [input, showDetails, inputMode]);

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-1">
        {(
          [
            { id: 'text-to-unicode', label: 'テキスト → Unicode' },
            { id: 'escape-to-text', label: 'エスケープ → テキスト' },
          ] as { id: InputMode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => { setInputMode(m.id); setDecodeError(null); }}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              inputMode === m.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">入力</label>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setInput('')}
          >
            クリア
          </Button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={
            inputMode === 'text-to-unicode'
              ? '日本語テスト ABC 123 🎉'
              : '\\u65E5\\u672C\\u8A9E または &#26085;&#26412;&#35486;'
          }
          className={textareaCls}
        />
      </div>

      {/* Full-width / half-width buttons */}
      {inputMode === 'text-to-unicode' && input && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInput(fullWidthToHalfWidth(input))}
          >
            全角 → 半角
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInput(halfWidthToFullWidth(input))}
          >
            半角 → 全角
          </Button>
        </div>
      )}

      {/* Error */}
      {decodeError && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
          {decodeError}
        </div>
      )}

      {/* Decode result */}
      {inputMode === 'escape-to-text' && decodedText !== null && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-muted-foreground">デコード結果</label>
            <CopyBtn text={decodedText} />
          </div>
          <div className="px-3 py-2 bg-muted/30 border rounded-md text-sm font-medium min-h-[2.5rem] break-all">
            {decodedText || <span className="text-muted-foreground text-xs">（空）</span>}
          </div>
        </div>
      )}

      {/* Conversion table */}
      {conversions && (
        <div>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium w-48">形式</th>
                  <th className="px-3 py-2 text-left font-medium font-mono">結果</th>
                  <th className="px-3 py-2 text-center font-medium w-12">コピー</th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_ROWS.map(({ key, label }) => {
                  const val = conversions[key];
                  return (
                    <tr key={key} className="border-t">
                      <td className="px-3 py-2 font-medium text-muted-foreground">{label}</td>
                      <td className="px-3 py-2 font-mono break-all">{val}</td>
                      <td className="px-3 py-2 text-center">
                        <CopyBtn text={val} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Char details toggle */}
      {conversions && (
        <div>
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
              className="rounded"
            />
            1文字ごとの詳細を表示
            {input.length > 100 && ' (先頭100文字)'}
          </label>
        </div>
      )}

      {showDetails && charDetails && charDetails.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-2 py-2 text-left font-medium">文字</th>
                <th className="px-2 py-2 text-left font-medium">コードポイント</th>
                <th className="px-2 py-2 text-left font-medium font-mono">UTF-8バイト</th>
                <th className="px-2 py-2 text-left font-medium font-mono">UTF-16</th>
                <th className="px-2 py-2 text-left font-medium font-mono">%エンコード</th>
              </tr>
            </thead>
            <tbody>
              {charDetails.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1.5 text-base">{c.char}</td>
                  <td className="px-2 py-1.5 font-mono text-muted-foreground">
                    U+{c.codePointHex}
                  </td>
                  <td className="px-2 py-1.5 font-mono text-muted-foreground">{c.utf8Bytes}</td>
                  <td className="px-2 py-1.5 font-mono text-muted-foreground">{c.utf16}</td>
                  <td className="px-2 py-1.5 font-mono text-muted-foreground">
                    {c.percentEncoded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
