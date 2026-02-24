'use client';
import { ReactNode, useState } from 'react';

interface Props {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
        </span>
      )}
    </span>
  );
}
