"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PresetButtons } from "./preset-buttons";
import { fieldConfigs, categoryLabels, type FieldKey } from "@/lib/dummy/generator";
import { Play, RotateCcw } from "lucide-react";

type Props = {
  onGenerate: (fields: FieldKey[], count: number, ageMin: number, ageMax: number) => void;
  isGenerating: boolean;
  onPresetSelect?: () => void;
};

const categories = ["personal", "address", "business", "web"] as const;

export function GeneratorForm({ onGenerate, isGenerating, onPresetSelect }: Props) {
  const [selectedFields, setSelectedFields] = useState<FieldKey[]>([
    "nameKanji", "nameKana", "gender", "age", "phone",
  ]);
  const [count, setCount] = useState(10);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(65);

  const toggleField = (key: FieldKey) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const selectAll = () => {
    setSelectedFields(fieldConfigs.map((f) => f.key));
  };

  const selectNone = () => {
    setSelectedFields([]);
  };

  const selectCategory = (category: string) => {
    const categoryFields = fieldConfigs.filter((f) => f.category === category).map((f) => f.key);
    const allSelected = categoryFields.every((f) => selectedFields.includes(f));
    if (allSelected) {
      setSelectedFields((prev) => prev.filter((f) => !categoryFields.includes(f)));
    } else {
      setSelectedFields((prev) => Array.from(new Set([...prev, ...categoryFields])));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">生成設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>生成件数</Label>
          <Input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
          />
          <p className="text-xs text-muted-foreground">1〜500件</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>年齢（最小）</Label>
            <Input
              type="number"
              min={0}
              max={120}
              value={ageMin}
              onChange={(e) => setAgeMin(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <div className="space-y-1">
            <Label>年齢（最大）</Label>
            <Input
              type="number"
              min={0}
              max={120}
              value={ageMax}
              onChange={(e) => setAgeMax(Math.min(120, parseInt(e.target.value) || 120))}
            />
          </div>
        </div>

        <PresetButtons
          onSelect={(fields) => {
            setSelectedFields(fields);
            onPresetSelect?.();
          }}
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            全選択
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone}>
            全解除
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["personal"]} className="w-full">
          {categories.map((cat) => {
            const catFields = fieldConfigs.filter((f) => f.category === cat);
            const allChecked = catFields.every((f) => selectedFields.includes(f.key));
            return (
              <AccordionItem key={cat} value={cat}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={() => selectCategory(cat)}
                  />
                  <AccordionTrigger className="text-sm flex-1">
                    <div className="flex items-center gap-2">
                      <span>{categoryLabels[cat]}</span>
                      <span className="text-xs text-muted-foreground">
                        ({catFields.filter((f) => selectedFields.includes(f.key)).length}/{catFields.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <div className="space-y-2 pl-6">
                    {catFields.map((field) => (
                      <div key={field.key} className="flex items-center gap-2">
                        <Checkbox
                          id={field.key}
                          checked={selectedFields.includes(field.key)}
                          onCheckedChange={() => toggleField(field.key)}
                        />
                        <Label htmlFor={field.key} className="cursor-pointer text-sm font-normal">
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            onClick={() => onGenerate(selectedFields, count, ageMin, ageMax)}
            disabled={selectedFields.length === 0 || isGenerating}
          >
            <Play className="h-4 w-4 mr-2" />
            {isGenerating ? "生成中..." : "生成する"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onGenerate(selectedFields, count, ageMin, ageMax)}
            disabled={selectedFields.length === 0 || isGenerating}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
