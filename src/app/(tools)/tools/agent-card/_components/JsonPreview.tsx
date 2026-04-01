'use client';

import { useMemo } from 'react';

interface JsonPreviewProps {
  json: string;
}

interface JsonToken {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation';
  value: string;
}

function tokenizeJson(json: string): JsonToken[][] {
  const lines = json.split('\n');
  return lines.map((line) => {
    const tokens: JsonToken[] = [];
    let remaining = line;
    while (remaining.length > 0) {
      const keyMatch = remaining.match(/^(\s*)"([^"]*)"(\s*:)/);
      if (keyMatch) {
        if (keyMatch[1]) tokens.push({ type: 'punctuation', value: keyMatch[1] });
        tokens.push({ type: 'key', value: `"${keyMatch[2]}"` });
        tokens.push({ type: 'punctuation', value: keyMatch[3] });
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }
      const strMatch = remaining.match(/^(\s*)"([^"]*)"/);
      if (strMatch) {
        if (strMatch[1]) tokens.push({ type: 'punctuation', value: strMatch[1] });
        tokens.push({ type: 'string', value: `"${strMatch[2]}"` });
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }
      const numMatch = remaining.match(/^(\s*)(-?\d+\.?\d*)/);
      if (numMatch) {
        if (numMatch[1]) tokens.push({ type: 'punctuation', value: numMatch[1] });
        tokens.push({ type: 'number', value: numMatch[2] });
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      const boolMatch = remaining.match(/^(\s*)(true|false|null)/);
      if (boolMatch) {
        if (boolMatch[1]) tokens.push({ type: 'punctuation', value: boolMatch[1] });
        tokens.push({ type: boolMatch[2] === 'null' ? 'null' : 'boolean', value: boolMatch[2] });
        remaining = remaining.slice(boolMatch[0].length);
        continue;
      }
      tokens.push({ type: 'punctuation', value: remaining[0] });
      remaining = remaining.slice(1);
    }
    return tokens;
  });
}

const colorMap: Record<JsonToken['type'], string> = {
  key: 'text-code-key',
  string: 'text-code-string',
  number: 'text-code-number',
  boolean: 'text-code-number',
  null: 'text-[rgba(255,255,255,0.3)]',
  punctuation: 'text-[#e5e7eb]',
};

export function JsonPreview({ json }: JsonPreviewProps): JSX.Element {
  const tokenized = useMemo(() => tokenizeJson(json), [json]);

  return (
    <div className="bg-[rgba(17,24,39,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-2xl">
      {/* macOS dots header */}
      <div className="flex items-center gap-3 px-6 py-3 bg-[rgba(31,41,55,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
        <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
        <div className="w-3 h-3 rounded-full bg-[#10b981]" />
        <span className="ml-3 font-mono text-[12px] font-semibold text-[rgba(255,255,255,0.6)]">
          agent-card.json
        </span>
      </div>
      {/* Glow effect */}
      <div className="relative">
        <div
          className="absolute -inset-1 opacity-30 blur-xl rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(160deg, #1E4D7B, #D84835)' }}
        />
        <div className="relative bg-[rgba(17,24,39,0.9)] overflow-auto max-h-[calc(100vh-200px)] p-6">
          <pre className="font-mono text-[13px] leading-[1.8]">
            {tokenized.map((line, lineIdx) => (
              <div key={lineIdx}>
                {line.map((token, tokenIdx) => (
                  <span key={tokenIdx} className={colorMap[token.type]}>
                    {token.value}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
