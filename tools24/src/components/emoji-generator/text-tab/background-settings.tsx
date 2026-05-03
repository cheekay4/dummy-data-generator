"use client";

import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "../shared/color-picker";
import {
  BackgroundSettings as BackgroundSettingsType,
  BackgroundType,
  GradientDirection,
} from "@/lib/emoji-generator/types";

interface Props {
  value: BackgroundSettingsType;
  onChange: (value: BackgroundSettingsType) => void;
}

export function BackgroundSettings({
  value,
  onChange,
}: Props): React.ReactElement {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">背景</h3>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">背景タイプ</label>
        <Select
          value={value.type}
          onValueChange={(v) =>
            onChange({ ...value, type: v as BackgroundType })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transparent">透過</SelectItem>
            <SelectItem value="solid">単色</SelectItem>
            <SelectItem value="gradient">グラデーション</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value.type === "solid" && (
        <ColorPicker
          label="色"
          value={value.color}
          onChange={(v) => onChange({ ...value, color: v })}
          showPresets
        />
      )}

      {value.type === "gradient" && (
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

      {value.type !== "transparent" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">角丸</span>
            <span className="text-xs font-mono">{value.borderRadius}px</span>
          </div>
          <Slider
            min={0}
            max={64}
            value={[value.borderRadius]}
            onValueChange={(v) => onChange({ ...value, borderRadius: v[0] })}
          />
        </div>
      )}
    </Card>
  );
}
