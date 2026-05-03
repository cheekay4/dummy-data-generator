import {
  applyShadow,
  drawBackground,
  gradientCoords,
  withTransform,
} from "./canvas-renderer";
import {
  BackgroundSettings,
  EffectSettings,
  EMOJI_SIZE,
  TextSettings,
} from "./types";

export function calcAutoFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  fontWeight: number,
  maxWidth: number,
  maxHeight: number,
): number {
  if (!text) return 96;
  let lo = 8;
  let hi = 256;
  let best = lo;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${fontWeight} ${mid}px "${fontFamily}", sans-serif`;
    const metrics = ctx.measureText(text);
    const width = metrics.width;
    const ascent =
      metrics.actualBoundingBoxAscent ?? mid * 0.8;
    const descent =
      metrics.actualBoundingBoxDescent ?? mid * 0.2;
    const height = ascent + descent;
    if (width <= maxWidth && height <= maxHeight) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

export interface RenderTextOptions {
  text: TextSettings;
  background: BackgroundSettings;
  effect: EffectSettings;
  /** Optional vertical offset (px) added in canvas units (used for animations like bounce). */
  offsetY?: number;
  /** Optional horizontal offset (px). */
  offsetX?: number;
  /** Optional scale multiplier (used for pulse animation). */
  scale?: number;
  /** Override the displayed text (used for typing animation). */
  overrideText?: string;
  /** Override opacity (used for blink animation). */
  overrideOpacity?: number;
  /** Override rotation (used for rotate animation). */
  overrideRotation?: number;
}

export function renderText(
  ctx: CanvasRenderingContext2D,
  opts: RenderTextOptions,
): void {
  const size = ctx.canvas.width;
  ctx.clearRect(0, 0, size, size);
  drawBackground(ctx, opts.background);

  const text = opts.overrideText ?? opts.text.text;
  if (!text) return;

  const padding = 4;
  const maxArea = size - padding * 2;

  const fontWeight = opts.text.fontWeight;
  const fontFamily = opts.text.fontFamily;

  let fontSize = opts.text.autoFit
    ? calcAutoFontSize(ctx, text, fontFamily, fontWeight, maxArea, maxArea)
    : opts.text.fontSize;

  if (opts.scale && opts.scale !== 1) {
    fontSize = Math.max(4, fontSize * opts.scale);
  }

  const effect: EffectSettings = {
    ...opts.effect,
    rotation: opts.overrideRotation ?? opts.effect.rotation,
    opacity: opts.overrideOpacity ?? opts.effect.opacity,
  };

  withTransform(ctx, effect, () => {
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cx = size / 2 + (opts.offsetX ?? 0);
    const cy = size / 2 + (opts.offsetY ?? 0);

    applyShadow(ctx, effect);

    if (effect.stroke) {
      ctx.lineWidth = effect.strokeWidth * 2;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeStyle = effect.strokeColor;
      ctx.strokeText(text, cx, cy);
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (opts.text.useGradient) {
      const [x0, y0, x1, y1] = gradientCoords(
        size,
        opts.text.gradientDirection,
      );
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, opts.text.gradientStart);
      grad.addColorStop(1, opts.text.gradientEnd);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = opts.text.color;
    }

    ctx.fillText(text, cx, cy);
  });
}

export async function ensureFontLoaded(
  family: string,
  weight: number,
  text: string,
): Promise<void> {
  if (typeof document === "undefined") return;
  try {
    await document.fonts.load(`${weight} 64px "${family}"`, text || "あ");
    await document.fonts.ready;
  } catch {
    // ignore — fallback to system font
  }
}

export const EMOJI_CANVAS_SIZE = EMOJI_SIZE;
