"use client";

import { useState, useCallback } from "react";
import { GeneratorForm } from "./generator-form";
import { OutputFormatTabs } from "./output-format-tabs";
import { generateData, getHeaders, type FieldKey } from "@/lib/dummy/generator";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function DummyDataGenerator() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = useCallback(() => {
    setData([]);
    setHeaders([]);
    setError(null);
  }, []);

  const handleGenerate = useCallback(
    (fields: FieldKey[], count: number, ageMin: number, ageMax: number) => {
      setIsGenerating(true);
      setError(null);

      setTimeout(() => {
        try {
          const result = generateData({ fields, count, ageMin, ageMax });
          setData(result);
          setHeaders(getHeaders(fields));
          setIsGenerating(false);
        } catch (e) {
          const message = e instanceof Error ? e.message : "データ生成中にエラーが発生しました";
          setError(message);
          setData([]);
          setHeaders([]);
          setIsGenerating(false);
        }
      }, 0);
    },
    []
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">エラーが発生しました</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear}>
            リセット
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <aside>
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} onPresetSelect={handleClear} />
        </aside>

        <div className="space-y-4 min-w-0">
          <OutputFormatTabs data={data} headers={headers} onClear={handleClear} />
        </div>
      </div>
    </div>
  );
}
