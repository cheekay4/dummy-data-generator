'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PRESET_COLORS, type StampOptions } from '@/lib/digital-stamp/stamp-types';

interface StyleOptionsProps {
  options: StampOptions;
  onChange: (opts: StampOptions) => void;
}

const LINE_WIDTHS = [
  { label: '細', value: 1 },
  { label: '中', value: 2 },
  { label: '太', value: 4 },
];

export default function StyleOptions({ options, onChange }: StyleOptionsProps) {
  const set = <K extends keyof StampOptions>(key: K, value: StampOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* カラー */}
      <div className="space-y-2">
        <Label>色</Label>
        <div className="flex gap-2 flex-wrap items-center">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.name}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                options.color === c.value ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.value }}
              onClick={() => set('color', c.value)}
            />
          ))}
          <div className="flex items-center gap-1">
            <Label className="text-xs">カスタム</Label>
            <input
              type="color"
              value={options.color}
              onChange={(e) => set('color', e.target.value)}
              className="h-8 w-12 rounded border cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* サイズ */}
      <div className="space-y-2">
        <Label>サイズ: {options.size}px</Label>
        <Slider
          min={100}
          max={500}
          step={10}
          value={[options.size]}
          onValueChange={([v]) => set('size', v)}
        />
      </div>

      {/* 線の太さ */}
      <div className="space-y-2">
        <Label>線の太さ</Label>
        <div className="flex gap-2">
          {LINE_WIDTHS.map((lw) => (
            <Button
              key={lw.value}
              variant={options.lineWidth === lw.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => set('lineWidth', lw.value)}
            >
              {lw.label}
            </Button>
          ))}
        </div>
      </div>

      {/* フォント */}
      <div className="space-y-2">
        <Label>フォント</Label>
        <Select value={options.fontStyle} onValueChange={(v) => set('fontStyle', v as StampOptions['fontStyle'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mincho">明朝体</SelectItem>
            <SelectItem value="kaisho">楷書体風</SelectItem>
            <SelectItem value="tensho">篆書体風</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* かすれ */}
      <div className="space-y-2">
        <Label>かすれ効果</Label>
        <div className="flex gap-2">
          {(['none', 'light', 'strong'] as const).map((w) => (
            <Button
              key={w}
              variant={options.wear === w ? 'default' : 'outline'}
              size="sm"
              onClick={() => set('wear', w)}
            >
              {w === 'none' ? 'なし' : w === 'light' ? '弱' : '強'}
            </Button>
          ))}
        </div>
      </div>

      {/* 回転 */}
      <div className="space-y-2">
        <Label>回転: {options.rotation}°</Label>
        <Slider
          min={-15}
          max={15}
          step={1}
          value={[options.rotation]}
          onValueChange={([v]) => set('rotation', v)}
        />
      </div>
    </div>
  );
}
