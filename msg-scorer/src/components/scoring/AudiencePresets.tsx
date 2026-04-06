'use client';
import { useScoringStore } from '@/stores/scoring-store';
import { AUDIENCE_PRESETS } from '@/lib/presets';
import { trackEvent } from '@/lib/analytics';

const DELIVERY_PRESETS = [
  'internet-population', 'women-magazine', 'young-women-ec',
  'btob-lead', 'senior', 'ec-general', 'family',
];

const BLOG_PRESETS = ['blog-tech', 'blog-lifestyle', 'blog-corporate'];

function PresetGroup({ label, keys }: { label: string; keys: string[] }) {
  const { audience, applyPreset } = useScoringStore();
  const currentPreset = audience.presetName;

  return (
    <div>
      <p className="text-xs text-stone-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {keys.map((key) => {
          const preset = AUDIENCE_PRESETS[key];
          if (!preset) return null;
          const active = preset.presetName === currentPreset;
          return (
            <button
              key={key}
              onClick={() => { applyPreset(key); trackEvent('preset_selected', { preset_name: preset.presetName }); }}
              className={`px-2 py-1 rounded-md text-xs border transition-all duration-150 ${
                active
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {preset.presetName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AudiencePresets() {
  return (
    <div className="space-y-3">
      <PresetGroup label="配信向け" keys={DELIVERY_PRESETS} />
      <PresetGroup label="ブログ向け" keys={BLOG_PRESETS} />
    </div>
  );
}
