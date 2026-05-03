import { renderImage, RenderImageOptions } from "./image-processor";
import { renderText, RenderTextOptions } from "./text-renderer";
import { AnimationType, EMOJI_SIZE } from "./types";

const FRAME_COUNT_BY_TYPE: Record<Exclude<AnimationType, "none">, number> = {
  bounce: 20,
  rotate: 24,
  blink: 20,
  shake: 16,
  pulse: 20,
  typing: 0,
};

export function getFrameCount(type: AnimationType, text?: string): number {
  if (type === "none") return 1;
  if (type === "typing") {
    const chars = Array.from(text ?? "");
    return Math.max(1, chars.length * 4);
  }
  return FRAME_COUNT_BY_TYPE[type];
}

export function renderTextFrame(
  ctx: CanvasRenderingContext2D,
  base: RenderTextOptions,
  type: AnimationType,
  frame: number,
  total: number,
): void {
  if (type === "none") {
    renderText(ctx, base);
    return;
  }
  const t = total === 0 ? 0 : frame / total;
  const overrides = computeTextOverrides(type, t, frame, base.text.text);
  renderText(ctx, { ...base, ...overrides });
}

export function renderImageFrame(
  ctx: CanvasRenderingContext2D,
  base: RenderImageOptions,
  type: AnimationType,
  frame: number,
  total: number,
): void {
  if (type === "none") {
    renderImage(ctx, base);
    return;
  }
  const t = total === 0 ? 0 : frame / total;
  const effectOverrides = computeImageEffectOverrides(type, t);
  renderImage(ctx, {
    ...base,
    effect: { ...base.effect, ...effectOverrides.effect },
  });
}

interface TextOverrides {
  offsetY?: number;
  offsetX?: number;
  scale?: number;
  overrideText?: string;
  overrideOpacity?: number;
  overrideRotation?: number;
}

function computeTextOverrides(
  type: AnimationType,
  t: number,
  frame: number,
  text: string,
): TextOverrides {
  const angle = t * Math.PI * 2;
  switch (type) {
    case "bounce":
      return { offsetY: -Math.abs(Math.sin(angle)) * (EMOJI_SIZE * 0.12) };
    case "rotate":
      return { overrideRotation: t * 360 };
    case "blink": {
      const opacity = (Math.sin(angle - Math.PI / 2) + 1) / 2;
      return { overrideOpacity: 20 + opacity * 80 };
    }
    case "shake":
      return { offsetX: Math.sin(angle * 2) * (EMOJI_SIZE * 0.06) };
    case "pulse":
      return { scale: 0.85 + (Math.sin(angle - Math.PI / 2) + 1) / 2 * 0.3 };
    case "typing": {
      const chars = Array.from(text);
      if (chars.length === 0) return {};
      const visible = Math.min(chars.length, Math.floor(frame / 4) + 1);
      return { overrideText: chars.slice(0, visible).join("") };
    }
    default:
      return {};
  }
}

function computeImageEffectOverrides(
  type: AnimationType,
  t: number,
): { effect: { rotation?: number; opacity?: number } } {
  const angle = t * Math.PI * 2;
  switch (type) {
    case "rotate":
      return { effect: { rotation: t * 360 } };
    case "blink": {
      const opacity = (Math.sin(angle - Math.PI / 2) + 1) / 2;
      return { effect: { opacity: 20 + opacity * 80 } };
    }
    default:
      return { effect: {} };
  }
}
