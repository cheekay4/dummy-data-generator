'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DirectionToggle from './direction-toggle';
import ConversionOptions from './conversion-options';
import PresetButtons from './preset-buttons';
import { convert, type ConvertOptions } from '@/lib/zenkaku-hankaku/converter';

const SAMPLE_TEXT = 'Hello World　１２３　ＡＢＣＤ　ｶﾀｶﾅ　カタカナ　ひらがな';

const DEFAULT_OPTIONS: ConvertOptions = {
  direction: 'toHalf',
  convertAlpha: true,
  convertDigit: true,
  convertSymbol: true,
  convertSpace: true,
  convertKatakana: true,
  hiraganaToKata: false,
  kataToHiragana: false,
  toUpper: false,
  toLower: false,
};

export default function ZenkakuHankakuMain() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ConvertOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);

  const { result, changedCount } = convert(input, options);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const handleOptionsChange = (newOptions: ConvertOptions) => {
    setOptions(newOptions);
  };

  // ハイライト表示：変換前後で変わった文字を黄色ハイライト
  const buildHighlighted = () => {
    const chars = result.split('');
    const inputChars = input.split('');
    const highlighted: { char: string; changed: boolean }[] = chars.map((char, i) => ({
      char,
      changed: char !== inputChars[i],
    }));
    return highlighted;
  };

  const highlighted = input ? buildHighlighted() : [];

  return (
    <div className="space-y-6">
      {/* 入力エリア */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">入力テキスト</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_TEXT)}>
              サンプル貼り付け
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput('')}>
              クリア
            </Button>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="変換したいテキストを入力..."
          className="min-h-[120px] font-mono"
        />
        <p className="text-xs text-muted-foreground text-right">{input.length} 文字</p>
      </div>

      {/* 変換方向 */}
      <DirectionToggle
        direction={options.direction}
        onChange={(direction) => setOptions({ ...options, direction })}
      />

      {/* 変換オプション */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-3">変換対象</p>
          <ConversionOptions options={options} onChange={handleOptionsChange} />
        </CardContent>
      </Card>

      {/* プリセット */}
      <PresetButtons onChange={handleOptionsChange} />

      {/* 変換結果 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">変換結果</p>
            {input && changedCount > 0 && (
              <Badge variant="secondary">{changedCount} 文字を変換しました</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!result}>
              {copied ? 'コピーしました ✓' : 'コピー'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!result}>
              ダウンロード (.txt)
            </Button>
          </div>
        </div>
        <Textarea
          value={result}
          readOnly
          className="min-h-[120px] font-mono bg-muted"
          placeholder="変換結果がここに表示されます"
        />
      </div>

      {/* 変換ハイライト */}
      {highlighted.length > 0 && changedCount > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="highlight">
            <AccordionTrigger className="text-sm">変換箇所のハイライト表示</AccordionTrigger>
            <AccordionContent>
              <div className="font-mono text-sm p-3 bg-muted rounded-md break-all leading-relaxed">
                {highlighted.map((item, i) => (
                  <span
                    key={i}
                    className={item.changed ? 'bg-yellow-200 dark:bg-yellow-800 rounded px-0.5' : ''}
                  >
                    {item.char}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
