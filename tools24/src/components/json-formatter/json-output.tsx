"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface JsonOutputProps {
  value: string;
  label?: string;
  downloadName?: string;
}

export function JsonOutput({ value, label = "出力", downloadName = "output.json" }: JsonOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleDownload = useCallback(() => {
    if (!value) return;
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  }, [value, downloadName]);

  const lineNumbers = value
    ? value.split("\n").map((_, i) => i + 1)
    : [1];

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!value}
          >
            {copied ? "コピーしました ✓" : "コピー"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!value}
          >
            ダウンロード
          </Button>
        </div>
      </div>

      <div className="flex border rounded-md overflow-hidden flex-1 min-h-[480px]">
        {/* 行番号 */}
        <div
          className="select-none bg-muted/50 text-muted-foreground/60 text-right text-xs font-mono px-2 pt-[9px] pb-2 overflow-hidden leading-6 min-w-[3rem]"
          aria-hidden
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <textarea
          value={value}
          readOnly
          className="flex-1 resize-none bg-transparent text-sm font-mono p-2 outline-none leading-6 overflow-auto"
          placeholder="変換結果がここに表示されます"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
