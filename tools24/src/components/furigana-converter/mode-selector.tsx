"use client";

import type { ConversionMode } from "@/lib/furigana-converter/converter";

interface ModeSelectorProps {
  mode: ConversionMode;
  onChange: (mode: ConversionMode) => void;
}

const modes: { value: ConversionMode; label: string; example: string }[] = [
  { value: "hiragana", label: "ひらがな", example: "東京都 → とうきょうと" },
  { value: "katakana", label: "カタカナ", example: "東京都 → トウキョウト" },
  { value: "romaji", label: "ローマ字", example: "東京都 → toukyouto" },
  { value: "furigana", label: "ふりがな付き", example: "東京都（とうきょうと）" },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps): React.ReactElement {
  return (
    <div>
      <label className="text-sm font-medium">変換モード</label>
      <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
              mode === m.value
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary/50"
            }`}
          >
            <span className="font-medium">{m.label}</span>
            <span className="mt-0.5 block text-xs opacity-70">{m.example}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
