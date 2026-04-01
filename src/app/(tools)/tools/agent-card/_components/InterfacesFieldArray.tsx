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
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-washi rounded-[4px] p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-wide text-fude uppercase">
              interface {index + 1}
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

          <div>
            <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
              URL <span className="text-shu">*</span>
            </label>
            <Input
              {...register(`supportedInterfaces.${index}.url`)}
              placeholder="https://example.com/a2a"
              error={errors.supportedInterfaces?.[index]?.url?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
                プロトコル <span className="text-shu">*</span>
              </label>
              <Select
                {...register(`supportedInterfaces.${index}.protocolBinding`)}
                options={PROTOCOL_BINDINGS.map((b) => ({ value: b, label: b }))}
                error={errors.supportedInterfaces?.[index]?.protocolBinding?.message}
              />
            </div>
            <div>
              <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
                バージョン <span className="text-shu">*</span>
              </label>
              <Select
                {...register(`supportedInterfaces.${index}.protocolVersion`)}
                options={PROTOCOL_VERSIONS.map((v) => ({ value: v, label: `v${v}` }))}
                error={errors.supportedInterfaces?.[index]?.protocolVersion?.message}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-mono text-[8px] tracking-wide text-fude uppercase">
              テナント
            </label>
            <Input
              {...register(`supportedInterfaces.${index}.tenant`)}
              placeholder="テナントID（任意）"
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
            url: '',
            protocolBinding: 'JSONRPC',
            protocolVersion: '1.0',
            tenant: '',
          })
        }
      >
        <Plus size={13} />
        インターフェース追加
      </Button>
    </div>
  );
}
