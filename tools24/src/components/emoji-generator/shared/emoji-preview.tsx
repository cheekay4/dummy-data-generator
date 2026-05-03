"use client";

import { forwardRef, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Props {
  /** Source canvas element. The preview redraws by mirroring its content. */
  source: HTMLCanvasElement | null;
  /** Optional GIF blob URL to display instead of canvas (for animation preview). */
  gifUrl?: string | null;
}

export const EmojiPreview = forwardRef<HTMLDivElement, Props>(function EmojiPreview(
  { source, gifUrl },
  ref,
): React.ReactElement {
  const smallRef = useRef<HTMLCanvasElement>(null);
  const largeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (gifUrl) return;
    if (!source) return;
    const drawTo = (target: HTMLCanvasElement | null): void => {
      if (!target) return;
      const ctx = target.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, target.width, target.height);
      ctx.drawImage(source, 0, 0, target.width, target.height);
    };
    drawTo(smallRef.current);
    drawTo(largeRef.current);
  });

  return (
    <Card className="p-4" ref={ref}>
      <h3 className="text-sm font-semibold mb-3">プレビュー</h3>
      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">実寸 128px</div>
          <PreviewBox size={128}>
            {gifUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gifUrl}
                alt="プレビュー"
                width={128}
                height={128}
                className="block"
              />
            ) : (
              <canvas
                ref={smallRef}
                width={128}
                height={128}
                className="block"
              />
            )}
          </PreviewBox>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">拡大 256px</div>
          <PreviewBox size={256}>
            {gifUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gifUrl}
                alt="プレビュー"
                width={256}
                height={256}
                className="block"
              />
            ) : (
              <canvas
                ref={largeRef}
                width={256}
                height={256}
                className="block"
              />
            )}
          </PreviewBox>
        </div>
      </div>
    </Card>
  );
});

function PreviewBox({
  size,
  children,
}: {
  size: number;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className="rounded-md border border-border overflow-hidden"
      style={{
        width: size,
        height: size,
        backgroundImage:
          "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)",
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </div>
  );
}
