'use client';

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
}

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled,
  showValue = true,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-sm text-stone-600 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1"
      />
      {showValue && (
        <span className="w-10 text-right text-sm font-mono-score text-stone-700 shrink-0">
          {value}%
        </span>
      )}
    </div>
  );
}
