"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { affiliateLinks } from "@/lib/affiliates";
import { loadTaxData, type TaxData } from "@/lib/storage";

const DISMISSED_KEY = "affiliate-toast-dismissed";

const TOOL_RESULT_KEYS: (keyof TaxData)[] = [
  "incomeTax",
  "medicalDeduction",
  "furusatoLimit",
  "needsFiling",
  "lifeInsuranceDeduction",
  "housingLoanDeduction",
];

function countToolResults(): number {
  try {
    const data = loadTaxData();
    return TOOL_RESULT_KEYS.filter((k) => data[k] !== undefined).length;
  } catch {
    return 0;
  }
}

export function AffiliateToast(): React.ReactElement | null {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const isKakuteiPage = pathname.startsWith("/kakutei");

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    function tryStart() {
      if (timerId !== null) return; // すでにタイマー設定済み
      try {
        if (localStorage.getItem(DISMISSED_KEY)) return;
      } catch {
        return;
      }
      if (countToolResults() < 2) return;

      timerId = setTimeout(() => {
        setVisible(true);
      }, 8000);
    }

    tryStart(); // マウント時に即チェック
    window.addEventListener('taxdata-updated', tryStart); // 同一タブでのデータ保存を検知

    return () => {
      window.removeEventListener('taxdata-updated', tryStart);
      if (timerId !== null) clearTimeout(timerId);
    };
  }, []);

  function dismiss() {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      setFading(false);
      try {
        localStorage.setItem(DISMISSED_KEY, "1");
      } catch {}
    }, 300);
  }

  if (!visible || !isKakuteiPage) return null;

  const freee = affiliateLinks.freee;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full rounded-lg border bg-background shadow-lg print:hidden transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug">
            クラウド会計ソフトで
            <br />
            確定申告をもっと簡単に。
          </p>
          <button
            onClick={dismiss}
            className="flex-shrink-0 rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="閉じる"
          >
            <X size={24} />
          </button>
        </div>
        <a
          href={freee.url}
          target="_blank"
          rel="nofollow noreferrer"
          className="mt-3 block w-full rounded-md bg-primary text-primary-foreground text-sm text-center py-2 hover:opacity-90 transition-opacity"
        >
          freeeを無料で試す →
        </a>
        {/* A8.net インプレッション計測 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={freee.impressionImg}
          alt=""
          width={1}
          height={1}
          style={{ display: "none" }}
          aria-hidden="true"
        />
        <p className="text-xs text-muted-foreground text-right mt-2">PR</p>
      </div>
    </div>
  );
}
