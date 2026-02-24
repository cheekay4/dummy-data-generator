"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { MaskSettings, DetectionType, MaskMode, DETECTION_LABELS } from "@/lib/types";

interface MaskingSettingsProps {
  settings: MaskSettings;
  onChange: (settings: MaskSettings) => void;
  isPro: boolean;
  onProRequired: () => void;
}

const DETECTION_TYPES: DetectionType[] = [
  "name","phone","email","address","zipcode","mynumber","creditcard","ip",
];

const MODE_OPTIONS: { value: MaskMode; label: string; proOnly?: boolean }[] = [
  { value: "fixed", label: "固定値置換（[氏名] [電話番号] etc.）" },
  { value: "redact", label: "伏字マスク（●●●●）" },
  { value: "hash", label: "ハッシュ化（a3f2b8...）" },
  { value: "dummy", label: "ダミーデータ置換（リアルな偽データ）", proOnly: true },
];

export function MaskingSettings({ settings, onChange, isPro, onProRequired }: MaskingSettingsProps) {
  const toggleTarget = (type: DetectionType) => {
    onChange({
      ...settings,
      targets: { ...settings.targets, [type]: !settings.targets[type] },
    });
  };

  const setMode = (mode: MaskMode) => {
    if (mode === "dummy" && !isPro) {
      onProRequired();
      return;
    }
    onChange({ ...settings, mode });
  };

  return (
    <Accordion type="single" collapsible className="border rounded-lg px-4">
      <AccordionItem value="settings" className="border-none">
        <AccordionTrigger className="text-sm font-medium">
          ⚙️ マスク設定
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pb-4">
          <p className="text-xs text-muted-foreground">設定を変更したら、もう一度「マスクする」を押してください。</p>
          {/* Detection targets */}
          <div>
            <p className="text-sm font-medium mb-3">検出対象</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DETECTION_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`target-${type}`}
                    checked={settings.targets[type]}
                    onCheckedChange={() => toggleTarget(type)}
                  />
                  <Label htmlFor={`target-${type}`} className="text-sm cursor-pointer">
                    {DETECTION_LABELS[type]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Mask mode */}
          <div>
            <p className="text-sm font-medium mb-3">マスク方式</p>
            <RadioGroup value={settings.mode} onValueChange={(v) => setMode(v as MaskMode)} className="space-y-2">
              {MODE_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => opt.proOnly && !isPro && onProRequired()}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`mode-${opt.value}`}
                    disabled={opt.proOnly && !isPro}
                  />
                  <Label
                    htmlFor={`mode-${opt.value}`}
                    className={`text-sm cursor-pointer ${opt.proOnly && !isPro ? "text-muted-foreground" : ""}`}
                  >
                    {opt.label}
                    {opt.proOnly && (
                      <Badge variant="secondary" className="ml-2 text-xs">✨ Pro</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
