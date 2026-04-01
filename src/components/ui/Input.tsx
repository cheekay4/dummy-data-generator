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
            w-full px-3 py-1.5
            bg-kinari-surface
            border rounded-[4px]
            font-sora text-[12px] text-sumi
            placeholder:text-fude-light
            focus:outline-none focus:border-sumi
            transition-colors duration-150
            disabled:bg-washi-light disabled:text-fude-muted disabled:border-fude-dim
            ${error ? 'border-shu' : 'border-washi'}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[10px] text-shu font-sora">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
