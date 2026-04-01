import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-5 py-4
            bg-[rgba(255,255,255,0.03)]
            border-2 rounded-2xl
            font-mono text-[15px] text-white
            placeholder:text-[rgba(255,255,255,0.45)]
            focus:outline-none focus:border-[var(--brand-accent)] focus:bg-[rgba(255,255,255,0.05)]
            transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? 'border-[#ef4444]' : 'border-[rgba(255,255,255,0.1)]'}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[11px] text-[#ef4444] font-mono">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
