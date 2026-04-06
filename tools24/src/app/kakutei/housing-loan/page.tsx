import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { HousingLoanCalculator } from "@/components/tools/housing-loan-calculator";

export const metadata: Metadata = {
  title: "住宅ローン控除シミュレーター | 控除額を自動計算",
  description:
    "住宅ローンの年末残高と入居時期を入力するだけで、住宅ローン控除額を自動計算。新築・中古、認定住宅の区分に対応。初年度の確定申告に必要な情報もわかります。",
  keywords:
    "住宅ローン控除 計算, 住宅ローン減税 シミュレーション, 住宅ローン控除 いくら, 住宅ローン控除 確定申告",
  alternates: { canonical: '/kakutei/housing-loan' },
};

const faqs = [
  {
    question: "住宅ローン控除は何年目から確定申告不要ですか？",
    answer:
      "2年目以降は年末調整で控除を受けられます。初年度（1年目）のみ確定申告が必要です。会社員の方は、勤務先から配布される「給与所得者の（特定増改築等）住宅借入金等特別控除申告書」に記入して提出するだけで手続きが完了します。",
  },
  {
    question: "繰り上げ返済をすると控除額はどうなりますか？",
    answer:
      "年末残高が減るため、控除額も減ります。ただし利息の節約効果の方が大きい場合もあるので、総合的に判断してください。なお、繰り上げ返済後の返済期間が10年未満になると控除の適用対象外となるため注意が必要です。",
  },
  {
    question: "夫婦でペアローンの場合は？",
    answer:
      "それぞれのローン残高に対して、それぞれが控除を受けられます。各自の年末残高で計算してください。連帯債務の場合は、持分割合に応じて残高を按分します。",
  },
  {
    question: "2024年以降は省エネ基準が必須ですか？",
    answer:
      "2024年以降に入居する新築住宅は、原則として省エネ基準を満たす住宅のみが控除対象です。ただし、2023年末までに建築確認を受けた住宅は経過措置があり、借入限度額2,000万円・控除期間10年で適用可能です。",
  },
  {
    question: "中古住宅でも住宅ローン控除は使えますか？",
    answer:
      "はい、使えます。1982年（昭和57年）以降に建築された住宅、または耐震基準適合証明書等がある住宅が対象です。中古住宅の控除期間は10年間で、借入限度額は認定住宅等で3,000万円、その他の住宅で2,000万円です。",
  },
  {
    question: "所得税から控除しきれない場合はどうなりますか？",
    answer:
      "所得税から控除しきれなかった分は、翌年度の住民税から控除されます。住民税からの控除上限は、所得税の課税総所得金額の5%（最大97,500円）です。別途の申告は不要で、自動的に適用されます。",
  },
  {
    question: "住宅ローンの借り換えをした場合はどうなりますか？",
    answer:
      "借り換え後のローンが当初のローン残高以下で、返済期間が10年以上であれば引き続き控除を受けられます。ただし控除期間は当初の入居時から計算された残りの年数のままで、借り換えにより延長されることはありません。",
  },
  {
    question: "単身赴任で家族だけが住んでいる場合は？",
    answer:
      "転勤等のやむを得ない事由により本人が居住できない場合でも、生計を一にする配偶者や親族が引き続き居住していれば、住宅ローン控除の適用を受け続けることができます。",
  },
];

