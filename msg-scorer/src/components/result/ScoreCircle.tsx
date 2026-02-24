'use client';
import ProgressRing from '@/components/ui/ProgressRing';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

interface Props {
  score: number;
}

export default function ScoreCircle({ score }: Props) {
  const label =
    score >= 71 ? { text: '高評価',   color: 'text-emerald-600' } :
    score >= 41 ? { text: '改善余地あり', color: 'text-amber-600' } :
                  { text: '要改善',   color: 'text-red-500' };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <ProgressRing score={score} size={160} strokeWidth={12} />
        <div className="absolute flex flex-col items-center">
          <AnimatedNumber value={score} className="font-outfit font-bold text-4xl text-stone-900" />
          <span className="text-sm text-stone-400 font-mono-score">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${label.color}`}>{label.text}</span>
    </div>
  );
}
