'use client';

import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps): JSX.Element {
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5
        font-mono text-[11px] font-semibold
        border border-[rgba(255,255,255,0.15)] rounded-lg
        bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]
        hover:bg-[rgba(255,255,255,0.1)] hover:text-white
        transition-all duration-300
        ${className}
      `.trim()}
    >
      {copied ? (
        <>
          <Check size={12} className="text-[#10b981]" />
          <span className="text-[#10b981]">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