export default function HousingLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "住宅ローン控除シミュレーター",
            url: "https://tools24.jp/kakutei/housing-loan",
            description:
              "住宅ローンの年末残高と入居時期を入力するだけで、住宅ローン控除額を自動計算。新築・中古、認定住宅の区分に対応。初年度の確定申告に必要な情報もわかります。",
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
          { label: "住宅ローン控除シミュレーター" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          住宅ローン控除シミュレーター
        </h1>
        <p className="mt-2 text-muted-foreground">
          年末残高と入居時期を入力するだけで、住宅ローン控除額を自動計算します
        </p>
      </div>

      <HousingLoanCalculator />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">住宅ローン控除シミュレーターの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは住宅ローンの年末残高と住宅の種類を選ぶだけで、住宅ローン控除額を計算します。マイホーム購入前の資金計画や、初年度の確定申告準備にご活用ください。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>住宅の種類を選択</strong> — 認定長期優良住宅、ZEH水準省エネ住宅、省エネ基準適合住宅、その他の住宅、中古住宅から該当するものを選びます。</li>
          <li><strong>入居年を選択</strong> — 入居した年（または入居予定年）を選びます。2024年以降は省エネ基準の要件が変わるため、入居年によって控除額が異なります。</li>
          <li><strong>年末ローン残高を入力</strong> — 金融機関から届く「住宅ローン年末残高等証明書」の金額を入力します。控除額は「年末残高 x 0.7%」で自動計算されます。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>
      </section>

      {/* 解説セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">住宅ローン控除（住宅借入金等特別控除）とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          住宅ローン控除（正式名称：住宅借入金等特別控除）は、住宅ローンを利用してマイホームの新築・取得・増改築を行った方が、
          年末時点のローン残高に応じて所得税の税額控除を受けられる制度です。
          税額控除は所得控除と異なり、計算された税額から直接差し引かれるため節税効果が非常に大きいのが特徴です。
          所得税から控除しきれない分は翌年度の住民税からも一部控除されます（上限：課税総所得金額の5%、最大97,500円）。
          マイホーム取得を後押しする国の重要な税制優遇措置として、多くの方が利用しています。
        </p>

        <h2 className="text-2xl font-bold mt-10">控除を受けるための要件</h2>
        <p className="text-muted-foreground leading-relaxed">
          住宅ローン控除を受けるには、以下のすべての要件を満たす必要があります。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1">
          <li><strong>返済期間</strong>：金融機関からの借入金で、返済期間が10年以上であること</li>
          <li><strong>入居時期</strong>：取得の日から6ヶ月以内に入居し、適用を受ける各年の12月31日まで引き続き居住していること</li>
          <li><strong>所得要件</strong>：控除を受ける年の合計所得金額が2,000万円以下であること</li>
          <li><strong>床面積</strong>：登記簿面積が50㎡以上であること（合計所得1,000万円以下の場合は40㎡以上で可）</li>
          <li><strong>居住割合</strong>：床面積の2分の1以上が自己の居住用であること</li>
          <li><strong>省エネ基準</strong>：2024年以降入居の新築住宅は、原則として省エネ基準適合住宅であること</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          中古住宅の場合は、1982年（昭和57年）以降に建築された住宅、または現行の耐震基準に適合していることが証明された住宅が対象となります。
          親族や特別な関係者からの取得は対象外です。
        </p>

        <h2 className="text-2xl font-bold mt-10">控除額の計算方法</h2>
        <p className="text-muted-foreground leading-relaxed">
          住宅ローン控除額は「年末のローン残高 × 控除率（0.7%）」で計算されます。
          ただし、住宅の種類によって対象となるローン残高の上限（借入限度額）が異なります。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1">
          <li><strong>認定長期優良住宅・認定低炭素住宅</strong>：借入限度額 5,000万円（最大控除額 35万円/年）</li>
          <li><strong>ZEH水準省エネ住宅</strong>：借入限度額 4,500万円（最大控除額 31.5万円/年）</li>
          <li><strong>省エネ基準適合住宅</strong>：借入限度額 4,000万円（最大控除額 28万円/年）</li>
          <li><strong>その他の住宅（2023年末までに建築確認）</strong>：借入限度額 2,000万円（最大控除額 14万円/年）</li>
          <li><strong>中古住宅（認定住宅等）</strong>：借入限度額 3,000万円（最大控除額 21万円/年）</li>
          <li><strong>中古住宅（その他）</strong>：借入限度額 2,000万円（最大控除額 14万円/年）</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          控除期間は新築住宅が最大13年間、中古住宅が最大10年間です。
          たとえば認定長期優良住宅で年末残高が5,000万円以上ある場合、13年間の最大控除総額は455万円（35万円 × 13年）に達します。
        </p>

        <h2 className="text-2xl font-bold mt-10">初年度の確定申告 vs 2年目以降の年末調整</h2>
        <p className="text-muted-foreground leading-relaxed">
          住宅ローン控除は、初年度（入居した年）に必ず確定申告を行う必要があります。
          初年度の確定申告で提出が必要な主な書類は以下のとおりです。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1">
          <li>住宅借入金等特別控除額の計算明細書（税務署で入手、またはe-Taxで作成）</li>
          <li>金融機関の住宅ローン年末残高等証明書</li>
          <li>登記事項証明書（法務局で取得）</li>
          <li>売買契約書または工事請負契約書の写し</li>
          <li>本人確認書類（マイナンバーカード等）</li>
          <li>認定住宅の場合：認定通知書の写し、住宅用家屋証明書</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          2年目以降は、会社員の方であれば年末調整で控除を受けられます。
          初年度の確定申告後に税務署から届く「年末調整のための住宅借入金等特別控除証明書」（残りの年数分がまとめて届きます）と、
          金融機関から届く「年末残高等証明書」を勤務先に提出するだけで手続きが完了します。
          個人事業主やフリーランスの方は、毎年の確定申告で控除を申告する必要があります。
        </p>

        <h2 className="text-2xl font-bold mt-10">2024年以降の改正ポイント</h2>
        <p className="text-muted-foreground leading-relaxed">
          2024年（令和6年）以降の入居から、住宅ローン控除の制度が大きく変わりました。主な改正点は以下のとおりです。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1">
          <li><strong>省エネ基準の必須化</strong>：新築住宅は原則として省エネ基準適合住宅以上でなければ控除を受けられなくなりました（2023年末までに建築確認を受けた住宅は経過措置あり）</li>
          <li><strong>借入限度額の段階的引き下げ</strong>：2024年入居では認定住宅4,500万円、ZEH住宅3,500万円、省エネ住宅3,000万円に引き下げ。ただし子育て世帯・若者夫婦世帯は2023年水準を維持</li>
          <li><strong>子育て世帯等の優遇</strong>：19歳未満の子を有する世帯、または夫婦いずれかが40歳未満の世帯は、借入限度額が上乗せされます</li>
          <li><strong>床面積の特例継続</strong>：合計所得金額1,000万円以下の場合、床面積40㎡以上50㎡未満の住宅でも適用可能です</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          これらの改正により、省エネ性能の高い住宅ほど税制面で有利となる仕組みが強化されました。
          住宅の購入を検討する際は、ZEH水準や認定長期優良住宅の基準を満たすかどうかが控除額に大きく影響するため、
          事前にハウスメーカーや工務店に確認しておくことが重要です。
        </p>
      </section>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/housing-loan']} />
    </>
  );
}
