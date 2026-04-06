import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { EtaxGuide } from "@/components/tools/etax-guide";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "e-Tax入力ガイド | 計算結果をまとめてe-Taxに転記",
  description:
    "各ツールで計算した結果を一覧表示。e-Tax（確定申告書等作成コーナー）のどの画面にどの数字を入力するかをステップごとにガイドします。",
  keywords: "e-Tax 入力方法, 確定申告 e-Tax やり方, 確定申告書 書き方, e-Tax 使い方",
  openGraph: {
    title: "e-Tax入力ガイド | 計算結果をまとめてe-Taxに転記",
    description:
      "各ツールで計算した結果を一覧表示。e-Taxのどの画面にどの数字を入力するかをステップごとにガイドします。",
  },
  alternates: { canonical: '/kakutei/etax-guide' },
};

const breadcrumbs = [
  { label: "ホーム", href: "/" },
  { label: "確定申告ツール", href: "/kakutei" },
  { label: "e-Tax入力ガイド" },
];

const faqs = [
  {
    question: "e-Taxとこのツールの計算結果が違います",
    answer:
      "端数処理方法の違いにより、数百円〜数千円の差異が生じることがあります。e-Taxの計算結果が正式な税額ですので、そちらに従ってください。このツールの結果は事前の目安としてご利用ください。",
  },
  {
    question: "e-Taxはいつまで使えますか？",
    answer:
      "確定申告期間中（2月16日〜3月15日）は24時間利用可能です。期間外でも、メンテナンス時間を除き利用できます。還付申告は1月から提出可能です。",
  },
  {
    question: "スマートフォンからe-Taxで申告できますか？",
    answer:
      "はい、マイナポータルアプリとマイナンバーカードがあれば、スマートフォンからも確定申告ができます。",
  },
  {
    question: "途中で保存して後日再開できますか？",
    answer:
      "はい、e-Taxの確定申告書等作成コーナーでは、入力データを保存してダウンロードできます。後日、そのファイルを読み込んで続きから作業できます。",
  },
];

