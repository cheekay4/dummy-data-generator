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
    <nav className="space-y-1">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = completedSteps.has(step.id as GeneratorStep);
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`
              w-full text-left px-4 py-3
              flex items-center gap-4
              rounded-[14px] border
              transition-all duration-300
              ${isActive
                ? 'bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.3)] shadow-lg'
                : 'border-transparent hover:bg-[rgba(255,255,255,0.03)]'
              }
            `}
          >
            {/* Step indicator */}
            <div
              className={`
                flex-shrink-0 w-9 h-9 rounded-[14px] flex items-center justify-center
                ${isCompleted && !isActive
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                  : isActive
                  ? 'bg-gradient-to-br from-[#1E4D7B] to-[#D84835] shadow-lg'
                  : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
                }
              `}
            >
              {isCompleted && !isActive ? (
                <Check size={16} className="text-white" />
              ) : (
                <span className="font-mono text-[14px] font-bold text-white">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Label */}
            <div className="flex flex-col">
              <span className={`
                font-sora text-[14px] font-semibold
                ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'}
              `}>
                {step.label}
              </span>
              {isActive && (
                <span className="font-mono text-[11px] text-[rgba(255,255,255,0.4)]">
                  In Progress
                </span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
