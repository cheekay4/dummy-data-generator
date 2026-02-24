import type { Metadata } from 'next';
import { KeigoWriter } from '@/components/keigo/keigo-writer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: '敬語メールライター | カジュアル文章をビジネス敬語メールに変換',
  description:
    '箇条書きやカジュアルな文章を入力するだけで、相手やシーンに合った敬語ビジネスメールを自動生成。お礼・お詫び・依頼・催促など全14シーン対応。',
  openGraph: {
    title: '敬語メールライター',
    description: 'カジュアルな文章をビジネス敬語メールに瞬時変換',
    type: 'website',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '敬語メールライター',
    description:
      '箇条書きやカジュアルな文章を入力するだけで、相手やシーンに合った敬語ビジネスメールを自動生成します。',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            敬語メールライター
          </h1>
          <p className="text-muted-foreground">
            カジュアルな文章をビジネス敬語メールに瞬時変換
          </p>
        </div>

        {/* Main tool */}
        <KeigoWriter />

        {/* SEO content */}
        <div className="space-y-4 mt-12">
          <Accordion type="multiple" className="border rounded-xl divide-y">
            <AccordionItem value="basics" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">
                敬語メールの基本
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground pb-2">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">尊敬語・謙譲語・丁寧語の違い</h3>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li><strong className="text-foreground">尊敬語</strong>：相手の行為を高める表現。「いらっしゃる」「おっしゃる」「ご覧になる」</li>
                      <li><strong className="text-foreground">謙譲語</strong>：自分の行為を低める表現。「参る」「申す」「いただく」「お送りする」</li>
                      <li><strong className="text-foreground">丁寧語</strong>：表現を丁寧にする言葉。「です」「ます」「ございます」</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">ビジネスメールの基本構成</h3>
                    <ol className="space-y-1 ml-4 list-decimal">
                      <li>宛名（○○株式会社 △△様）</li>
                      <li>挨拶文（お世話になっております）</li>
                      <li>本文（要件を明確に）</li>
                      <li>結び（よろしくお願いいたします）</li>
                      <li>署名（所属・氏名・連絡先）</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">よくある敬語の間違い</h3>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li>「おっしゃられる」→「おっしゃる」（二重敬語）</li>
                      <li>「〜させていただきます」の乱用→許可が必要でない場面では「〜いたします」</li>
                      <li>「ご苦労様です」を目上に使う→「お疲れ様です」</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="examples" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">
                シーン別メール例
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm pb-2">
                  <div>
                    <p className="font-medium text-foreground">日程調整</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      「ご都合のよろしい日時をお知らせいただけますでしょうか」
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">お詫び</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      「ご迷惑をおかけし、誠に申し訳ございません」
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">催促</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      「ご多忙のところ恐縮ですが、ご確認いただけますと幸いです」
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">依頼</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      「お忙しいところ誠に恐れ入りますが、ご対応いただけますと幸いです」
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq" className="px-4">
              <AccordionTrigger className="text-sm font-semibold">
                よくある質問（FAQ）
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm pb-2">
                  <div>
                    <p className="font-medium text-foreground">
                      Q: 入力した文章はサーバーに保存されますか？
                    </p>
                    <p className="text-muted-foreground mt-1">
                      A: いいえ。AIによる変換処理のみ行い、入力内容・生成結果ともにサーバーに保存しません。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Q: 生成された敬語は正確ですか？
                    </p>
                    <p className="text-muted-foreground mt-1">
                      A: AIによる生成のため、まれに不自然な表現が含まれる可能性があります。重要なメールは送信前にご自身で確認してください。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Q: 英語のメールも書けますか？</p>
                    <p className="text-muted-foreground mt-1">
                      A: 現在は日本語の敬語メールのみ対応しています。
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Q: 無料で何回使えますか？</p>
                    <p className="text-muted-foreground mt-1">
                      A: 無料プランでは1日3回まで利用できます。Proプラン（月額290円）に登録すると無制限でご利用いただけます。
                    </p>
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
