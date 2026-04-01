import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'relative overflow-hidden bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white border-transparent hover:scale-105 hover:shadow-2xl',
  secondary: 'bg-[rgba(20,20,20,0.6)] text-white border-2 border-[rgba(255,255,255,0.2)] backdrop-blur-xl hover:bg-[rgba(40,40,40,0.8)] hover:border-[rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-2xl',
  ghost: 'bg-transparent text-[rgba(255,255,255,0.6)] border-transparent hover:text-white hover:bg-[rgba(255,255,255,0.05)]',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-transparent hover:opacity-90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-3 text-[14px] rounded-xl',
  md: 'px-10 py-5 text-[17px] rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          group inline-flex items-center justify-center gap-2
          font-sora font-bold
          border
          transition-all duration-300
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        disabled={disabled}
        {...props}
      >
        {variant === 'primary' && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';
