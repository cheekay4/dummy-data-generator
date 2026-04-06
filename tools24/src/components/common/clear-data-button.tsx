"use client";

import { clearTaxData } from "@/lib/storage";

export function ClearDataButton() {
  const handleClear = () => {
    clearTaxData();
    window.location.reload();
  };

  return (
    <button
      onClick={handleClear}
      className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
    >
      入力データをクリア
    </button>
  );
}
