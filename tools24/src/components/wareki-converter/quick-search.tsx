'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ERAS, getEraStartYear } from '@/lib/wareki/eras';
import { formatWareki } from '@/lib/wareki/converter';

export function QuickSearch() {
  const [inputYear, setInputYear] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = () => {
    const year = parseInt(inputYear, 10);
    if (isNaN(year) || year < 1868 || year > 2100) {
      setResult('1868〜2100の西暦年を入力してください');
      return;
    }

    const matches: string[] = [];
    for (const era of ERAS) {
      const start = new Date(era.startDate);
      const end = era.endDate ? new Date(era.endDate) : null;
      const startYear = start.getFullYear();
      const endYear = end ? end.getFullYear() : 9999;
      if (year >= startYear && year <= endYear) {
        const eraYear = year - getEraStartYear(era) + 1;
        if (eraYear >= 1) {
          matches.push(formatWareki(era.name, eraYear));
        }
      }
    }

    if (matches.length === 0) {
      setResult('和暦の範囲外です');
    } else {
      setResult(matches.join(' / '));
    }
  };

  return (
    <section className="mt-8">
      <h3 className="text-base font-semibold mb-3">西暦 → 和暦 クイック検索</h3>
      <div className="flex items-center gap-2 max-w-xs">
        <span className="text-sm text-muted-foreground whitespace-nowrap">西暦</span>
        <input
          type="number"
          value={inputYear}
          onChange={(e) => setInputYear(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="例: 1989"
          min={1868}
          max={2100}
          className="flex-1 px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">年は？</span>
        <Button size="sm" onClick={handleSearch} variant="outline">
          検索
        </Button>
      </div>
      {result && (
        <div className="mt-2 px-3 py-2 bg-muted/50 rounded-md text-sm font-medium">
          {result}
        </div>
      )}
    </section>
  );
}
