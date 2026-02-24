import type { AnalysisResult } from '@/lib/contract/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SummaryTab } from './summary-tab';
import { RisksTab } from './risks-tab';
import { ArticlesTab } from './articles-tab';

interface AnalysisResultProps {
  result: AnalysisResult;
}

export function AnalysisResultView({ result }: AnalysisResultProps) {
  const highCount = result.risks.filter((r) => r.riskLevel === 'high').length;
  const mediumCount = result.risks.filter((r) => r.riskLevel === 'medium').length;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Step 3: 分析結果</h2>

      <Tabs defaultValue="summary">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="summary">概要・要約</TabsTrigger>
          <TabsTrigger value="risks">
            リスク詳細
            {(highCount > 0 || mediumCount > 0) && (
              <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-1">
                {highCount + mediumCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="articles">条項対照表</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <SummaryTab result={result} />
        </TabsContent>
        <TabsContent value="risks" className="mt-4">
          <RisksTab result={result} />
        </TabsContent>
        <TabsContent value="articles" className="mt-4">
          <ArticlesTab result={result} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
