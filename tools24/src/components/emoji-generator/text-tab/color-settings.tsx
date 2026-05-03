"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "../shared/color-picker";
import {
  GradientDirection,
  TextSettings,
} from "@/lib/emoji-generator/types";

interface Props {
  value: TextSettings;
  onChange: (value: TextSettings) => void;
}

export function ColorSettings({ value, onChange }: Props): React.ReactElement {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">文字色</h3>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">グラデーション</label>
        <Switch
          checked={value.useGradient}
          onCheckedChange={(v) => onChange({ ...value, useGradient: v })}
        />
      </div>

      {!value.useGradient ? (
        <ColorPicker
          label="色"
          value={value.color}
          onChange={(v) => onChange({ ...value, color: v })}
          showPresets
        />
      ) : (
        <div className="space-y-3">
          <ColorPicker
            label="開始色"
            value={value.gradientStart}
            onChange={(v) => onChange({ ...value, gradientStart: v })}
          />
          <ColorPicker
            label="終了色"
            value={value.gradientEnd}
            onChange={(v) => onChange({ ...value, gradientEnd: v })}
          />
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">方向</label>
            <Select
              value={value.gradientDirection}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  gradientDirection: v as GradientDirection,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-bottom">上 → 下</SelectItem>
                <SelectItem value="left-right">左 → 右</SelectItem>
                <SelectItem value="diagonal">斜め</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Card>
  );
}
