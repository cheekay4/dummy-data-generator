'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ContractType, PositionType } from '@/lib/contract/types';

interface TypeSelectorProps {
  contractType: ContractType;
  position: PositionType;
  onContractTypeChange: (v: ContractType) => void;
  onPositionChange: (v: PositionType) => void;
}

export function TypeSelector({ contractType, position, onContractTypeChange, onPositionChange }: TypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Step 1: 契約書タイプ・立場選択</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contractType">契約書タイプ（任意）</Label>
          <Select value={contractType} onValueChange={(v) => onContractTypeChange(v as ContractType)}>
            <SelectTrigger id="contractType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">自動判定（デフォルト）</SelectItem>
              <SelectItem value="outsourcing">業務委託契約</SelectItem>
              <SelectItem value="nda">秘密保持契約（NDA）</SelectItem>
              <SelectItem value="sales">売買契約</SelectItem>
              <SelectItem value="lease">賃貸借契約</SelectItem>
              <SelectItem value="employment">雇用契約・労働契約</SelectItem>
              <SelectItem value="license">ライセンス契約</SelectItem>
              <SelectItem value="tos">利用規約・サービス契約</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="position">
            あなたの立場 <span className="text-destructive">*</span>
          </Label>
          <Select value={position} onValueChange={(v) => onPositionChange(v as PositionType)}>
            <SelectTrigger id="position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receiver">受注側（契約を受ける側）</SelectItem>
              <SelectItem value="orderer">発注側（契約を出す側）</SelectItem>
              <SelectItem value="neutral">どちらでもない / 不明</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
