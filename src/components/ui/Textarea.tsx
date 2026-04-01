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
            w-full px-3 py-1.5
            bg-kinari-surface
            border rounded-[4px]
            font-sora text-[12px] text-sumi
            placeholder:text-fude-light
            focus:outline-none focus:border-sumi
            transition-colors duration-150
            resize-y min-h-[80px]
            disabled:bg-washi-light disabled:text-fude-muted
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
Textarea.displayName = 'Textarea';
