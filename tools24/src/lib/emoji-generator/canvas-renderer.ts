import {
  BackgroundSettings,
  EffectSettings,
  EMOJI_SIZE,
  GradientDirection,
} from "./types";

export function createCanvas(size: number = EMOJI_SIZE): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context not available");
  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function gradientCoords(
  size: number,
  direction: GradientDirection,
): [number, number, number, number] {
  switch (direction) {
    case "left-right":
      return [0, 0, size, 0];
    case "diagonal":
      return [0, 0, size, size];
    case "top-bottom":
    default:
      return [0, 0, 0, size];
  }
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: BackgroundSettings,
): void {
  const size = ctx.canvas.width;
  if (bg.type === "transparent") return;

  ctx.save();
  if (bg.borderRadius > 0) {
    const r = Math.min(bg.borderRadius, size / 2);
    ctx.beginPath();
    roundedRectPath(ctx, 0, 0, size, size, r);
    ctx.clip();
  }

  if (bg.type === "solid") {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, size, size);
  } else {
    const [x0, y0, x1, y1] = gradientCoords(size, bg.gradientDirection);
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, bg.gradientStart);
    grad.addColorStop(1, bg.gradientEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.restore();
}

export function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function applyShadow(
  ctx: CanvasRenderingContext2D,
  effect: EffectSettings,
): void {
  if (!effect.shadow) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    return;
  }
  ctx.shadowColor = effect.shadowColor;
  ctx.shadowBlur = effect.shadowBlur;
  ctx.shadowOffsetX = effect.shadowOffsetX;
  ctx.shadowOffsetY = effect.shadowOffsetY;
}

export function withTransform(
  ctx: CanvasRenderingContext2D,
  effect: EffectSettings,
  draw: () => void,
): void {
  const size = ctx.canvas.width;
  ctx.save();
  ctx.globalAlpha = effect.opacity / 100;
  if (effect.rotation !== 0) {
    ctx.translate(size / 2, size / 2);
    ctx.rotate((effect.rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);
  }
  draw();
  ctx.restore();
}
