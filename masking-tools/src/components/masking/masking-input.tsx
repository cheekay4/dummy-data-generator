"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

const MAX_INPUT_CHARS = 50000;

const SAMPLE_TEXT = `田中太郎様

平素よりお世話になっております。

以下の情報をご確認ください。

【連絡先】
電話: 090-1234-5678
メール: tanaka.taro@example.co.jp

【住所】
〒150-0001
東京都渋谷区神宮前1丁目2番3号

【識別番号】
マイナンバー: 123456789018

以上、よろしくお願いいたします。`;

interface MaskingInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function MaskingInput({ value, onChange }: MaskingInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOverLimit = value.length > MAX_INPUT_CHARS;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string ?? "");
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string ?? "");
    };
    reader.readAsText(file, "UTF-8");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">入力テキスト</label>
        {value.length > 0 && (
          <span className={`text-xs ${isOverLimit ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
            {value.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}字
          </span>
        )}
      </div>
      <textarea
        className={`w-full min-h-[320px] p-3 rounded-lg border bg-background font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring ${isOverLimit ? "border-red-400" : ""}`}
        placeholder={`個人情報を含むテキストを貼り付けてください\n\n例:\n田中太郎様\n電話: 090-1234-5678\nメール: tanaka@example.com\n住所: 東京都渋谷区神宮前1-2-3`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      />
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => onChange(SAMPLE_TEXT)}>
          サンプルを貼り付け
        </Button>
        <Button variant="outline" size="sm" onClick={() => onChange("")}>
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          クリア
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5 mr-1" />
          ファイル読み込み
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
