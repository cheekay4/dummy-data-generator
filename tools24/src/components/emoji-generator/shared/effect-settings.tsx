"use client";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ColorPicker } from "./color-picker";
import { EffectSettings as EffectSettingsType } from "@/lib/emoji-generator/types";

interface Props {
  value: EffectSettingsType;
  onChange: (value: EffectSettingsType) => void;
  showBorderRadius?: boolean;
}

export function EffectSettingsPanel({
  value,
  onChange,
  showBorderRadius = false,
}: Props): React.ReactElement {
  const update = <K extends keyof EffectSettingsType>(
    key: K,
    v: EffectSettingsType[K],
  ): void => {
    onChange({ ...value, [key]: v });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold">エフェクト</h3>

      {/* Stroke */}
      <div className="space-y-2 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">縁取り</label>
          <Switch
            checked={value.stroke}
            onCheckedChange={(v) => update("stroke", v)}
          />
        </div>
        {value.stroke && (
          <div className="space-y-2 pl-1">
            <ColorPicker
              label="色"
              value={value.strokeColor}
              onChange={(v) => update("strokeColor", v)}
            />
            <SliderRow
              label="太さ"
              value={value.strokeWidth}
              min={1}
              max={8}
              suffix="px"
              onChange={(v) => update("strokeWidth", v)}
            />
          </div>
        )}
      </div>

      {/* Shadow */}
      <div className="space-y-2 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">影</label>
          <Switch
            checked={value.shadow}
            onCheckedChange={(v) => update("shadow", v)}
          />
        </div>
        {value.shadow && (
          <div className="space-y-2 pl-1">
            <ColorPicker
              label="色"
              value={value.shadowColor}
              onChange={(v) => update("shadowColor", v)}
            />
            <SliderRow
              label="ぼかし"
              value={value.shadowBlur}
              min={0}
              max={10}
              suffix="px"
              onChange={(v) => update("shadowBlur", v)}
            />
            <SliderRow
              label="オフセットX"
              value={value.shadowOffsetX}
              min={-10}
              max={10}
              suffix="px"
              onChange={(v) => update("shadowOffsetX", v)}
            />
            <SliderRow
              label="オフセットY"
              value={value.shadowOffsetY}
              min={-10}
              max={10}
              suffix="px"
              onChange={(v) => update("shadowOffsetY", v)}
            />
          </div>
        )}
      </div>

      <SliderRow
        label="回転"
        value={value.rotation}
        min={-180}
        max={180}
        suffix="°"
        onChange={(v) => update("rotation", v)}
      />

      <SliderRow
        label="透明度"
        value={value.opacity}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => update("opacity", v)}
      />

      {showBorderRadius && (
        <SliderRow
          label="角丸マスク"
          value={value.borderRadius}
          min={0}
          max={64}
          suffix="px"
          onChange={(v) => update("borderRadius", v)}
        />
      )}
    </Card>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono">
          {value}
          {suffix}
        </span>
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
