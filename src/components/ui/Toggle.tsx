'use client';

interface ToggleProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  labels?: { on: string; off: string; unset: string };
}

export function Toggle({
  value,
  onChange,
  labels = { on: '対応', off: '非対応', unset: '未設定' },
}: ToggleProps): JSX.Element {
  const options = [
    { key: 'on', val: true as boolean | null, label: labels.on },
    { key: 'off', val: false as boolean | null, label: labels.off },
    { key: 'unset', val: null as boolean | null, label: labels.unset },
  ];

  return (
    <div className="inline-flex border border-washi rounded-[4px] overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`
            px-2.5 py-1
            font-sora text-[10px] font-medium
            transition-colors duration-150
            ${
              value === opt.val
                ? 'bg-sumi text-kinari'
                : 'bg-kinari-surface text-fude hover:bg-washi-light'
            }
          `.trim()}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
