"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./image-uploader";
import { ImageCropper } from "./image-cropper";
import { ImageAdjustmentsPanel } from "./image-adjustments";
import { EffectSettingsPanel } from "../shared/effect-settings";
import { EmojiPreview } from "../shared/emoji-preview";
import { DownloadPanel } from "../shared/download-panel";
import { Progress } from "../shared/progress-bar";
import { canvasToPng } from "@/lib/emoji-generator/size-optimizer";
import {
  autoSquareCrop,
  loadImageFromUrl,
  renderImage,
} from "@/lib/emoji-generator/image-processor";
import {
  encodeGif,
  loopOptionToRepeat,
} from "@/lib/emoji-generator/gif-encoder";
import {
  AnimationSettings,
  CropRect,
  DEFAULT_ANIMATION_SETTINGS,
  DEFAULT_BACKGROUND_SETTINGS,
  DEFAULT_EFFECT_SETTINGS,
  DEFAULT_IMAGE_ADJUSTMENTS,
  EMOJI_SIZE,
} from "@/lib/emoji-generator/types";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackgroundSettings } from "../text-tab/background-settings";

export function ImageTab(): React.ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, size: 1 });
  const [bg, setBg] = useState(DEFAULT_BACKGROUND_SETTINGS);
  const [effect, setEffect] = useState({
    ...DEFAULT_EFFECT_SETTINGS,
    borderRadius: 0,
  });
  const [adjustments, setAdjustments] = useState(DEFAULT_IMAGE_ADJUSTMENTS);
  const [anim, setAnim] = useState<AnimationSettings>(DEFAULT_ANIMATION_SETTINGS);
  const [pngBytes, setPngBytes] = useState<number | null>(null);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifBusy, setGifBusy] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (!canvasRef.current && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = EMOJI_SIZE;
    c.height = EMOJI_SIZE;
    canvasRef.current = c;
  }

  useEffect(() => {
    if (!file) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImage(null);
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    void loadImageFromUrl(url).then((img) => {
      setImage(img);
      setCrop(autoSquareCrop(img));
    });
    return (): void => {
      URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Re-render canvas when settings change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      setPngBytes(null);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderImage(ctx, {
      image,
      crop,
      background: bg,
      effect,
      adjustments,
    });
    void canvasToPng(canvas).then((blob) => setPngBytes(blob.size));
  }, [image, crop, bg, effect, adjustments]);

  // Reset stale GIF on changes.
  useEffect(() => {
    setGifBlob(null);
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, crop, bg, effect, adjustments, anim]);

  const handleClear = (): void => {
    setFile(null);
    setPngBytes(null);
  };

  const handleGenerateGif = async (): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas || !image || anim.type === "none") return;
    setGifBusy(true);
    setGifProgress(0);
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const total = anim.type === "rotate" ? 24 : 20;
      const frames: HTMLCanvasElement[] = [];
      for (let i = 0; i < total; i++) {
        const t = i / total;
        const angleDeg =
          anim.type === "rotate" ? t * 360 : effect.rotation;
        const opacity =
          anim.type === "blink"
            ? 20 +
              ((Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2) * 80
            : effect.opacity;
        const offsetEffect = {
          ...effect,
          rotation: angleDeg,
          opacity,
        };
        renderImage(ctx, {
          image,
          crop,
          background: bg,
          effect: offsetEffect,
          adjustments,
        });
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
      setGifUrl(URL.createObjectURL(blob));
      // restore static preview
      renderImage(ctx, { image, crop, background: bg, effect, adjustments });
    } finally {
      setGifBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
      <div className="space-y-4">
        <ImageUploader
          hasImage={!!image}
          fileName={file?.name}
          onFile={setFile}
          onClear={handleClear}
        />

        {image && (
          <>
            <ImageCropper image={image} crop={crop} onCrop={setCrop} />
            <ImageAdjustmentsPanel
              value={adjustments}
              onChange={setAdjustments}
            />
            <BackgroundSettings value={bg} onChange={setBg} />
            <EffectSettingsPanel
              value={effect}
              onChange={setEffect}
              showBorderRadius
            />
            <AnimationSimplePanel value={anim} onChange={setAnim} />
          </>
        )}
      </div>

      <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <EmojiPreview source={canvasRef.current} gifUrl={gifUrl} />
        <DownloadPanel
          canvas={image ? canvasRef.current : null}
          filenameSeed={file?.name?.replace(/\.[^.]+$/, "") ?? "image"}
          pngBytes={pngBytes}
          gifBlob={gifBlob}
          gifGenerationSlot={
            anim.type !== "none" && image ? (
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

function AnimationSimplePanel({
  value,
  onChange,
}: {
  value: AnimationSettings;
  onChange: (v: AnimationSettings) => void;
}): React.ReactElement {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">アニメーション（GIF）</h3>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">種類</label>
        <Select
          value={value.type}
          onValueChange={(v) =>
            onChange({
              ...value,
              type: v as AnimationSettings["type"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">なし（PNG）</SelectItem>
            <SelectItem value="rotate">回転</SelectItem>
            <SelectItem value="blink">点滅</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[11px] text-muted-foreground">
          画像エフェクト中心のため、回転・点滅のみ対応。
        </p>
      </div>

      {value.type !== "none" && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">フレームレート</label>
            <Select
              value={String(value.fps)}
              onValueChange={(v) =>
                onChange({ ...value, fps: Number(v) as 10 | 15 | 20 })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 fps</SelectItem>
                <SelectItem value="15">15 fps</SelectItem>
                <SelectItem value="20">20 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">ループ回数</label>
            <Select
              value={String(value.loop)}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  loop:
                    v === "infinite"
                      ? "infinite"
                      : (Number(v) as 1 | 3),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infinite">無限</SelectItem>
                <SelectItem value="1">1回</SelectItem>
                <SelectItem value="3">3回</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </Card>
  );
}
