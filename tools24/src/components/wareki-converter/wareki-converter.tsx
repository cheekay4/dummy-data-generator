'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversionTabs } from './conversion-tabs';
import { ConversionResultPanel } from './conversion-result';
import { AgeCalculator } from './age-calculator';
import { BusinessDays } from './business-days';
import { EraTable } from './era-table';
import { QuickSearch } from './quick-search';
import type { ConversionResult } from '@/lib/wareki/converter';

export function WarekiConverter() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (r: ConversionResult) => {
    setResult(r);
    setError(null);
  };

  const handleError = (e: string) => {
    setError(e);
    setResult(null);
  };

  const showAge =
    result !== null &&
    result.month !== null &&
    result.day !== null;

  const showBusinessDays = result !== null && result.month !== null && result.day !== null;

  return (
    <div className="space-y-6">
      {/* Input card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">日付を入力</CardTitle>
        </CardHeader>
        <CardContent>
          <ConversionTabs onResult={handleResult} onError={handleError} />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      <ConversionResultPanel result={result} />

      {/* Age calculator */}
      {showAge && result.year && result.month && result.day && (
        <AgeCalculator
          year={result.year}
          month={result.month}
          day={result.day}
        />
      )}

      {/* Business days (accordion) */}
      {showBusinessDays && result.year && result.month && result.day && (
        <BusinessDays
          defaultYear={result.year}
          defaultMonth={result.month}
          defaultDay={result.day}
        />
      )}

      {/* Era reference table */}
      <EraTable />

      {/* Quick search */}
      <QuickSearch />
    </div>
  );
}
