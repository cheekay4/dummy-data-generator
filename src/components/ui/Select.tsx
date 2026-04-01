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
            w-full px-3 py-1.5
            bg-kinari-surface
            border rounded-[4px]
            font-sora text-[12px] text-sumi
            focus:outline-none focus:border-sumi
            transition-colors duration-150
            disabled:bg-washi-light disabled:text-fude-muted
            ${error ? 'border-shu' : 'border-washi'}
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-[10px] text-shu font-sora">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
