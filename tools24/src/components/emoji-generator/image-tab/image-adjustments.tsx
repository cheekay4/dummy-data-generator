"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "../shared/color-picker";
import { ImageAdjustments as ImageAdjustmentsType } from "@/lib/emoji-generator/types";

interface Props {
  value: ImageAdjustmentsType;
  onChange: (value: ImageAdjustmentsType) => void;
}

export function ImageAdjustmentsPanel({
  value,
  onChange,
}: Props): React.ReactElement {
  const update = <K extends keyof ImageAdjustmentsType>(
    key: K,
    v: ImageAdjustmentsType[K],
  ): void => {
    onChange({ ...value, [key]: v });
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">画像調整</h3>

      <SliderRow
        label="明度"
        value={value.brightness}
        min={-100}
        max={100}
        onChange={(v) => update("brightness", v)}
      />
      <SliderRow
        label="コントラスト"
        value={value.contrast}
        min={-100}
        max={100}
        onChange={(v) => update("contrast", v)}
      />
      <SliderRow
        label="彩度"
        value={value.saturation}
        min={-100}
        max={100}
        onChange={(v) => update("saturation", v)}
      />

      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">背景除去</label>
          <Switch
            checked={value.removeBackground}
            onCheckedChange={(v) => update("removeBackground", v)}
          />
        </div>
        {value.removeBackground && (
          <div className="space-y-2 pl-1">
            <ColorPicker
              label="除去対象色"
              value={value.bgRemoveColor}
              onChange={(v) => update("bgRemoveColor", v)}
              showPresets
            />
            <SliderRow
              label="閾値"
              value={value.bgRemoveThreshold}
              min={0}
              max={100}
              onChange={(v) => update("bgRemoveThreshold", v)}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono">{value}</span>
      </div>
      <Slider
        min={min}
        max={max}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
