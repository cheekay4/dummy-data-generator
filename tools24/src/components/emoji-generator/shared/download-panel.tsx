"use client";

import { useState } from "react";
import { Download, AlertTriangle, Loader2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  canvasToPng,
  compressToLimit,
  downloadBlob,
  formatFileSize,
  safeFilename,
} from "@/lib/emoji-generator/size-optimizer";
import { MAX_FILE_SIZE } from "@/lib/emoji-generator/types";

interface Props {
  canvas: HTMLCanvasElement | null;
  filenameSeed: string;
  /** Optional GIF blob if animation was generated. */
  gifBlob?: Blob | null;
  gifFilename?: string;
  /** When set, shows a "Generate GIF" button rendered by parent. */
  gifGenerationSlot?: React.ReactNode;
  pngBytes: number | null;
}

export function DownloadPanel({
  canvas,
  filenameSeed,
  gifBlob,
  gifFilename,
  gifGenerationSlot,
  pngBytes,
}: Props): React.ReactElement {
  const [busy, setBusy] = useState(false);
  const oversize = pngBytes !== null && pngBytes > MAX_FILE_SIZE;

  const handleDownloadPng = async (): Promise<void> => {
    if (!canvas) return;
    setBusy(true);
    try {
      const blob = await canvasToPng(canvas);
      downloadBlob(blob, safeFilename(filenameSeed, "png"));
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadCompressed = async (): Promise<void> => {
    if (!canvas) return;
    setBusy(true);
    try {
      const { blob, type } = await compressToLimit(canvas);
      const ext = type === "image/png" ? "png" : "jpg";
      downloadBlob(blob, safeFilename(filenameSeed, ext));
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadGif = (): void => {
    if (!gifBlob) return;
    downloadBlob(
      gifBlob,
      gifFilename ?? safeFilename(filenameSeed, "gif"),
    );
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">ダウンロード</h3>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDownloadPng}
          disabled={!canvas || busy}
          className="w-full"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          PNGダウンロード
        </Button>

        {gifGenerationSlot}

        {gifBlob && (
          <Button
            variant="secondary"
            onClick={handleDownloadGif}
            className="w-full"
          >
            <FileImage className="mr-2 h-4 w-4" />
            GIFダウンロード（{formatFileSize(gifBlob.size)}）
          </Button>
        )}
      </div>

      {pngBytes !== null && (
        <div className="text-xs">
          <div
            className={
              oversize
                ? "text-destructive font-medium"
                : "text-muted-foreground"
            }
          >
            ファイルサイズ: {formatFileSize(pngBytes)} / 128.0 KB
          </div>
          {oversize && (
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Slack絵文字の上限（128KB）を超えています。自動圧縮を試してください。
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCompressed}
                disabled={busy}
                className="w-full"
              >
                {busy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                自動圧縮してダウンロード
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="text-[11px] text-muted-foreground border-t border-border pt-2">
        画像はサーバーに送信されません（ブラウザ内で完結）
      </div>
    </Card>
  );
}
