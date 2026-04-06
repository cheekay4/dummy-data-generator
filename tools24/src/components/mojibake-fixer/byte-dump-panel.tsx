'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ENCODING_LABELS, type SupportedEncoding } from '@/lib/mojibake-fixer/convert';
import Encoding from 'encoding-japanese';

interface ByteDumpPanelProps {
  text: string;
}

const DISPLAY_ENCODINGS: SupportedEncoding[] = ['UTF8', 'SJIS', 'EUCJP'];

function getHexDump(text: string): string {
  const codes = Encoding.stringToCode(text.slice(0, 64));
  return codes
    .slice(0, 256)
    .map((c) => c.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

function getEncodingBytes(text: string, enc: SupportedEncoding): string {
  try {
    const codes = Encoding.stringToCode(text.slice(0, 32));
    const converted = Encoding.convert(codes, { to: enc, from: 'UNICODE' });
    return converted
      .slice(0, 64)
      .map((c) => c.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  } catch {
    return 'エラー';
  }
}

export default function ByteDumpPanel({ text }: ByteDumpPanelProps) {
  if (!text) return null;

  const hexDump = getHexDump(text);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="bytedump">
        <AccordionTrigger className="text-sm">バイトダンプ（16進数表示）</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">入力テキストのバイト列（最大256バイト）</p>
              <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                {hexDump}
              </pre>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">各エンコーディングで解釈した場合</p>
              <div className="space-y-2">
                {DISPLAY_ENCODINGS.map((enc) => (
                  <div key={enc} className="grid grid-cols-[100px_1fr] gap-2 items-start">
                    <span className="text-xs font-medium">{ENCODING_LABELS[enc]}</span>
                    <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                      {getEncodingBytes(text, enc)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
