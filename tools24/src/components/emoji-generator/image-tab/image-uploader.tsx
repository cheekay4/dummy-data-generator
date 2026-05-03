"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ACCEPT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

interface Props {
  hasImage: boolean;
  fileName?: string;
  onFile: (file: File) => void;
  onClear: () => void;
}

export function ImageUploader({
  hasImage,
  fileName,
  onFile,
  onClear,
}: Props): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File): void => {
      setError(null);
      if (!ACCEPT_TYPES.includes(file.type)) {
        setError(
          "対応形式: PNG / JPG / JPEG / GIF / WebP / SVG",
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("ファイルサイズは10MB以下にしてください。");
        return;
      }
      onFile(file);
    },
    [onFile],
  );

  if (hasImage) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm truncate">{fileName ?? "画像"}</div>
          <Button variant="outline" size="sm" onClick={onClear}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            別の画像
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          drag
            ? "border-blue-500 bg-blue-500/5"
            : "border-border hover:border-muted-foreground/50"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              画像をドラッグ&ドロップ、またはクリックして選択
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG / JPG / GIF / WebP / SVG
            </p>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
