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
    <div className="inline-flex border-2 border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`
            px-4 py-2
            font-mono text-[11px] font-bold uppercase tracking-wider
            transition-all duration-300
            ${
              value === opt.val
                ? opt.key === 'on'
                  ? 'bg-[var(--brand-accent)] text-white'
                  : opt.key === 'off'
                  ? 'bg-[rgba(255,255,255,0.1)] text-white'
                  : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]'
                : 'bg-transparent text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.03)]'
            }
          `.trim()}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
