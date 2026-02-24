'use client';
import { useScoringStore } from '@/stores/scoring-store';

export default function ResultPlaceholder() {
  const { resetToInput } = useScoringStore();

  return (
    <div className="text-center py-16 px-6">
      <p className="text-stone-400 text-sm mb-6">
        Phase 1-B で結果UIが実装されます
      </p>
      <button
        onClick={resetToInput}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mx-auto transition-colors"
      >
        ← もう一度スコアリング
      </button>
    </div>
  );
}
