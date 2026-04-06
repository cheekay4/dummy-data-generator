'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { ConvertOptions } from '@/lib/zenkaku-hankaku/converter';

interface ConversionOptionsProps {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
}

export default function ConversionOptions({ options, onChange }: ConversionOptionsProps) {
  const set = (key: keyof ConvertOptions, value: boolean) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="convertAlpha"
          checked={options.convertAlpha}
          onCheckedChange={(v) => set('convertAlpha', !!v)}
        />
        <Label htmlFor="convertAlpha">英字（ABC）</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="convertDigit"
          checked={options.convertDigit}
          onCheckedChange={(v) => set('convertDigit', !!v)}
        />
        <Label htmlFor="convertDigit">数字（123）</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="convertSymbol"
          checked={options.convertSymbol}
          onCheckedChange={(v) => set('convertSymbol', !!v)}
        />
        <Label htmlFor="convertSymbol">記号（！＃等）</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="convertSpace"
          checked={options.convertSpace}
          onCheckedChange={(v) => set('convertSpace', !!v)}
        />
        <Label htmlFor="convertSpace">スペース</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="convertKatakana"
          checked={options.convertKatakana}
          onCheckedChange={(v) => set('convertKatakana', !!v)}
        />
        <Label htmlFor="convertKatakana">カタカナ</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="hiraganaToKata"
          checked={options.hiraganaToKata}
          onCheckedChange={(v) => set('hiraganaToKata', !!v)}
        />
        <Label htmlFor="hiraganaToKata">ひらがな→カタカナ</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="kataToHiragana"
          checked={options.kataToHiragana}
          onCheckedChange={(v) => set('kataToHiragana', !!v)}
        />
        <Label htmlFor="kataToHiragana">カタカナ→ひらがな</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="toUpper"
          checked={options.toUpper}
          onCheckedChange={(v) => set('toUpper', !!v)}
        />
        <Label htmlFor="toUpper">大文字化</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="toLower"
          checked={options.toLower}
          onCheckedChange={(v) => set('toLower', !!v)}
        />
        <Label htmlFor="toLower">小文字化</Label>
      </div>
    </div>
  );
}
