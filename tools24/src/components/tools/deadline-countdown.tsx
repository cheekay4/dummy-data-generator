"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const DEADLINE = new Date("2026-03-16T23:59:59+09:00");

export function DeadlineCountdown() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const diff = DEADLINE.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  }, []);

  if (daysLeft === null) return null;

  const isExpired = daysLeft <= 0;

  return (
    <div
      className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        isExpired
          ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
      }`}
    >
      <Calendar className="h-4 w-4" />
      {isExpired ? (
        <span>確定申告期間は終了しました</span>
      ) : (
        <span>
          2025年分 確定申告期限（2026年3月16日）まであと
          <strong className="ml-1">{daysLeft}日</strong>
        </span>
      )}
    </div>
  );
}
