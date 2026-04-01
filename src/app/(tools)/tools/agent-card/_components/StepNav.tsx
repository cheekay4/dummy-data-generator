import { Check } from 'lucide-react';
import type { GeneratorStep } from '@/types/agent-card';

interface Step {
  readonly id: string;
  readonly label: string;
}

interface StepNavProps {
  steps: readonly Step[];
  activeStep: string;
  completedSteps: Set<GeneratorStep>;
  onStepClick: (stepId: string) => void;
}

export function StepNav({ steps, activeStep, completedSteps, onStepClick }: StepNavProps): JSX.Element {
  return (
    <nav className="space-y-0.5">
      {steps.map((step) => {
        const isActive = step.id === activeStep;
        const isCompleted = completedSteps.has(step.id as GeneratorStep);
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`
              w-full text-left px-3 py-1.5
              flex items-center gap-2
              font-sora text-[11px]
              transition-colors duration-150
              ${isActive
                ? 'bg-kinari-surface border-r-2 border-shu text-sumi font-medium'
                : 'text-fude hover:text-sumi hover:bg-washi-light'
              }
            `}
          >
            {isCompleted && !isActive && (
              <Check size={10} className="text-shu flex-shrink-0" />
            )}
            <span>{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
