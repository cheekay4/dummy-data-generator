import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { ChecklistTool } from "@/components/tools/checklist-tool";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "確定申告 必要書類チェックリスト | あなたに必要な書類がわかる",
  description:
    "確定申告に必要な書類をチェックリスト形式で確認。給与所得、医療費控除、ふるさと納税、副業など、あなたの状況に合わせて必要書類を自動表示。",
  keywords:
    "確定申告 必要書類, 確定申告 持ち物, 確定申告 チェックリスト, 確定申告 準備",
  alternates: { canonical: '/kakutei/checklist' },
};

const faqs = [
  {
    question: "e-Taxと紙の提出、どちらがいいですか？",
    answer:
      "e-Taxがおすすめです。24時間提出可能で、還付も早くなります（約3週間→約2〜3週間）。マイナンバーカードがあればスマートフォンからも申告できます。",
  },
  {
    question: "源泉徴収票を紛失しました",
    answer:
      "勤務先に再発行を依頼してください。退職した会社でも再発行義務があります。",
  },
  {
    question: "医療費の領収書は原本が必要ですか？",
    answer:
      "e-Taxの場合、領収書の提出は不要です（5年間の自宅保管が必要）。紙で提出する場合は明細書を作成し、領収書は自宅保管（5年間）となります。",
  },
  {
    question: "ふるさと納税のXMLデータとは？",
    answer:
      "ふるさと納税サイト（さとふる、ふるなび等）からダウンロードできる電子証明書です。e-Taxに一括読み込みでき、紙の証明書を1枚ずつ入力する手間が省けます。",
  },
];

export default function ChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "確定申告 必要書類チェックリスト",
            url: "https://tools24.jp/kakutei/checklist",
            description:
              "確定申告に必要な書類をチェックリスト形式で確認。給与所得、医療費控除、ふるさと納税、副業など、あなたの状況に合わせて必要書類を自動表示。",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
            inLanguage: "ja",
          }),
        }}
      />
      <DisclaimerBanner />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "確定申告ツール", href: "/kakutei" },
          { label: "必要書類チェックリスト" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          確定申告 必要書類チェックリスト
        </h1>
        <p className="mt-2 text-muted-foreground">
          あなたの状況を選択すると、必要な書類が自動で表示されます。チェックを入れて準備を進めましょう。
        </p>
      </div>

      <ChecklistTool />

      {/* 書類が揃ったら */}
      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">書類が揃ったら</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">e-Taxで申告する方法（おすすめ）</p>
              <p className="text-muted-foreground">
                国税庁の「確定申告書等作成コーナー」から手続きできます。マイナンバーカードがあればスマートフォンからも申告可能です。
              </p>
              <a
                href="https://www.e-tax.nta.go.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
              >
                国税庁 確定申告書等作成コーナー
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="font-medium mb-1">税務署に紙で提出する方法</p>
              <p className="text-muted-foreground">
                国税庁のサイトから申告書を印刷・記入し、お住まいの税務署に持参または郵送します。
              </p>
            </div>
            <div className="p-3 rounded-md bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <p className="font-medium text-orange-700 dark:text-orange-300">
                提出期限: 2026年3月16日（月）
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                還付申告は期限後も5年間申告できます
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">必要書類チェックリストの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールはあなたの状況（会社員・個人事業主・副業ありなど）に合わせて、確定申告に必要な書類を自動で一覧表示します。書類の準備漏れを防ぎ、スムーズな申告準備に役立ちます。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>あなたの状況を選択</strong> — 給与所得、副業所得、医療費控除、ふるさと納税、住宅ローン控除など、該当する項目にチェックを入れます。</li>
          <li><strong>必要書類を確認</strong> — 選択した状況に応じて、確定申告に必要な書類が一覧で表示されます。</li>
          <li><strong>チェックを入れて準備を進める</strong> — 書類が手元に揃ったらチェックを入れていきます。全てにチェックが入れば準備完了です。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">確定申告の必要書類と入手先一覧</h2>
        <p className="text-muted-foreground leading-relaxed">
          確定申告で提出が必要な書類と、その入手先をまとめました。書類によっては届くまでに時間がかかるものもあるため、早めに準備を始めましょう。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">必要書類</th>
                <th className="text-left py-2 pr-4 font-semibold">入手先</th>
                <th className="text-left py-2 font-semibold">届く時期の目安</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-2 pr-4">源泉徴収票</td><td className="py-2 pr-4">勤務先（退職した場合も請求可能）</td><td className="py-2">12月〜翌年1月</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">医療費の領収書・明細書</td><td className="py-2 pr-4">病院・薬局（医療費通知は健康保険組合）</td><td className="py-2">通院時（通知は2月頃）</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">ふるさと納税 寄附金受領証明書</td><td className="py-2 pr-4">寄附先の自治体（またはふるさと納税サイトのXML）</td><td className="py-2">寄附後1〜2ヶ月</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">生命保険料控除証明書</td><td className="py-2 pr-4">保険会社（郵送またはマイページ）</td><td className="py-2">10月〜11月</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">住宅ローン年末残高等証明書</td><td className="py-2 pr-4">金融機関（銀行・住宅金融支援機構等）</td><td className="py-2">10月〜11月</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">登記事項証明書</td><td className="py-2 pr-4">法務局（窓口またはオンライン申請）</td><td className="py-2">申請から数日</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">支払調書</td><td className="py-2 pr-4">報酬の支払元（届かない場合は振込記録で代替）</td><td className="py-2">翌年1月</td></tr>
              <tr><td className="py-2 pr-4">マイナンバーカード</td><td className="py-2 pr-4">市区町村役場（申請から約1ヶ月）</td><td className="py-2">申請後約1ヶ月</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">確定申告書類の保管期間</h2>
        <p className="text-muted-foreground leading-relaxed">
          確定申告に関連する書類には法定の保管義務があります。申告が終わったからといってすぐに捨てないよう注意してください。
          税務調査は過去に遡って行われる可能性があるため、以下の期間は書類を保管しておく必要があります。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">書類の種類</th>
                <th className="text-left py-2 pr-4 font-semibold">保管期間</th>
                <th className="text-left py-2 font-semibold">備考</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-2 pr-4">確定申告書の控え</td><td className="py-2 pr-4">7年間</td><td className="py-2">住宅ローン審査等でも必要になる場合あり</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">帳簿（青色申告の場合）</td><td className="py-2 pr-4">7年間</td><td className="py-2">仕訳帳・総勘定元帳・現金出納帳など</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">領収書・請求書</td><td className="py-2 pr-4">7年間</td><td className="py-2">経費の証拠書類として</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">医療費の領収書</td><td className="py-2 pr-4">5年間</td><td className="py-2">税務署から提示を求められる場合あり</td></tr>
              <tr><td className="py-2 pr-4">源泉徴収票</td><td className="py-2 pr-4">5年間</td><td className="py-2">確定申告書の控えと一緒に保管</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          青色申告の方は帳簿書類を<strong>7年間</strong>保管する義務があります。白色申告の方も、収入金額や必要経費がわかる書類は5年間の保管が必要です。
          電子帳簿保存法に対応した形式で電子データとして保管することも可能ですが、要件を満たす必要があるため事前に確認してください。
        </p>
      </section>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/checklist']} />
    </>
  );
}
