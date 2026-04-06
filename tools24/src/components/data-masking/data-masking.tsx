"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { MaskingInput } from "./masking-input";
import { MaskingOutput } from "./masking-output";
import { MaskingControls } from "./masking-controls";
import { MaskingSettings } from "./masking-settings";
import { DEFAULT_MASK_SETTINGS, MaskSettings, DetectionResult } from "@/lib/masking/types";
import { detectAll } from "@/lib/masking/detectors";
import { applyMask } from "@/lib/masking/replacers";

const MAX_INPUT_CHARS = 50000;

export function DataMasking(): React.JSX.Element {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [settings, setSettings] = useState<MaskSettings>(DEFAULT_MASK_SETTINGS);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleMask = async (): Promise<void> => {
    if (!inputText.trim()) return;
    setInputError(null);
    if (inputText.length > MAX_INPUT_CHARS) {
      setInputError(`入力テキストが長すぎます（${inputText.length.toLocaleString()}文字）。${MAX_INPUT_CHARS.toLocaleString()}文字以内にしてください。`);
      return;
    }
    setIsProcessing(true);
    try {
      const result = detectAll(inputText, settings);
      setDetectionResult(result);
      const masked = await applyMask(inputText, result.items, settings.mode);
      setOutputText(masked);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* 文字数超過エラー */}
      {inputError && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{inputError}</p>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        <MaskingInput value={inputText} onChange={setInputText} />

        <MaskingControls
          onMask={handleMask}
          isProcessing={isProcessing}
          detectionResult={detectionResult}
          disabled={!inputText.trim()}
        />

        <MaskingOutput value={outputText} />
      </div>

      {/* Settings */}
      <MaskingSettings
        settings={settings}
        onChange={setSettings}
      />
    </div>
  );
}
