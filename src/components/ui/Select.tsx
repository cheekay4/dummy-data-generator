import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={`
            w-full px-5 py-4
            bg-[rgba(255,255,255,0.03)]
            border-2 rounded-2xl
            font-mono text-[15px] text-white
            focus:outline-none focus:border-[var(--brand-accent)] focus:bg-[rgba(255,255,255,0.05)]
            transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? 'border-[#ef4444]' : 'border-[rgba(255,255,255,0.1)]'}
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#0A0A0A] text-[rgba(255,255,255,0.5)]">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0A0A] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-[11px] text-[#ef4444] font-mono">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
