'use client';

import { TEMPLATES } from '@/lib/keigo/templates';
import type { RecipientType, EmailType } from '@/lib/keigo/types';

interface TemplateChipsProps {
  onSelect: (subject: string, body: string, recipient: RecipientType, type: EmailType) => void;
}

export function TemplateChips({ onSelect }: TemplateChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.subject, t.body, t.recipient, t.type)}
          className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
