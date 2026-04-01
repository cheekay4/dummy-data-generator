'use client';

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import type { AgentCard } from '@/types/agent-card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Trash2, X, Tag, Hash, FileText } from 'lucide-react';

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
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-3xl p-8 space-y-6 backdrop-blur-xl overflow-hidden"
        >
          {/* Skill number badge */}
          <div
            className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1E4D7B, #D84835)' }}
          >
            <span className="font-mono text-[18px] font-bold text-white">{index + 1}</span>
          </div>

          <div className="flex items-center justify-between pl-12">
            <span className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
              Skill
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-[rgba(255,255,255,0.3)] hover:text-[#ef4444] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                <Hash size={14} className="text-[rgba(255,255,255,0.4)]" />
              </div>
              <label className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                Skill ID
              </label>
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.3)] text-[#ef4444] rounded-[10px]">
                必須
              </span>
            </div>
            <Input
              {...register(`skills.${index}.id`)}
              placeholder="send_email"
              error={errors.skills?.[index]?.id?.message}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                <FileText size={14} className="text-[rgba(255,255,255,0.4)]" />
              </div>
              <label className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                Description
              </label>
            </div>
            <Textarea
              {...register(`skills.${index}.description`)}
              placeholder="Describe what this skill does..."
              error={errors.skills?.[index]?.description?.message}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                <Tag size={14} className="text-[rgba(255,255,255,0.4)]" />
              </div>
              <label className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                Tags
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {(watch(`skills.${index}.tags`) || []).map((tag: string, tagIndex: number) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[14px] text-[13px] font-semibold text-white"
                  style={{ background: 'linear-gradient(160deg, #1E4D7B, #D84835)' }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const tags = watch(`skills.${index}.tags`) || [];
                      setValue(`skills.${index}.tags`, tags.filter((_: string, i: number) => i !== tagIndex), { shouldValidate: true });
                    }}
                    className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  const tag = prompt('タグ名を入力');
                  if (tag) {
                    const tags = watch(`skills.${index}.tags`) || [];
                    setValue(`skills.${index}.tags`, [...tags, tag.trim()], { shouldValidate: true });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-[13px] font-semibold text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.03)] border-2 border-dashed border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] transition-colors"
              >
                <Plus size={16} />
                Add tag
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
              スキル名
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.3)] text-[#ef4444] rounded-[10px]">
                必須
              </span>
            </label>
            <Input
              {...register(`skills.${index}.name`)}
              placeholder="予約管理"
              error={errors.skills?.[index]?.name?.message}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
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

      <button
        type="button"
        onClick={() =>
          append({
            id: '',
            name: '',
            description: '',
            tags: [],
            examples: [],
          })
        }
        className="w-full py-8 rounded-3xl border-2 border-dashed border-[rgba(255,255,255,0.2)] bg-[rgba(20,20,20,0.3)] hover:bg-[rgba(20,20,20,0.5)] transition-all duration-300 flex items-center justify-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E4D7B] to-[#D84835] flex items-center justify-center">
          <Plus size={24} className="text-white" />
        </div>
        <span className="font-sora text-[17px] font-bold text-white">Add Another Skill</span>
      </button>
    </div>
  );
}
