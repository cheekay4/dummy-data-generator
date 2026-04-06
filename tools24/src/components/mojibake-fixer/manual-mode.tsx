'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ENCODING_LABELS, fixMojibake, type SupportedEncoding } from '@/lib/mojibake-fixer/convert';

interface ManualModeProps {
  inputText: string;
  onFixed: (text: string) => void;
}

const ENCODINGS = Object.keys(ENCODING_LABELS) as SupportedEncoding[];

export default function ManualMode({ inputText, onFixed }: ManualModeProps) {
  const [from, setFrom] = useState<SupportedEncoding>('SJIS');
  const [to, setTo] = useState<SupportedEncoding>('UTF8');

  const handleConvert = () => {
    const fixed = fixMojibake(inputText, from, to);
    onFixed(fixed);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="manual">
        <AccordionTrigger className="text-sm">手動モード（エンコーディング指定）</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>元エンコーディング（誤解釈された側）</Label>
                <Select value={from} onValueChange={(v) => setFrom(v as SupportedEncoding)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENCODINGS.map((enc) => (
                      <SelectItem key={enc} value={enc}>
                        {ENCODING_LABELS[enc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>変換先エンコーディング（正しい側）</Label>
                <Select value={to} onValueChange={(v) => setTo(v as SupportedEncoding)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENCODINGS.map((enc) => (
                      <SelectItem key={enc} value={enc}>
                        {ENCODING_LABELS[enc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleConvert} disabled={!inputText || from === to}>
              変換する
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
