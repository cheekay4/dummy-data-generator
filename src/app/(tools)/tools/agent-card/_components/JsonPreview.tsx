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
      // Key (quoted string followed by colon)
      const keyMatch = remaining.match(/^(\s*)"([^"]*)"(\s*:)/);
      if (keyMatch) {
        if (keyMatch[1]) tokens.push({ type: 'punctuation', value: keyMatch[1] });
        tokens.push({ type: 'key', value: `"${keyMatch[2]}"` });
        tokens.push({ type: 'punctuation', value: keyMatch[3] });
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }
      // String value
      const strMatch = remaining.match(/^(\s*)"([^"]*)"/);
      if (strMatch) {
        if (strMatch[1]) tokens.push({ type: 'punctuation', value: strMatch[1] });
        tokens.push({ type: 'string', value: `"${strMatch[2]}"` });
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }
      // Number
      const numMatch = remaining.match(/^(\s*)(-?\d+\.?\d*)/);
      if (numMatch) {
        if (numMatch[1]) tokens.push({ type: 'punctuation', value: numMatch[1] });
        tokens.push({ type: 'number', value: numMatch[2] });
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      // Boolean / null
      const boolMatch = remaining.match(/^(\s*)(true|false|null)/);
      if (boolMatch) {
        if (boolMatch[1]) tokens.push({ type: 'punctuation', value: boolMatch[1] });
        tokens.push({ type: boolMatch[2] === 'null' ? 'null' : 'boolean', value: boolMatch[2] });
        remaining = remaining.slice(boolMatch[0].length);
        continue;
      }
      // Punctuation (brackets, commas, etc.)
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
  null: 'text-fude',
  punctuation: 'text-fude-light',
};

export function JsonPreview({ json }: JsonPreviewProps): JSX.Element {
  const tokenized = useMemo(() => tokenizeJson(json), [json]);

  return (
    <div className="overflow-auto max-h-[calc(100vh-200px)] p-3">
      <pre className="font-mono text-[10px] leading-[1.6]">
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
  );
}
