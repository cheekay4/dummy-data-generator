"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import yaml from "js-yaml";

interface JsonToYamlProps {
  input: string;
}

export function JsonToYaml({ input }: JsonToYamlProps) {
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = JSON.parse(input);
      return { result: yaml.dump(parsed, { indent: 2, lineWidth: -1 }) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "変換エラー" };
    }
  }, [input]);

  const handleDownload = () => {
    if (!result?.result) return;
    const blob = new Blob([result.result], { type: "text/yaml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!result?.result) return;
    await navigator.clipboard.writeText(result.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        左にJSONを入力するとYAML形式に変換されます
      </div>
    );
  }

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!result.result}>
          {copied ? "コピーしました ✓" : "コピー"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!result.result}>
          YAMLダウンロード
        </Button>
      </div>
      <textarea
        readOnly
        value={result.result}
        className="w-full h-64 font-mono text-sm border rounded-md p-3 bg-muted/30 resize-none outline-none"
      />
    </div>
  );
}