export default function EtaxGuidePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "e-Tax入力ガイド",
            url: "https://tools24.jp/kakutei/etax-guide",
            description:
              "各ツールで計算した結果を一覧表示。e-Tax（確定申告書等作成コーナー）のどの画面にどの数字を入力するかをステップごとにガイドします。",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb items={breadcrumbs} />
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">e-Tax入力ガイド</h1>
        <p className="mt-2 text-muted-foreground">
          各ツールの計算結果をまとめて確認し、e-Taxへの入力をステップごとにガイドします。
        </p>
      </div>
      <DisclaimerBanner />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <EtaxGuide />

          {/* 使い方セクション */}
          <section className="mt-8 prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">e-Tax入力ガイドの使い方</h2>
            <p className="text-muted-foreground leading-relaxed">
              このツールは当サイトの各計算ツール（所得税・医療費控除・ふるさと納税・生命保険料控除・住宅ローン控除）で計算した結果をまとめて表示し、e-Taxのどの画面にどの数字を入力すればよいかをステップごとにガイドします。
            </p>
            <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
              <li><strong>各ツールで事前に計算</strong> — 所得税シミュレーター、医療費控除計算ツールなど、該当するツールで計算を済ませておきます。</li>
              <li><strong>計算結果を一覧で確認</strong> — このガイドに各ツールの計算結果がまとめて表示されるので、数値を確認します。</li>
              <li><strong>e-Taxの画面に転記</strong> — ガイドに沿って、e-Tax（確定申告書等作成コーナー）の該当する入力欄に数値を転記していきます。</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-3">
              ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
            </p>
          </section>

          {/* 解説セクション */}
          <section className="mt-8 prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold">e-Tax（電子申告）とは</h2>
            <p className="text-muted-foreground leading-relaxed">
              e-Tax（イータックス）は、国税庁が提供する確定申告のオンラインシステムです。
              自宅のパソコンやスマートフォンから確定申告書を作成・提出でき、税務署に行く必要がありません。
              還付がある場合は書面提出より約2〜3週間早く処理されるのもメリットです。
              利用にはマイナンバーカードとICカードリーダー（またはマイナポータル対応スマートフォン）が必要です。
            </p>

            <h3 className="text-xl font-semibold mt-6">e-Taxの申告手順</h3>
            <p className="text-muted-foreground leading-relaxed">
              まず国税庁の「確定申告書等作成コーナー」にアクセスし、申告方法として「e-Taxで提出（マイナンバーカード方式）」を選びます。
              マイナポータルと連携すると、給与情報・保険料控除・医療費・ふるさと納税の情報が自動で取り込まれます。
              取り込めない項目は手入力し、当サイトの各ツールで計算した結果を参照しながら入力すると効率的です。
              すべての入力が完了したら、申告データを送信して完了です。
            </p>

            <h3 className="text-xl font-semibold mt-6">e-Taxの利用可能期間</h3>
            <p className="text-muted-foreground leading-relaxed">
              確定申告期間中（2月16日〜3月15日）は原則24時間利用可能です。
              還付申告の場合は1月上旬から提出できます。
              期間外でもメンテナンス時間を除き利用可能ですが、申告書の提出は受付期間に限られます。
              e-Taxの入力は途中で保存してダウンロードでき、後日そのファイルを読み込んで続きから作業できます。
            </p>
          </section>

          {/* e-Taxのメリット */}
          <section className="mt-8 prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">e-Taxを使うメリット</h2>
            <p className="text-muted-foreground leading-relaxed">
              e-Taxでの電子申告には、紙での申告にはない多くのメリットがあります。特に還付申告の方にとっては大きな利点があります。
            </p>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-3">
              <li><strong>還付金の処理が早い</strong> — 書面提出では還付まで1ヶ月〜1ヶ月半かかりますが、e-Taxなら約2〜3週間で処理されます。1月に提出すれば2月中に振り込まれるケースもあります。</li>
              <li><strong>24時間提出可能</strong> — 確定申告期間中は24時間いつでも申告書を送信できます。税務署の窓口に並ぶ必要がありません。</li>
              <li><strong>添付書類の省略</strong> — 源泉徴収票、生命保険料控除証明書、ふるさと納税の寄附金受領証明書などの添付が省略できます（5年間の自宅保管は必要）。</li>
              <li><strong>自動計算機能</strong> — 所得税額や控除額が自動で計算されるため、計算ミスを防げます。</li>
              <li><strong>過去のデータを引き継ぎ</strong> — 前年のデータを読み込んで、変更箇所のみ修正すれば翌年の申告書が作成できます。</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">マイナンバーカード方式 vs ID・パスワード方式</h2>
            <p className="text-muted-foreground leading-relaxed">
              e-Taxの利用方法には2つの方式があります。それぞれの特徴を理解して、自分に合った方式を選びましょう。
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-semibold">比較項目</th>
                    <th className="text-left py-2 pr-4 font-semibold">マイナンバーカード方式</th>
                    <th className="text-left py-2 font-semibold">ID・パスワード方式</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b"><td className="py-2 pr-4">必要なもの</td><td className="py-2 pr-4">マイナンバーカード + スマホ or ICカードリーダー</td><td className="py-2">税務署で発行したID・パスワード</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4">事前手続き</td><td className="py-2 pr-4">マイナンバーカードの取得（約1ヶ月）</td><td className="py-2">税務署の窓口で本人確認が必要</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4">マイナポータル連携</td><td className="py-2 pr-4">対応（データ自動取り込み可能）</td><td className="py-2">非対応</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4">スマホ申告</td><td className="py-2 pr-4">対応</td><td className="py-2">対応</td></tr>
                  <tr><td className="py-2 pr-4">推奨度</td><td className="py-2 pr-4">国税庁推奨（今後の主流）</td><td className="py-2">暫定的な措置</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-3">
              マイナンバーカード方式はマイナポータルとの連携により、給与情報・保険料控除・医療費・ふるさと納税の情報を自動で取り込めるため、入力の手間が大幅に省けます。
              ID・パスワード方式はマイナンバーカードがなくても利用できますが、国税庁は暫定的な措置と位置付けており、将来的にはマイナンバーカード方式への移行が推奨されています。
            </p>

            <h2 className="text-xl font-bold text-foreground mt-10 mb-4">e-Taxのよくあるトラブルと対処法</h2>
            <p className="text-muted-foreground leading-relaxed">
              e-Taxの利用中に発生しやすいトラブルと、その解決方法をまとめました。
            </p>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-3">
              <li><strong>マイナンバーカードが読み取れない</strong> — スマホの場合はNFC機能がONになっているか確認してください。カードをスマホの中央部に密着させ、読み取り完了まで動かさないのがコツです。ICカードリーダーの場合はドライバの更新が必要な場合があります。</li>
              <li><strong>暗証番号を忘れた</strong> — 利用者証明用電子証明書の暗証番号（4桁）は3回連続で間違えるとロックされます。ロックされた場合は市区町村の窓口で解除手続きが必要です。署名用電子証明書の暗証番号（6〜16桁）も同様です。</li>
              <li><strong>送信エラーが出る</strong> — ブラウザのポップアップブロックを解除してください。また、推奨環境（Chrome、Edge、Safari）以外のブラウザでは正常に動作しない場合があります。</li>
              <li><strong>入力データが消えた</strong> — 作成途中のデータは必ず「保存」ボタンで保存してください。ブラウザを閉じると入力内容が失われます。保存したデータ（.data形式）は、後日「作成再開」から読み込めます。</li>
              <li><strong>税額の計算結果が合わない</strong> — e-Taxの計算結果と手計算やツールの結果が異なる場合、端数処理の違いが原因です。e-Taxの計算結果が正式な税額ですので、そちらに従ってください。</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
            </p>
          </section>

          <AffiliateSuggestion show={true} variant="detailed" />
          <FAQSection faqs={faqs} />
          <AdPlaceholder position="content" className="mt-8" />
        </div>
        <div className="lg:col-span-1">
          <AdPlaceholder position="sidebar" />
        </div>
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/etax-guide']} />
    </div>
  );
}
