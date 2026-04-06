'use client';

import type { StampType } from '@/lib/digital-stamp/stamp-types';

interface StampTypeSelectorProps {
  value: StampType;
  onChange: (type: StampType) => void;
}

const TYPES: { value: StampType; label: string; preview: string }[] = [
  { value: 'maru-sei', label: '丸印（姓）', preview: '○' },
  { value: 'maru-full', label: '丸印（姓名）', preview: '◎' },
  { value: 'kaku', label: '角印', preview: '□' },
  { value: 'date', label: '日付印', preview: '⊕' },
];

export default function StampTypeSelector({ value, onChange }: StampTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">印鑑タイプ</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`border rounded-lg p-3 text-center transition-all ${
              value === type.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-1">{type.preview}</div>
            <div className="text-xs">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
