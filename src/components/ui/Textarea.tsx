import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`
            w-full px-5 py-4
            bg-[rgba(255,255,255,0.03)]
            border-2 rounded-2xl
            font-mono text-[15px] text-white
            placeholder:text-[rgba(255,255,255,0.45)]
            focus:outline-none focus:border-[var(--brand-accent)] focus:bg-[rgba(255,255,255,0.05)]
            transition-all duration-300
            resize-y min-h-[100px]
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
Textarea.displayName = 'Textarea';
