'use client';

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import type { AgentCard } from '@/types/agent-card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { PROTOCOL_BINDINGS, PROTOCOL_VERSIONS } from '@/lib/constants';

interface InterfacesFieldArrayProps {
  form: UseFormReturn<AgentCard>;
}

export function InterfacesFieldArray({ form }: InterfacesFieldArrayProps): JSX.Element {
  const { register, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'supportedInterfaces',
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-3xl p-8 space-y-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                <span className="font-mono text-[11px] font-bold text-[rgba(255,255,255,0.5)]">{index + 1}</span>
              </div>
              <span className="font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                Interface
              </span>
            </div>
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
            <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
              URL <span className="px-2 py-0.5 text-[10px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.3)] text-[#ef4444] rounded-[10px]">必須</span>
            </label>
            <Input
              {...register(`supportedInterfaces.${index}.url`)}
              placeholder="https://example.com/a2a"
              error={errors.supportedInterfaces?.[index]?.url?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                プロトコル
              </label>
              <Select
                {...register(`supportedInterfaces.${index}.protocolBinding`)}
                options={PROTOCOL_BINDINGS.map((b) => ({ value: b, label: b }))}
                error={errors.supportedInterfaces?.[index]?.protocolBinding?.message}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                バージョン
              </label>
              <Select
                {...register(`supportedInterfaces.${index}.protocolVersion`)}
                options={PROTOCOL_VERSIONS.map((v) => ({ value: v, label: `v${v}` }))}
                error={errors.supportedInterfaces?.[index]?.protocolVersion?.message}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3 font-mono text-[11px] tracking-[1.65px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
              テナント
            </label>
            <Input
              {...register(`supportedInterfaces.${index}.tenant`)}
              placeholder="テナントID（任意）"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            url: '',
            protocolBinding: 'JSONRPC',
            protocolVersion: '1.0',
            tenant: '',
          })
        }
        className="w-full py-8 rounded-3xl border-2 border-dashed border-[rgba(255,255,255,0.2)] bg-[rgba(20,20,20,0.3)] hover:bg-[rgba(20,20,20,0.5)] transition-all duration-300 flex items-center justify-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E4D7B] to-[#D84835] flex items-center justify-center">
          <Plus size={24} className="text-white" />
        </div>
        <span className="font-sora text-[17px] font-bold text-white">Add Interface</span>
      </button>
    </div>
  );
}
