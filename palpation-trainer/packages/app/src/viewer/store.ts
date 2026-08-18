import { create } from "zustand";
import type { PalpationJudgment } from "../scoring/palpation.js";

export type LayerKey = "skin" | "muscle" | "bone";

interface ViewerState {
  layers: Record<LayerKey, boolean>;
  skinOpacity: number;
  lastJudgment: PalpationJudgment | null;
  toggleLayer: (key: LayerKey) => void;
  setSkinOpacity: (value: number) => void;
  setJudgment: (judgment: PalpationJudgment) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  layers: { skin: true, muscle: true, bone: true },
  skinOpacity: 0.5,
  lastJudgment: null,
  toggleLayer: (key): void => {
    set((s) => ({ layers: { ...s.layers, [key]: !s.layers[key] } }));
  },
  setSkinOpacity: (value): void => {
    set({ skinOpacity: value });
  },
  setJudgment: (judgment): void => {
    set({ lastJudgment: judgment });
  },
}));
