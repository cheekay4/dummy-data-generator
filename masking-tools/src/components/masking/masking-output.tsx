"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";

interface MaskingOutputProps {
  value: string;
}

export function MaskingOutput({ value }: MaskingOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    a.download = `masked_${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">マスク済みテキスト</label>
      <textarea
        className="w-full min-h-[320px] p-3 rounded-lg border bg-muted/30 font-mono text-sm resize-y focus:outline-none"
        readOnly
        value={value}
        placeholder="マスク済みテキストがここに表示されます"
      />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!value}>
          {copied ? (
            <><Check className="h-3.5 w-3.5 mr-1 text-green-500" /> コピーしました ✓</>
          ) : (
            <><Copy className="h-3.5 w-3.5 mr-1" /> コピー</>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!value}>
          <Download className="h-3.5 w-3.5 mr-1" />
          ダウンロード
        </Button>
      </div>
    </div>
  );
}
