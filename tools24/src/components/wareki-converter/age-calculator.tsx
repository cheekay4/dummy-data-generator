'use client';

import { Card, CardContent } from '@/components/ui/card';
import { calculateAge } from '@/lib/wareki/converter';

interface AgeCalculatorProps {
  year: number;
  month: number;
  day: number;
}

export function AgeCalculator({ year, month, day }: AgeCalculatorProps) {
  const result = calculateAge(year, month, day);
  if (!result) return null;

  return (
    <Card className="mt-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-4 pb-4">
        <p className="text-sm font-semibold mb-2 text-blue-900 dark:text-blue-200">
          年齢計算
        </p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">満年齢：</span>
            <span className="font-medium">{result.fullAge}歳</span>
          </p>
          <p>
            <span className="text-muted-foreground">数え年：</span>
            <span className="font-medium">{result.countingAge}歳</span>
          </p>
          {result.daysUntilBirthday > 0 && (
            <p>
              <span className="text-muted-foreground">次の誕生日まで：</span>
              <span className="font-medium">あと{result.daysUntilBirthday}日</span>
            </p>
          )}
          {result.daysUntilBirthday === 0 && (
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              今日が誕生日です！
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
