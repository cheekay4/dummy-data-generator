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
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      <h2 className="font-sora font-semibold text-[16px] text-sumi tracking-tight mb-4">
        {GENERATOR_STEPS.find((s) => s.id === activeStep)?.label}
      </h2>

      {activeStep === 'basic' && (
        <div className="space-y-4">
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
        <div className="space-y-4">
          <p className="text-[11px] text-fude mb-3">
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
        <div className="space-y-4">
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
        <div className="space-y-4">
          <FieldGroup label="デフォルト入力モード" required>
            <ModeSelector
              modes={INPUT_OUTPUT_MODES}
              selected={watch('defaultInputModes') || []}
              onChange={(v) => setValue('defaultInputModes', v, { shouldValidate: true })}
            />
            {errors.defaultInputModes?.message && (
              <p className="mt-1 text-[10px] text-shu">{errors.defaultInputModes.message}</p>
            )}
          </FieldGroup>
          <FieldGroup label="デフォルト出力モード" required>
            <ModeSelector
              modes={INPUT_OUTPUT_MODES}
              selected={watch('defaultOutputModes') || []}
              onChange={(v) => setValue('defaultOutputModes', v, { shouldValidate: true })}
            />
            {errors.defaultOutputModes?.message && (
              <p className="mt-1 text-[10px] text-shu">{errors.defaultOutputModes.message}</p>
            )}
          </FieldGroup>
        </div>
      )}

      {activeStep === 'skills' && (
        <SkillsFieldArray form={form} />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-washi">
        {prevStep ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStepChange(prevStep.id as GeneratorStep)}
          >
            <ChevronLeft size={14} />
            {prevStep.label}
          </Button>
        ) : (
          <div />
        )}
        {nextStep && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStepChange(nextStep.id as GeneratorStep)}
          >
            {nextStep.label}
            <ChevronRight size={14} />
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
      <label className="block mb-1.5 font-mono text-[9px] tracking-wide text-fude uppercase">
        {label}
        {required && <span className="text-shu ml-0.5">*</span>}
      </label>
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
    <div className="flex flex-wrap gap-1.5">
      {modes.map((mode) => {
        const isSelected = selected.includes(mode.value);
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => toggle(mode.value)}
            className={`
              px-2 py-1 font-mono text-[10px] rounded-[4px] border transition-colors
              ${isSelected
                ? 'bg-sumi text-kinari border-sumi'
                : 'bg-kinari-surface text-fude border-washi hover:bg-washi-light'
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
