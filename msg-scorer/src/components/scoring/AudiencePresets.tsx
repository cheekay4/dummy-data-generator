'use client';
import { useScoringStore } from '@/stores/scoring-store';
import { AUDIENCE_PRESETS } from '@/lib/presets';
import { trackEvent } from '@/lib/analytics';

const PRESET_KEYS = Object.keys(AUDIENCE_PRESETS);

export default function AudiencePresets() {
  const { audience, applyPreset } = useScoringStore();
  const currentPreset = audience.presetName;

  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_KEYS.map((key) => {
        const preset = AUDIENCE_PRESETS[key];
        const active = preset.presetName === currentPreset;
        return (
          <button
            key={key}
            onClick={() => { applyPreset(key); trackEvent('preset_selected', { preset_name: preset.presetName }); }}
            className={`px-4 py-2 rounded-lg text-sm border transition-all duration-150 ${
              active
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {preset.presetName}
          </button>
        );
      })}
    </div>
  );
}
