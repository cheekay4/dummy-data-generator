'use client';
import { useEffect, useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { useUser } from '@/hooks/useUser';
import { type CustomSegment } from '@/lib/db/custom-segments';

interface Props {
  refreshKey?: number;
}

export default function CustomSegmentList({ refreshKey = 0 }: Props) {
  const { setAudience } = useScoringStore();
  const { user, isPro } = useUser();
  const [segments, setSegments] = useState<CustomSegment[]>([]);

  useEffect(() => {
    if (!user || !isPro) return;
    fetch('/api/segments')
      .then((r) => r.json())
      .then((data: CustomSegment[]) => setSegments(data))
      .catch(() => {});
  }, [user, isPro, refreshKey]);

  async function handleDelete(id: string) {
    await fetch(`/api/segments?id=${id}`, { method: 'DELETE' });
    setSegments((prev) => prev.filter((s) => s.id !== id));
  }

  if (!user || !isPro || segments.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
        マイセグメント
      </p>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.id} className="flex items-center justify-between gap-2">
            <button
              onClick={() => setAudience(seg.segment)}
              className="flex-1 text-left text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors truncate"
            >
              {seg.name}
            </button>
            <button
              onClick={() => handleDelete(seg.id)}
              className="text-stone-300 hover:text-red-400 transition-colors text-xs px-1"
              aria-label="削除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
