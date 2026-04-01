'use client';

import { presets } from '@/lib/presets';

interface PresetSelectorProps {
  onSelect: (presetId: string) => void;
  activePreset: string | null;
}

export function PresetSelector({ onSelect, activePreset }: PresetSelectorProps): JSX.Element {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-mono text-[9px] tracking-wide text-fude uppercase">
        テンプレート
      </label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className={`
                px-3 py-1 rounded-full font-sora text-[11px]
                border transition-colors duration-150
                ${isActive
                  ? 'bg-sumi text-kinari border-sumi'
                  : 'bg-kinari-surface text-fude border-washi hover:bg-washi-light hover:text-sumi'
                }
              `}
              title={preset.description}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
