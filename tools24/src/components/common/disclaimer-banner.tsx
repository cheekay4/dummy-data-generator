"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "disclaimer-banner-dismissed";

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex-1">
          ※ このツールの計算結果は概算です。実際の税額は条件により異なります。正確な計算は
          <a
            href="https://www.keisan.nta.go.jp/kyoutu/ky/sm/top"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
          >
            国税庁の確定申告書等作成コーナー
          </a>
          または税理士にご確認ください。
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
          aria-label="閉じる"
        >
          <X className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </button>
      </div>
    </div>
  );
}
