'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { useUser } from '@/hooks/useUser';

interface Props {
  onSaved?: () => void;
}

export default function SaveSegmentButton({ onSaved }: Props) {
  const { audience } = useScoringStore();
  const { user, isPro } = useUser();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user || !isPro) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), segment: audience }),
      });
      setName('');
      setOpen(false);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
      >
        + 現在の設定を保存
      </button>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex gap-2 items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="セグメント名"
        autoFocus
        className="flex-1 px-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      <button
        type="submit"
        disabled={saving || !name.trim()}
        className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? '…' : '保存'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-2 py-1.5 text-stone-400 hover:text-stone-600 text-xs"
      >
        ×
      </button>
    </form>
  );
}
