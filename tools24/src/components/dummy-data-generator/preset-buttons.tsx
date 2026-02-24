"use client";

import { Button } from "@/components/ui/button";
import { presets, type FieldKey } from "@/lib/dummy/generator";
import { Zap } from "lucide-react";

type Props = {
  onSelect: (fields: FieldKey[]) => void;
};

export function PresetButtons({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Zap className="h-3 w-3" />
        プリセット:
      </span>
      {presets.map((preset) => (
        <Button
          key={preset.name}
          variant="outline"
          size="sm"
          onClick={() => onSelect(preset.fields)}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
