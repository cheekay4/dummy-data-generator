"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "../shared/progress-bar";
import { TextInput } from "./text-input";
import { FontSettings } from "./font-settings";
import { ColorSettings } from "./color-settings";
import { BackgroundSettings } from "./background-settings";
import { AnimationSettings } from "./animation-settings";
import { EffectSettingsPanel } from "../shared/effect-settings";
import { EmojiPreview } from "../shared/emoji-preview";
import { DownloadPanel } from "../shared/download-panel";
import { ensureFontLoaded, renderText } from "@/lib/emoji-generator/text-renderer";
import { canvasToPng } from "@/lib/emoji-generator/size-optimizer";
import {
  encodeGif,
  loopOptionToRepeat,
} from "@/lib/emoji-generator/gif-encoder";
import {
  getFrameCount,
  renderTextFrame,
} from "@/lib/emoji-generator/animation-frames";
import {
  DEFAULT_ANIMATION_SETTINGS,
  DEFAULT_BACKGROUND_SETTINGS,
  DEFAULT_EFFECT_SETTINGS,
  DEFAULT_TEXT_SETTINGS,
  EMOJI_SIZE,
} from "@/lib/emoji-generator/types";

export function TextTab(): React.ReactElement {
  const [text, setText] = useState(DEFAULT_TEXT_SETTINGS);
  const [bg, setBg] = useState(DEFAULT_BACKGROUND_SETTINGS);
  const [effect, setEffect] = useState(DEFAULT_EFFECT_SETTINGS);
  const [anim, setAnim] = useState(DEFAULT_ANIMATION_SETTINGS);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifBusy, setGifBusy] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [pngBytes, setPngBytes] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (!canvasRef.current && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = EMOJI_SIZE;
    c.height = EMOJI_SIZE;
    canvasRef.current = c;
  }

  // Render on every settings change.
  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await ensureFontLoaded(text.fontFamily, text.fontWeight, text.text);
      if (cancelled) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      renderText(ctx, { text, background: bg, effect });
      const blob = await canvasToPng(canvas);
      if (!cancelled) setPngBytes(blob.size);
    };
    void run();
    return (): void => {
      cancelled = true;
    };
  }, [text, bg, effect]);

  // Cleanup any prior GIF URL.
  useEffect(() => {
    return (): void => {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, [gifUrl]);

  // Reset stale GIF when settings change.
  useEffect(() => {
    setGifBlob(null);
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, bg, effect, anim]);

  const handleGenerateGif = async (): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas || anim.type === "none") return;
    setGifBusy(true);
    setGifProgress(0);
    try {
      await ensureFontLoaded(text.fontFamily, text.fontWeight, text.text);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const total = getFrameCount(anim.type, text.text);
      const frames: HTMLCanvasElement[] = [];
      for (let i = 0; i < total; i++) {
        renderTextFrame(
          ctx,
          { text, background: bg, effect },
          anim.type,
          i,
          total,
        );
        const snap = document.createElement("canvas");
        snap.width = EMOJI_SIZE;
        snap.height = EMOJI_SIZE;
        snap.getContext("2d")?.drawImage(canvas, 0, 0);
        frames.push(snap);
      }
      const blob = await encodeGif({
        frames,
        fps: anim.fps,
        repeat: loopOptionToRepeat(anim.loop),
        onProgress: (p) => setGifProgress(p),
      });
      setGifBlob(blob);
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      // Re-render the static preview canvas with the base frame.
      renderText(ctx, { text, background: bg, effect });
    } finally {
      setGifBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
      <div className="space-y-4">
        <TextInput
          value={text.text}
          onChange={(v) => setText({ ...text, text: v })}
        />
        <FontSettings value={text} onChange={setText} />
        <ColorSettings value={text} onChange={setText} />
        <BackgroundSettings value={bg} onChange={setBg} />
        <EffectSettingsPanel value={effect} onChange={setEffect} />
        <AnimationSettings value={anim} onChange={setAnim} />
      </div>

      <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <EmojiPreview source={canvasRef.current} gifUrl={gifUrl} />
        <DownloadPanel
          canvas={canvasRef.current}
          filenameSeed={text.text}
          pngBytes={pngBytes}
          gifBlob={gifBlob}
          gifGenerationSlot={
            anim.type !== "none" ? (
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  onClick={handleGenerateGif}
                  disabled={gifBusy}
                  className="w-full"
                >
                  {gifBusy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {gifBusy
                    ? `GIF生成中… ${Math.round(gifProgress * 100)}%`
                    : "GIFを生成"}
                </Button>
                {gifBusy && <Progress value={gifProgress * 100} />}
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
}
