'use client';

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import type { AgentCard } from '@/types/agent-card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsFieldArrayProps {
  form: UseFormReturn<AgentCard>;
}

export function SkillsFieldArray({ form }: SkillsFieldArrayProps): JSX.Element {
  const { register, formState: { errors }, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-washi rounded-[4px] p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-wide text-fude uppercase">
              skill {index + 1}
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-fude hover:text-shu transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
                スキルID <span className="text-shu">*</span>
              </label>
              <Input
                {...register(`skills.${index}.id`)}
                placeholder="booking-manage"
                error={errors.skills?.[index]?.id?.message}
              />
            </div>
            <div>
              <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
                スキル名 <span className="text-shu">*</span>
              </label>
              <Input
                {...register(`skills.${index}.name`)}
                placeholder="予約管理"
                error={errors.skills?.[index]?.name?.message}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
              説明 <span className="text-shu">*</span>
            </label>
            <Textarea
              {...register(`skills.${index}.description`)}
              placeholder="スキルの詳細な説明"
              error={errors.skills?.[index]?.description?.message}
              className="min-h-[60px]"
            />
          </div>

          <div>
            <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
              タグ <span className="text-shu">*</span>
            </label>
            <Input
              value={(watch(`skills.${index}.tags`) || []).join(', ')}
              onChange={(e) => {
                const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                setValue(`skills.${index}.tags`, tags, { shouldValidate: true });
              }}
              placeholder="予約, スケジュール（カンマ区切り）"
              error={errors.skills?.[index]?.tags?.message}
            />
          </div>

          <div>
            <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
              例文
            </label>
            <Input
              value={(watch(`skills.${index}.examples`) || []).join(', ')}
              onChange={(e) => {
                const examples = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                setValue(`skills.${index}.examples`, examples);
              }}
              placeholder="明日の14時に予約できますか？, 予約をキャンセルしたい（カンマ区切り）"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() =>
          append({
            id: '',
            name: '',
            description: '',
            tags: [],
            examples: [],
          })
        }
      >
        <Plus size={13} />
        スキル追加
      </Button>
    </div>
  );
}
