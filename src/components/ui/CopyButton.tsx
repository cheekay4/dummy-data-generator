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
        inline-flex items-center gap-1
        px-2.5 py-1
        font-mono text-[11px]
        border border-washi rounded-[4px]
        bg-kinari-surface text-fude
        hover:bg-washi-light hover:text-sumi
        transition-colors duration-150
        ${className}
      `.trim()}
    >
      {copied ? (
        <>
          <Check size={12} />
          <span>copied</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>copy</span>
        </>
      )}
    </button>
  );
}
