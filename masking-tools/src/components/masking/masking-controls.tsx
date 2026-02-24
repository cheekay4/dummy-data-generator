"use client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { DetectionResult } from "@/lib/types";
import { DetectionSummary } from "./detection-summary";

interface MaskingControlsProps {
  onMask: () => void;
  isProcessing: boolean;
  detectionResult: DetectionResult | null;
  disabled: boolean;
}

export function MaskingControls({ onMask, isProcessing, detectionResult, disabled }: MaskingControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Button
        size="lg"
        onClick={onMask}
        disabled={disabled || isProcessing}
        className="w-full lg:w-auto px-8 gap-2"
      >
        {isProcessing ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> 処理中...</>
        ) : (
          <><ShieldCheck className="h-4 w-4" /> マスクする →</>
        )}
      </Button>
      {detectionResult && <DetectionSummary result={detectionResult} />}
    </div>
  );
}
