import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { FurusatoTracker } from "@/components/tools/furusato-tracker";

export const metadata: Metadata = {
  title: "ふるさと納税 寄附管理トラッカー | 寄附先と金額を一覧管理",
  description:
    "ふるさと納税の寄附先、金額、ワンストップ特例の申請状況を一覧管理。控除上限額の残りもリアルタイムで確認。確定申告時の入力もスムーズに。",
  keywords:
    "ふるさと納税 管理, ふるさと納税 記録, ふるさと納税 一覧, ふるさと納税 ワンストップ",
  alternates: { canonical: '/kakutei/furusato-tracker' },
};

const faqs = [
  {
    question: "ワンストップ特例の申請期限はいつですか？",
    answer:
      "寄附した翌年の1月10日必着です。期限を過ぎた場合は確定申告で控除を受けてください。",
  },
  {
    question: "6自治体以上に寄附したらどうなりますか？",
    answer:
      "ワンストップ特例は使えません。全ての寄附分をまとめて確定申告する必要があります（ワンストップ申請済みの分も含む）。",
  },
  {
    question: "寄附金受領証明書が届きません",
    answer:
      "寄附先の自治体に問い合わせてください。通常、寄附後1〜2ヶ月で届きます。確定申告に間に合わない場合、ふるさと納税サイトのXMLデータで代替できる場合があります。",
  },
];

export default function FurusatoTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ふるさと納税管理ツール",
            url: "https://tools24.jp/kakutei/furusato-tracker",
            description:
              "ふるさと納税の寄附先、金額、ワンストップ特例の申請状況を一覧管理。控除上限額の残りもリアルタイムで確認。確定申告時の入力もスムーズに。",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "確定申告ツール", href: "/kakutei" },
          { label: "ふるさと納税 寄附管理トラッカー" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          ふるさと納税 寄附管理トラッカー
        </h1>
        <p className="mt-2 text-muted-foreground">
          寄附先と金額を記録して、確定申告の準備をスムーズに
        </p>
      </div>

      <FurusatoTracker />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">ふるさと納税管理ツールの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールはふるさと納税の寄附状況を一元管理できるトラッカーです。寄附先・金額・ワンストップ特例の申請状況を記録し、控除上限までの残額をリアルタイムで把握できます。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>控除上限額を設定</strong> — ふるさと納税の控除上限額を入力します。上限額がわからない場合は、当サイトの「控除上限シミュレーター」で計算できます。</li>
          <li><strong>寄附を記録</strong> — 寄附先の自治体名、寄附金額、寄附日、ワンストップ特例の申請状況を入力して登録します。</li>
          <li><strong>残額と申請状況を確認</strong> — 上限額までの残り金額や、ワンストップ特例の未申請分が一覧で確認できます。確定申告時の入力にもそのまま使えます。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ データはブラウザのローカルストレージに保存されます。ブラウザのデータを消去すると記録も削除されますのでご注意ください。
        </p>
      </section>

      {/* 解説セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">ふるさと納税の寄附管理が重要な理由</h2>
        <p className="text-muted-foreground leading-relaxed">
          ふるさと納税は1年間で複数の自治体に寄附できるため、年末になると「どこにいくら寄附したか」「ワンストップ特例の申請は完了しているか」を見失いがちです。
          控除上限を超えて寄附してしまうと超過分が自己負担になり、逆にまだ余裕があるのに寄附しないのはもったいないことになります。
          このトラッカーで寄附状況を一元管理することで、確定申告の準備もスムーズに進められます。
        </p>

        <h3 className="text-xl font-semibold mt-6">ワンストップ特例の申請管理</h3>
        <p className="text-muted-foreground leading-relaxed">
          ワンストップ特例を利用する場合、寄附ごとに「特例申請書」と「マイナンバー確認書類」を自治体へ送付する必要があります。
          申請期限は寄附した翌年の1月10日必着で、1日でも遅れると無効です。
          また、年間の寄附先が6自治体以上になった場合、全てのワンストップ申請が無効になり確定申告が必要になります。
          このトラッカーで申請状況を記録しておくと、未申請の寄附を見逃さずに済みます。
        </p>

        <h3 className="text-xl font-semibold mt-6">確定申告での利用方法</h3>
        <p className="text-muted-foreground leading-relaxed">
          確定申告でふるさと納税の控除を受ける場合は、全ての寄附先と金額を「寄附金控除」の欄に記入します。
          各自治体から届く「寄附金受領証明書」が必要ですが、ふるさと納税サイト（さとふる、ふるなび等）が発行するXMLデータを使えば、
          e-Taxで一括取り込みも可能です。
          このトラッカーで記録した情報を確認しながら申告書を作成すると、入力漏れを防げます。
        </p>
      </section>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/furusato-tracker']} />
    </>
  );
}
