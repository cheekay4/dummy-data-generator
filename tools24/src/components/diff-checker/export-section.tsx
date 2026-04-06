"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportSectionProps {
  unifiedDiff: string;
}

export function ExportSection({ unifiedDiff }: ExportSectionProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  function handleDownload(): void {
    const blob = new Blob([unifiedDiff], { type: "text/plain; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff-output.diff";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(unifiedDiff);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: textarea経由でコピー
      const textarea = document.createElement("textarea");
      textarea.value = unifiedDiff;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-1.5" />
        .diff ファイルをダウンロード
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <Check className="h-4 w-4 mr-1.5 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 mr-1.5" />
        )}
        {copied ? "コピーしました" : "差分をコピー"}
      </Button>
    </div>
  );
}
