export type TabMode = "text" | "image";

export type GradientDirection = "top-bottom" | "left-right" | "diagonal";

export type AnimationType =
  | "none"
  | "bounce"
  | "rotate"
  | "blink"
  | "shake"
  | "pulse"
  | "typing";

export type LoopOption = "infinite" | 1 | 3;

export type FpsOption = 10 | 15 | 20;

export type BackgroundType = "transparent" | "solid" | "gradient";

export interface TextSettings {
  text: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  autoFit: boolean;
  color: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: GradientDirection;
}

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: GradientDirection;
  borderRadius: number;
}

export interface EffectSettings {
  stroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  rotation: number;
  opacity: number;
  borderRadius: number;
}

export interface AnimationSettings {
  type: AnimationType;
  fps: FpsOption;
  loop: LoopOption;
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  removeBackground: boolean;
  bgRemoveColor: string;
  bgRemoveThreshold: number;
}

export interface CropRect {
  x: number;
  y: number;
  size: number;
}

export const EMOJI_SIZE = 128;
export const MAX_FILE_SIZE = 128 * 1024;

export const FONT_OPTIONS: { value: string; label: string; weights: number[] }[] = [
  {
    value: "Noto Sans JP",
    label: "Noto Sans JP",
    weights: [300, 400, 700, 900],
  },
  {
    value: "Noto Serif JP",
    label: "Noto Serif JP",
    weights: [400, 700],
  },
  {
    value: "M PLUS Rounded 1c",
    label: "M PLUS Rounded 1c",
    weights: [400, 700],
  },
  {
    value: "Kosugi Maru",
    label: "Kosugi Maru",
    weights: [400],
  },
  {
    value: "Zen Kaku Gothic New",
    label: "Zen Kaku Gothic New",
    weights: [400, 700],
  },
];

export const PRESET_COLORS: { value: string; label: string }[] = [
  { value: "#E74C3C", label: "赤" },
  { value: "#3498DB", label: "青" },
  { value: "#2ECC71", label: "緑" },
  { value: "#F39C12", label: "黄" },
  { value: "#9B59B6", label: "紫" },
  { value: "#E91E63", label: "ピンク" },
  { value: "#FFFFFF", label: "白" },
  { value: "#000000", label: "黒" },
];

export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  text: "草",
  fontFamily: "Noto Sans JP",
  fontWeight: 900,
  fontSize: 96,
  autoFit: true,
  color: "#000000",
  useGradient: false,
  gradientStart: "#E74C3C",
  gradientEnd: "#3498DB",
  gradientDirection: "top-bottom",
};

export const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  type: "transparent",
  color: "#FFFFFF",
  gradientStart: "#FBC2EB",
  gradientEnd: "#A6C1EE",
  gradientDirection: "top-bottom",
  borderRadius: 0,
};

export const DEFAULT_EFFECT_SETTINGS: EffectSettings = {
  stroke: false,
  strokeColor: "#FFFFFF",
  strokeWidth: 2,
  shadow: false,
  shadowColor: "#000000",
  shadowBlur: 4,
  shadowOffsetX: 0,
  shadowOffsetY: 2,
  rotation: 0,
  opacity: 100,
  borderRadius: 0,
};

export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  type: "none",
  fps: 15,
  loop: "infinite",
};

export const DEFAULT_IMAGE_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  removeBackground: false,
  bgRemoveColor: "#FFFFFF",
  bgRemoveThreshold: 30,
};
