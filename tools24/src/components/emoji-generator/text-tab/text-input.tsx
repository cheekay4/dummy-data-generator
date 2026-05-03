"use client";

import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: Props): React.ReactElement {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="emoji-text-input"
        className="text-sm font-medium block"
      >
        テキスト
      </label>
      <Textarea
        id="emoji-text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: 草、OK、助けて"
        className="min-h-[60px] resize-y font-medium text-base"
        maxLength={20}
      />
      <p className="text-xs text-muted-foreground">
        絵文字サイズに収めるため、3〜10文字程度を推奨。
      </p>
    </div>
  );
}
