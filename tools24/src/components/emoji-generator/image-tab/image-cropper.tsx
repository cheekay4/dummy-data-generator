"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CropRect } from "@/lib/emoji-generator/types";
import {
  autoSquareCrop,
  fitWholeCrop,
} from "@/lib/emoji-generator/image-processor";

interface Props {
  image: HTMLImageElement | null;
  crop: CropRect;
  onCrop: (crop: CropRect) => void;
}

const PREVIEW_SIZE = 280;

type DragMode = "move" | "resize" | null;

export function ImageCropper({
  image,
  crop,
  onCrop,
}: Props): React.ReactElement | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drag, setDrag] = useState<{
    mode: DragMode;
    startX: number;
    startY: number;
    origCrop: CropRect;
  } | null>(null);

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    const scale = PREVIEW_SIZE / Math.max(w, h);
    const dw = w * scale;
    const dh = h * scale;
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;
    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    const ox = (PREVIEW_SIZE - dw) / 2;
    const oy = (PREVIEW_SIZE - dh) / 2;
    ctx.drawImage(image, ox, oy, dw, dh);

    // Overlay
    const cx = ox + crop.x * scale;
    const cy = oy + crop.y * scale;
    const cs = crop.size * scale;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.rect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.rect(cx + cs, cy, -cs, cs);
    ctx.fill("evenodd");
    ctx.restore();

    // Crop frame
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cs, cs);

    // Resize handle (bottom-right)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(cx + cs - 8, cy + cs - 8, 8, 8);
  }, [image, crop]);

  if (!image) return null;

  const naturalMax = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = PREVIEW_SIZE / naturalMax;
  const ox = (PREVIEW_SIZE - image.naturalWidth * scale) / 2;
  const oy = (PREVIEW_SIZE - image.naturalHeight * scale) / 2;

  const screenToImage = (sx: number, sy: number): { x: number; y: number } => ({
    x: (sx - ox) / scale,
    y: (sy - oy) / scale,
  });

  const onPointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): void => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const sx = ((e.clientX - rect.left) * PREVIEW_SIZE) / rect.width;
    const sy = ((e.clientY - rect.top) * PREVIEW_SIZE) / rect.height;
    const cx = ox + crop.x * scale;
    const cy = oy + crop.y * scale;
    const cs = crop.size * scale;

    const inHandle =
      sx >= cx + cs - 12 && sx <= cx + cs && sy >= cy + cs - 12 && sy <= cy + cs;
    const inFrame =
      sx >= cx && sx <= cx + cs && sy >= cy && sy <= cy + cs;

    if (!inFrame && !inHandle) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({
      mode: inHandle ? "resize" : "move",
      startX: sx,
      startY: sy,
      origCrop: crop,
    });
  };

  const onPointerMove = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): void => {
    if (!drag) return;
    e.preventDefault();
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const sx = ((e.clientX - rect.left) * PREVIEW_SIZE) / rect.width;
    const sy = ((e.clientY - rect.top) * PREVIEW_SIZE) / rect.height;
    const dxPx = (sx - drag.startX) / scale;
    const dyPx = (sy - drag.startY) / scale;

    if (drag.mode === "move") {
      const nx = clamp(
        drag.origCrop.x + dxPx,
        Math.min(0, image.naturalWidth - drag.origCrop.size),
        Math.max(0, image.naturalWidth - drag.origCrop.size),
      );
      const ny = clamp(
        drag.origCrop.y + dyPx,
        Math.min(0, image.naturalHeight - drag.origCrop.size),
        Math.max(0, image.naturalHeight - drag.origCrop.size),
      );
      onCrop({ ...drag.origCrop, x: nx, y: ny });
    } else if (drag.mode === "resize") {
      const delta = Math.max(dxPx, dyPx);
      const minSize = Math.max(16, naturalMax * 0.05);
      const maxSize = Math.min(
        image.naturalWidth - drag.origCrop.x,
        image.naturalHeight - drag.origCrop.y,
      );
      const size = clamp(drag.origCrop.size + delta, minSize, Math.max(minSize, maxSize));
      onCrop({ ...drag.origCrop, size });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    if (drag) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDrag(null);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">クロップ（1:1）</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          className="cursor-move touch-none rounded-md border border-border"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCrop(autoSquareCrop(image))}
        >
          中央正方形
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCrop(fitWholeCrop(image))}
        >
          <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
          画像全体を使う
        </Button>
      </div>
    </Card>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
