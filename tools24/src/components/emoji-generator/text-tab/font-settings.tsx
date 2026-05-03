"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { FONT_OPTIONS, TextSettings } from "@/lib/emoji-generator/types";

interface Props {
  value: TextSettings;
  onChange: (value: TextSettings) => void;
}

export function FontSettings({ value, onChange }: Props): React.ReactElement {
  const fontDef = FONT_OPTIONS.find((f) => f.value === value.fontFamily);
  const weights = fontDef?.weights ?? [400];

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">フォント</h3>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">フォント</label>
        <Select
          value={value.fontFamily}
          onValueChange={(v) => {
            const next = FONT_OPTIONS.find((f) => f.value === v);
            const wt =
              next && next.weights.includes(value.fontWeight)
                ? value.fontWeight
                : (next?.weights[next.weights.length - 1] ?? 400);
            onChange({ ...value, fontFamily: v, fontWeight: wt });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem
                key={f.value}
                value={f.value}
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">ウェイト</label>
        <Select
          value={String(value.fontWeight)}
          onValueChange={(v) => onChange({ ...value, fontWeight: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weights.map((w) => (
              <SelectItem key={w} value={String(w)}>
                {weightLabel(w)}（{w}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <label className="text-sm font-medium">自動フィット</label>
        <Switch
          checked={value.autoFit}
          onCheckedChange={(v) => onChange({ ...value, autoFit: v })}
        />
      </div>

      {!value.autoFit && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">文字サイズ</span>
            <span className="text-xs font-mono">{value.fontSize}px</span>
          </div>
          <Slider
            min={8}
            max={200}
            value={[value.fontSize]}
            onValueChange={(v) => onChange({ ...value, fontSize: v[0] })}
          />
        </div>
      )}
    </Card>
  );
}

function weightLabel(w: number): string {
  if (w <= 300) return "Light";
  if (w <= 400) return "Regular";
  if (w <= 700) return "Bold";
  return "Black";
}
