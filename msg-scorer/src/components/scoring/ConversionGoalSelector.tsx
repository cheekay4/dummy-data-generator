'use client';
import { useScoringStore } from '@/stores/scoring-store';
import { ConversionGoal, CONVERSION_LABELS } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

const GOALS: ConversionGoal[] = ['purchase', 'click', 'signup', 'visit', 'inquiry'];

export default function ConversionGoalSelector() {
  const { audience, setConversionGoal } = useScoringStore();
  const active = audience.conversionGoal;

  return (
    <div>
      <p className="text-sm font-medium text-stone-700 mb-2">🎯 配信の目的</p>
      <div className="flex flex-wrap gap-2">
        {GOALS.map((goal) => {
          const { icon, name } = CONVERSION_LABELS[goal];
          const isActive = goal === active;
          return (
            <button
              key={goal}
              onClick={() => { setConversionGoal(goal); trackEvent('conversion_goal_selected', { goal }); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-all duration-150 ${
                isActive
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <span>{icon}</span>
              <span>{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
