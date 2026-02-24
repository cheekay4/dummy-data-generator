"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE_JSON = `{
  "name": "tools24.jp",
  "description": "便利なWebツール集",
  "version": "1.0.0",
  "features": [
    "JSON整形",
    "CSV変換",
    "TypeScript型生成"
  ],
  "author": {
    "name": "tools24",
    "url": "https://tools24.jp"
  },
  "free": true,
  "price": null
}`;

interface JsonInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function JsonInput({ value, onChange }: JsonInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (!file.name.endsWith(".json")) {
        alert(".jsonファイルのみ対応しています");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target?.result as string ?? "");
      reader.readAsText(file, "utf-8");
    },
    [onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string ?? "");
    reader.readAsText(file, "utf-8");
    e.target.value = "";
  };

  const lineNumbers = value
    ? value.split("\n").map((_, i) => i + 1)
    : [1];

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">入力</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(SAMPLE_JSON)}
          >
            サンプル貼り付け
          </Button>
          <label>
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">ファイル選択</span>
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("")}
            disabled={!value}
          >
            クリア
          </Button>
        </div>
      </div>

      <div
        className="flex border rounded-md overflow-hidden flex-1 min-h-[480px] focus-within:ring-2 focus-within:ring-ring"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 resize-none bg-transparent text-sm font-mono p-2 outline-none leading-6 overflow-auto"
          placeholder={SAMPLE_JSON}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <p className="text-xs text-muted-foreground">.jsonファイルをドラッグ&ドロップで読み込み可能</p>
    </div>
  );
}
