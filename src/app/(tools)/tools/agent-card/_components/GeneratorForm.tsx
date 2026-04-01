'use client';

import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { AgentCard, GeneratorStep } from '@/types/agent-card';
import { GENERATOR_STEPS, INPUT_OUTPUT_MODES } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { SkillsFieldArray } from './SkillsFieldArray';
import { InterfacesFieldArray } from './InterfacesFieldArray';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface GeneratorFormProps {
  form: UseFormReturn<AgentCard>;
  activeStep: GeneratorStep;
  onStepChange: (step: GeneratorStep) => void;
}

export function GeneratorForm({ form, activeStep, onStepChange }: GeneratorFormProps): JSX.Element {
  const { register, formState: { errors }, setValue, watch } = form;

  const stepIndex = GENERATOR_STEPS.findIndex((s) => s.id === activeStep);
  const prevStep = stepIndex > 0 ? GENERATOR_STEPS[stepIndex - 1] : null;
  const nextStep = stepIndex < GENERATOR_STEPS.length - 1 ? GENERATOR_STEPS[stepIndex + 1] : null;

  return (
    <div>
      {/* Step badge */}
      <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden shadow-lg mb-6"
        style={{ background: 'linear-gradient(170deg, #D84835, #D4AF37)' }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        <Sparkles size={16} className="text-white relative z-10" />
        <span className="relative z-10 font-mono text-[11px] font-bold text-white tracking-[2.2px] uppercase">
          STEP {stepIndex + 1} OF {GENERATOR_STEPS.length}
        </span>
      </div>

      <h2 className="font-sora font-bold text-[40px] md:text-[56px] text-white tracking-[-1.68px] leading-tight mb-4">
        {GENERATOR_STEPS.find((s) => s.id === activeStep)?.label}
      </h2>

      {activeStep === 'basic' && (
        <div className="space-y-6">
          <FieldGroup label="エージェント名" required>
            <Input
              {...register('name')}
              placeholder="例: 予約管理エージェント"
              error={errors.name?.message}
            />
          </FieldGroup>
          <FieldGroup label="説明" required>
            <Textarea
              {...register('description')}
              placeholder="エージェントの役割と機能を簡潔に説明"
              error={errors.description?.message}
            />
          </FieldGroup>
          <FieldGroup label="バージョン" required>
            <Input
              {...register('version')}
              placeholder="1.0.0"
              error={errors.version?.message}
            />
          </FieldGroup>
          <FieldGroup label="アイコンURL">
            <Input
              {...register('iconUrl')}
              placeholder="https://example.com/icon.png"
              error={errors.iconUrl?.message}
            />
          </FieldGroup>
          <FieldGroup label="ドキュメントURL">
            <Input
              {...register('documentationUrl')}
              placeholder="https://example.com/docs"
              error={errors.documentationUrl?.message}
            />
          </FieldGroup>
        </div>
      )}

      {activeStep === 'provider' && (
        <div className="space-y-6">
          <p className="text-[16px] text-[rgba(255,255,255,0.6)] leading-relaxed mb-4">
            プロバイダー情報は任意です。公開時に組織情報を明示したい場合に入力してください。
          </p>
          <FieldGroup label="組織名">
            <Input
              {...register('provider.organization')}
              placeholder="例: 株式会社Example"
              error={errors.provider?.organization?.message}
            />
          </FieldGroup>
          <FieldGroup label="組織URL">
            <Input
              {...register('provider.url')}
              placeholder="https://example.com"
              error={errors.provider?.url?.message}
            />
          </FieldGroup>
        </div>
      )}

      {activeStep === 'interfaces' && (
        <InterfacesFieldArray form={form} />
      )}

      {activeStep === 'capabilities' && (
        <div className="space-y-6">
          <FieldGroup label="ストリーミング対応">
            <Toggle
              value={watch('capabilities.streaming')}
              onChange={(v) => setValue('capabilities.streaming', v)}
            />
          </FieldGroup>
          <FieldGroup label="プッシュ通知対応">
            <Toggle
              value={watch('capabilities.pushNotifications')}
              onChange={(v) => setValue('capabilities.pushNotifications', v)}
            />
          </FieldGroup>
          <FieldGroup label="拡張Agent Card">
            <Toggle
              value={watch('capabilities.extendedAgentCard')}
              onChange={(v) => setValue('capabilities.extendedAgentCard', v)}
            />
          </FieldGroup>
        </div>
      )}

      {activeStep === 'io-modes' && (
        <div className="space-y-6">
          <FieldGroup label="デフォルト入力モード" required>
            <ModeSelector
              modes={INPUT_OUTPUT_MODES}
              selected={watch('defaultInputModes') || []}
              onChange={(v) => setValue('defaultInputModes', v, { shouldValidate: true })}
            />
            {errors.defaultInputModes?.message && (
              <p className="mt-1.5 text-[11px] text-[#ef4444] font-mono">{errors.defaultInputModes.message}</p>
            )}
          </FieldGroup>
          <FieldGroup label="デフォルト出力モード" required>
            <ModeSelector
              modes={INPUT_OUTPUT_MODES}
              selected={watch('defaultOutputModes') || []}
              onChange={(v) => setValue('defaultOutputModes', v, { shouldValidate: true })}
            />
            {errors.defaultOutputModes?.message && (
              <p className="mt-1.5 text-[11px] text-[#ef4444] font-mono">{errors.defaultOutputModes.message}</p>
            )}
          </FieldGroup>
        </div>
      )}

      {activeStep === 'skills' && (
        <SkillsFieldArray form={form} />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-10 pt-6 border-t border-[rgba(255,255,255,0.1)]">
        {prevStep ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onStepChange(prevStep.id as GeneratorStep)}
          >
            <ChevronLeft size={16} />
            Previous Step
          </Button>
        ) : (
          <div />
        )}
        {nextStep ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStepChange(nextStep.id as GeneratorStep)}
          >
            {nextStep.label}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {/* Generate */}}
          >
            <Sparkles size={16} />
            Generate Agent Card
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}): JSX.Element {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <label className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
          {label}
        </label>
        {required ? (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.3)] text-[#ef4444] rounded-[10px]">
            必須
          </span>
        ) : (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(106,114,130,0.1)] border border-[rgba(106,114,130,0.3)] text-[rgba(255,255,255,0.5)] rounded-[10px]">
            任意
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ModeSelector({
  modes,
  selected,
  onChange,
}: {
  modes: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}): JSX.Element {
  const toggle = (value: string): void => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => {
        const isSelected = selected.includes(mode.value);
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => toggle(mode.value)}
            className={`
              px-4 py-2 font-mono text-[12px] rounded-xl border-2 transition-all duration-300
              ${isSelected
                ? 'bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white border-transparent'
                : 'bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.5)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
              }
            `}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
