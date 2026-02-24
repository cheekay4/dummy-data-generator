'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TypeSelector } from './type-selector';
import { ContractInput } from './contract-input';
import { AnalysisResultView } from './analysis-result';
import { UsageBanner } from './usage-banner';
import { canUse, getRemainingUses, incrementUsage, isProUser } from '@/lib/contract/usage';
import type { ContractType, PositionType, AnalysisResult } from '@/lib/contract/types';

export function ContractChecker() {
  const [contractType, setContractType] = useState<ContractType>('auto');
  const [position, setPosition] = useState<PositionType>('receiver');
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(2);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setRemaining(getRemainingUses());
    setIsPro(isProUser());
  }, []);

  const analyze = useCallback(async () => {
    if (!text.trim()) {
      setError('契約書テキストを入力してください');
      return;
    }
    if (!canUse()) {
      setError('今月の無料枠を使い切りました。Proプランにアップグレードしてください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: text, contractType, position }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? '分析に失敗しました');
      }

      // data.result is already parsed JSON from the API route
      setResult(data.result as AnalysisResult);
      // Only consume usage for valid contract analyses (riskScore=-1 means not a contract)
      if ((data.result as AnalysisResult).riskScore >= 0) {
        incrementUsage();
        setRemaining(getRemainingUses());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [contractType, position, text]);

  return (
    <div className="space-y-4">
      <UsageBanner remaining={remaining} isPro={isPro} />

      <Card>
        <CardContent className="pt-6 space-y-6">
          <TypeSelector
            contractType={contractType}
            position={position}
            onContractTypeChange={setContractType}
            onPositionChange={setPosition}
          />

          <div className="border-t pt-6">
            <ContractInput text={text} isPro={isPro} onTextChange={setText} />
          </div>

          {error && (
            <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full"
              onClick={analyze}
              disabled={isLoading || (!isPro && remaining <= 0)}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />分析中... AIが契約書を読み込んでいます</>
              ) : (
                '契約書をチェック'
              )}
            </Button>
            {isLoading && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <AnalysisResultView result={result} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
