'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { calculateBusinessDays } from '@/lib/wareki/converter';
import type { Holiday } from '@/lib/wareki/holidays';

interface BusinessDaysProps {
  defaultYear?: number;
  defaultMonth?: number;
  defaultDay?: number;
}

function padDate(n: number) {
  return String(n).padStart(2, '0');
}

function toInputValue(year: number, month: number, day: number): string {
  return `${year}-${padDate(month)}-${padDate(day)}`;
}

export function BusinessDays({ defaultYear, defaultMonth, defaultDay }: BusinessDaysProps) {
  const today = new Date();
  const startDefault =
    defaultYear && defaultMonth && defaultDay
      ? toInputValue(defaultYear, defaultMonth, defaultDay)
      : toInputValue(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const endDefault = toInputValue(
    nextWeek.getFullYear(),
    nextWeek.getMonth() + 1,
    nextWeek.getDate(),
  );

  const [startDate, setStartDate] = useState(startDefault);
  const [endDate, setEndDate] = useState(endDefault);
  const [result, setResult] = useState<{
    calendarDays: number;
    businessDays: number;
    holidays: Holiday[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalc = () => {
    if (!startDate || !endDate) {
      setError('開始日と終了日を入力してください');
      return;
    }
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);

    if (new Date(ey, em - 1, ed) < new Date(sy, sm - 1, sd)) {
      setError('終了日は開始日以降を指定してください');
      return;
    }

    const diff = Math.round(
      (new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    if (diff > 3650) {
      setError('計算範囲は10年以内にしてください');
      return;
    }

    setError(null);
    setResult(calculateBusinessDays(sy, sm, sd, ey, em, ed));
  };

  return (
    <details className="border rounded-lg group">
      <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none">
        <span className="text-sm font-semibold">営業日計算</span>
        <svg
          className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-4 pb-4 border-t pt-4">
        <p className="text-xs text-muted-foreground mb-3">
          土日・祝日を除いた営業日数を計算します
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">開始日</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">終了日</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive mb-2">{error}</p>
        )}

        <Button size="sm" onClick={handleCalc}>計算</Button>

        {result && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                <div className="text-2xl font-bold">{result.calendarDays}</div>
                <div className="text-xs text-muted-foreground">カレンダー日数</div>
              </div>
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.businessDays}
                </div>
                <div className="text-xs text-muted-foreground">営業日数（土日祝除く）</div>
              </div>
            </div>

            {result.holidays.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  含まれる祝日（{result.holidays.length}日）
                </p>
                <div className="space-y-1">
                  {result.holidays.map((h) => (
                    <div key={h.date} className="flex gap-2 text-xs">
                      <span className="text-muted-foreground">{h.date}</span>
                      <span>{h.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
