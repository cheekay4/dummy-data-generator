'use client';

import { Button } from '@/components/ui/button';
import { PRESETS } from '@/lib/zenkaku-hankaku/presets';
import type { ConvertOptions } from '@/lib/zenkaku-hankaku/converter';

interface PresetButtonsProps {
  onChange: (options: ConvertOptions) => void;
}

export default function PresetButtons({ onChange }: PresetButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">プリセット</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => onChange(preset.options)}
            title={preset.description}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
