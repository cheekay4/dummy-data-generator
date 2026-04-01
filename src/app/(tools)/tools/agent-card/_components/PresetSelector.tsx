'use client';

import { presets } from '@/lib/presets';

interface PresetSelectorProps {
  onSelect: (presetId: string) => void;
  activePreset: string | null;
}

export function PresetSelector({ onSelect, activePreset }: PresetSelectorProps): JSX.Element {
  return (
    <div className="mb-6">
      <label className="block mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
        テンプレート
      </label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className={`
                group relative overflow-hidden
                px-5 py-2.5 rounded-full font-sora text-[13px] font-semibold
                transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white shadow-lg'
                  : 'bg-[rgba(20,20,20,0.6)] text-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:text-white backdrop-blur-xl'
                }
              `}
              title={preset.description}
            >
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
              <span className="relative">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
