"use client";

import { Input } from "@/components/ui/input";
import { PRESET_COLORS } from "@/lib/emoji-generator/types";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showPresets?: boolean;
}

export function ColorPicker({
  label,
  value,
  onChange,
  showPresets = false,
}: Props): React.ReactElement {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
          aria-label={label ?? "色"}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 font-mono text-xs"
          maxLength={7}
        />
      </div>
      {showPresets && (
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={`h-7 w-7 rounded border-2 transition-transform hover:scale-110 ${
                value.toUpperCase() === p.value.toUpperCase()
                  ? "border-foreground"
                  : "border-border"
              }`}
              style={{ backgroundColor: p.value }}
              aria-label={p.label}
              title={p.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}
