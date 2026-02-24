"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { jsonToXml } from "@/lib/json-utils";

interface JsonToXmlProps {
  input: string;
}

export function JsonToXml({ input }: JsonToXmlProps) {
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return jsonToXml(input);
  }, [input]);

  const handleDownload = () => {
    if (!result?.result) return;
    const blob = new Blob([result.result], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.xml";
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
        左にJSONを入力するとXML形式に変換されます
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
          XMLダウンロード
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
