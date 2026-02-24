import type { Metadata } from 'next';
import { ContractChecker } from '@/components/contract/contract-checker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: '契約書チェッカー | AIが契約書のリスク・不利条項を自動検出',
  description:
    '契約書を貼り付けるだけで、AIがリスクスコア・不利条項・改善案を瞬時に分析。業務委託・NDA・売買契約など全12カテゴリの条項をチェック。',
  openGraph: {
    title: '契約書チェッカー',
    description: 'AIが契約書のリスクと不利条項を瞬時にチェック',
    type: 'website',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '契約書チェッカー',
    description: '契約書を貼り付けるだけで、AIがリスクスコア・不利条項・改善案を瞬時に分析します。',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">契約書チェッカー</h1>
          <p className="text-muted-foreground">AIが契約書のリスクと不利条項を瞬時にチェック</p>
        </div>

        {/* Main tool */}
        <ContractChecker />

        {/* SEO content */}
        <div className="space-y-4 mt-12">
          <Accordion type="multiple" className="border rounded-xl divide-y">
            <AccordionItem value="about" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">契約書チェックとは</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground space-y-2 pb-2">
                  <p>
                    契約書チェック（契約書レビュー）とは、契約書に記載された条項を精査し、不利な条件やリスクがないかを確認する作業です。
                    特にフリーランスや中小企業にとって、不利な契約条件を見逃すことは事業に大きな影響を与える可能性があります。
                  </p>
                  <p>
                    本ツールはAIを活用して契約書の主要リスクを自動検出し、改善案を提案します。
                    ただし、AIによる参考分析であり、法的助言ではありません。重要な契約は必ず弁護士にご相談ください。
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="points" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">チェックすべき重要ポイント</AccordionTrigger>
              <AccordionContent>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-4 pb-2">
                  <li><strong className="text-foreground">損害賠償の上限</strong>: 無制限の賠償責任は受注側にとって大きなリスク</li>
                  <li><strong className="text-foreground">支払条件</strong>: 支払サイト60日超は資金繰りに影響</li>
                  <li><strong className="text-foreground">知的財産権</strong>: 成果物の帰属を明確にする</li>
                  <li><strong className="text-foreground">競業避止</strong>: 過度な制限はフリーランスの生計に影響</li>
                  <li><strong className="text-foreground">自動更新</strong>: 解約通知期間を見落とすと自動延長</li>
                  <li><strong className="text-foreground">秘密保持期間</strong>: 10年超は過度に長い</li>
                  <li><strong className="text-foreground">解除権の非対称性</strong>: 甲のみが解除できる条項は不利</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">よくある質問（FAQ）</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm space-y-4 pb-2">
                  <div>
                    <p className="font-medium text-foreground">Q: 法的助言として使えますか？</p>
                    <p className="text-muted-foreground mt-1">
                      A: いいえ。本ツールはAIによる参考分析であり、法的助言ではありません。重要な契約については必ず弁護士にご相談ください。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Q: 契約書のデータはサーバーに保存されますか？</p>
                    <p className="text-muted-foreground mt-1">
                      A: いいえ。分析のためにAI（Claude）に一時的に送信されますが、分析後にデータは破棄されます。サーバーへの永続的な保存は行いません。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Q: どのような契約書に対応していますか？</p>
                    <p className="text-muted-foreground mt-1">
                      A: 業務委託、NDA、売買、賃貸借、雇用、ライセンスなど、日本法に基づく一般的な契約書に対応しています。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Q: 英語の契約書も分析できますか？</p>
                    <p className="text-muted-foreground mt-1">A: 現在は日本語の契約書のみ対応しています。</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}
