import {
  applyShadow,
  drawBackground,
  roundedRectPath,
  withTransform,
} from "./canvas-renderer";
import {
  BackgroundSettings,
  CropRect,
  EffectSettings,
  EMOJI_SIZE,
  ImageAdjustments,
} from "./types";

export async function loadImageFromFile(
  file: File,
): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageFromUrl(url);
    return img;
  } finally {
    // Note: caller decides when to revoke. We keep the URL for the lifetime of the image
    // by attaching it as data attribute for later cleanup.
  }
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = (): void => resolve(img);
    img.onerror = (): void => reject(new Error("画像の読み込みに失敗しました"));
    img.src = url;
  });
}

export interface RenderImageOptions {
  image: HTMLImageElement | HTMLCanvasElement;
  crop: CropRect;
  background: BackgroundSettings;
  effect: EffectSettings;
  adjustments: ImageAdjustments;
}

export function renderImage(
  ctx: CanvasRenderingContext2D,
  opts: RenderImageOptions,
): void {
  const size = ctx.canvas.width;
  ctx.clearRect(0, 0, size, size);
  drawBackground(ctx, opts.background);

  withTransform(ctx, opts.effect, () => {
    ctx.save();

    if (opts.effect.borderRadius > 0) {
      const r = Math.min(opts.effect.borderRadius, size / 2);
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, size, size, r);
      ctx.clip();
    }

    applyShadow(ctx, opts.effect);

    const off = drawImageToOffscreen(opts.image, opts.crop, size);
    const adjusted = applyAdjustments(off, opts.adjustments);

    if (opts.effect.stroke) {
      drawStrokeAroundImage(
        ctx,
        adjusted,
        opts.effect.strokeColor,
        opts.effect.strokeWidth,
      );
    }

    ctx.shadowColor = "transparent";
    ctx.drawImage(adjusted, 0, 0, size, size);

    ctx.restore();
  });
}

function drawImageToOffscreen(
  img: HTMLImageElement | HTMLCanvasElement,
  crop: CropRect,
  outSize: number,
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = outSize;
  c.height = outSize;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.size,
    crop.size,
    0,
    0,
    outSize,
    outSize,
  );
  return c;
}

function applyAdjustments(
  source: HTMLCanvasElement,
  adj: ImageAdjustments,
): HTMLCanvasElement {
  const needsFilter =
    adj.brightness !== 0 || adj.contrast !== 0 || adj.saturation !== 0;
  if (!needsFilter && !adj.removeBackground) return source;

  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) return source;

  const brightness = 100 + adj.brightness;
  const contrast = 100 + adj.contrast;
  const saturate = 100 + adj.saturation;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  ctx.drawImage(source, 0, 0);
  ctx.filter = "none";

  if (adj.removeBackground) {
    removeBackgroundColor(
      ctx,
      out.width,
      out.height,
      adj.bgRemoveColor,
      adj.bgRemoveThreshold,
    );
  }

  return out;
}

function removeBackgroundColor(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  hex: string,
  thresholdPct: number,
): void {
  const target = hexToRgb(hex);
  if (!target) return;
  const threshold = Math.max(0, thresholdPct) * 2.55 * 1.5;
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const dr = px[i] - target.r;
    const dg = px[i + 1] - target.g;
    const db = px[i + 2] - target.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= threshold) {
      const ratio = 1 - dist / threshold;
      px[i + 3] = Math.max(0, px[i + 3] * (1 - ratio));
    }
  }
  ctx.putImageData(data, 0, 0);
}

function drawStrokeAroundImage(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  color: string,
  width: number,
): void {
  const size = ctx.canvas.width;
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const offCtx = off.getContext("2d");
  if (!offCtx) return;

  const w = Math.max(1, Math.round(width));
  for (let dx = -w; dx <= w; dx++) {
    for (let dy = -w; dy <= w; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (dx * dx + dy * dy > w * w) continue;
      offCtx.drawImage(source, dx, dy, size, size);
    }
  }
  offCtx.globalCompositeOperation = "source-in";
  offCtx.fillStyle = color;
  offCtx.fillRect(0, 0, size, size);

  ctx.drawImage(off, 0, 0);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

export function autoSquareCrop(img: HTMLImageElement | HTMLCanvasElement): CropRect {
  const w = "naturalWidth" in img ? img.naturalWidth : img.width;
  const h = "naturalHeight" in img ? img.naturalHeight : img.height;
  const size = Math.min(w, h);
  return {
    x: Math.floor((w - size) / 2),
    y: Math.floor((h - size) / 2),
    size,
  };
}

export function fitWholeCrop(img: HTMLImageElement | HTMLCanvasElement): CropRect {
  const w = "naturalWidth" in img ? img.naturalWidth : img.width;
  const h = "naturalHeight" in img ? img.naturalHeight : img.height;
  const size = Math.max(w, h);
  return {
    x: -Math.floor((size - w) / 2),
    y: -Math.floor((size - h) / 2),
    size,
  };
}

export const IMAGE_OUTPUT_SIZE = EMOJI_SIZE;
