'use client';
import { motion } from 'framer-motion';

export type InputMethod = 'text' | 'html' | 'json' | 'line-json';

const METHODS: { method: InputMethod; icon: string; name: string }[] = [
  { method: 'text',      icon: '📝', name: 'テキスト' },
  { method: 'html',      icon: '🌐', name: 'HTML' },
  { method: 'json',      icon: '{ }', name: 'JSON' },
  { method: 'line-json', icon: '💬', name: 'LINE JSON' },
];

interface Props {
  value: InputMethod;
  onChange: (method: InputMethod) => void;
}

export default function InputMethodTabs({ value, onChange }: Props) {
  return (
    <div className="bg-stone-100 rounded-xl p-1 inline-flex gap-1 w-full">
      {METHODS.map(({ method, icon, name }) => (
        <button
          key={method}
          onClick={() => onChange(method)}
          className="relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex-1 justify-center"
          style={{ color: value === method ? '#1C1917' : '#78716C' }}
        >
          {value === method && (
            <motion.span
              layoutId="input-method-indicator"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{icon}</span>
          <span className="relative z-10 hidden sm:inline">{name}</span>
        </button>
      ))}
    </div>
  );
}
