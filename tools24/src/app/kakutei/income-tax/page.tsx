import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { FAQSection } from "@/components/common/faq-section";
import { IncomeTaxCalculator } from "@/components/tools/income-tax-calculator";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { TAX_BRACKETS } from "@/lib/tax/income-tax";

export const metadata: Metadata = {
  title: "所得税シミュレーター | 給与・副業の所得税額をかんたん計算",
  description:
    "年収と控除額を入力するだけで所得税額を概算計算。給与所得控除、基礎控除、社会保険料控除に対応。確定申告の事前確認に。",
  keywords: "所得税 計算, 所得税 シミュレーション, 確定申告 所得税, 給与 所得税",
  alternates: { canonical: '/kakutei/income-tax' },
};

const faqs = [
  {
    question: "給与所得控除とは何ですか？",
    answer:
      "給与収入から自動的に差し引かれる控除で、会社員の必要経費に相当します。収入額に応じて金額が段階的に決まり、例えば年収400万円なら124万円、年収600万円なら164万円が控除されます。特定支出（通勤費・転居費・研修費など）が給与所得控除額の半分を超える場合は、確定申告で「特定支出控除」として追加の控除を受けることも可能です。",
  },
  {
    question: "副業の収入も入力する必要がありますか？",
    answer:
      "副業で年間20万円を超える所得（収入から経費を差し引いた金額）がある場合、確定申告が必要です。20万円以下でも住民税の申告は別途必要です。なお、副業が「事業所得」か「雑所得」かによって青色申告特別控除の適用可否が変わるため、継続的に副業を行っている方は開業届の提出も検討しましょう。",
  },
  {
    question: "復興特別所得税とは何ですか？",
    answer:
      "東日本大震災の復興財源を確保するため、2013年から2037年まで所得税額の2.1%が追加で課税される特別税です。例えば所得税が10万円の場合、復興特別所得税は2,100円となり、合計102,100円を納付します。確定申告書では所得税と合わせて自動計算されます。",
  },
  {
    question: "所得税と住民税の違いは何ですか？",
    answer:
      "所得税は国に納める国税で、所得に応じて5%〜45%の累進税率が適用されます。一方、住民税は都道府県・市区町村に納める地方税で、所得割（一律10%）と均等割（年額約5,000円）で構成されます。所得税は年末調整や確定申告で精算されますが、住民税は前年の所得に基づき翌年6月から課税される点も異なります。",
  },
  {
    question: "年末調整と確定申告はどう違いますか？",
    answer:
      "年末調整は会社が従業員に代わって所得税の精算を行う手続きで、12月の給与支払い時に過不足を調整します。確定申告は納税者自身が税務署に申告する手続きです。会社員でも、副業所得が20万円超・年収2,000万円超・医療費控除やふるさと納税（ワンストップ特例を使わない場合）を受けたい場合は確定申告が必要です。",
  },
  {
    question: "ふるさと納税は所得税の節税になりますか？",
    answer:
      "ふるさと納税は、寄附金額から2,000円を引いた金額が所得税と住民税から控除される制度です。所得税からは「（寄附金額−2,000円）×所得税率」が還付され、残りは翌年の住民税から減額されます。ただし控除上限額は年収や家族構成により異なるため、事前にシミュレーションすることが重要です。",
  },
  {
    question: "青色申告と白色申告のどちらを選ぶべきですか？",
    answer:
      "個人事業主やフリーランスの方には青色申告がおすすめです。最大65万円の青色申告特別控除に加え、赤字の3年間繰越、家族への給与の経費計上（専従者給与）など多くのメリットがあります。ただし複式簿記による帳簿付けが必要で、事前に「青色申告承認申請書」の提出も必要です。白色申告は手続きが簡単ですが、控除額は最大10万円に限られます。",
  },
  {
    question: "このシミュレーターの計算結果は正確ですか？",
    answer:
      "本ツールは2024年分（令和6年分）の税率・控除額に基づいた概算計算です。実際の税額は、適用される全ての控除や税額控除（住宅ローン控除など）によって異なります。正確な税額は国税庁の「確定申告書等作成コーナー」や税理士にご確認ください。",
  },
];

export default function IncomeTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "所得税シミュレーター",
            url: "https://tools24.jp/kakutei/income-tax",
            description:
              "年収と控除額を入力するだけで所得税額を概算計算。給与所得控除、基礎控除、社会保険料控除に対応。確定申告の事前確認に。",
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
          { label: "所得税シミュレーター" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        所得税シミュレーター
      </h1>

      <IncomeTaxCalculator />

      {/* Tax Rate Reference Table */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">所得税の税率表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">課税所得金額</th>
                <th className="text-right py-3 px-4 font-medium">税率</th>
                <th className="text-right py-3 px-4 font-medium">控除額</th>
              </tr>
            </thead>
            <tbody>
              {TAX_BRACKETS.map((bracket, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 px-4">{bracket.label}</td>
                  <td className="text-right py-3 px-4">{(bracket.rate * 100).toFixed(0)}%</td>
                  <td className="text-right py-3 px-4">
                    {bracket.deduction.toLocaleString()}円
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 使い方 */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">所得税シミュレーターの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは3ステップで所得税の概算額を計算できます。確定申告前の事前確認や、年収アップ・転職時の手取り額シミュレーションにご活用ください。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>年収（総支給額）を入力</strong> — 源泉徴収票の「支払金額」欄の数字を入力します。ボーナスや残業代も含めた年間の総支給額です。</li>
          <li><strong>各種控除額を入力</strong> — 社会保険料控除（源泉徴収票に記載）、生命保険料控除、扶養控除など、該当する控除額を入力します。基礎控除（48万円）と給与所得控除は自動計算されます。</li>
          <li><strong>計算結果を確認</strong> — 課税所得金額、所得税額、復興特別所得税を含む年間の税額が表示されます。実効税率や手取り額の目安も確認できます。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">給与所得控除の速算表</h2>
        <p className="text-muted-foreground leading-relaxed">
          給与所得控除は、会社員やパート・アルバイトの方が給与収入から差し引ける控除で、自営業者の必要経費に相当するものです。
          収入金額に応じて以下の速算表で求められます。2020年（令和2年）分以降の金額です。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">給与等の収入金額</th>
                <th className="text-left py-2 font-semibold">給与所得控除額</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-2 pr-4">162.5万円以下</td><td className="py-2">55万円</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">162.5万円超 〜 180万円以下</td><td className="py-2">収入 × 40% − 10万円</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">180万円超 〜 360万円以下</td><td className="py-2">収入 × 30% + 8万円</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">360万円超 〜 660万円以下</td><td className="py-2">収入 × 20% + 44万円</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">660万円超 〜 850万円以下</td><td className="py-2">収入 × 10% + 110万円</td></tr>
              <tr><td className="py-2 pr-4">850万円超</td><td className="py-2">195万円（上限）</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ※ 所得金額調整控除の対象者（年収850万円超かつ23歳未満の扶養親族がいる方等）は別途加算があります。
        </p>
      </section>

      {/* Explanation */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">所得税の計算方法</h2>
        <p className="text-muted-foreground leading-relaxed">
          所得税は、1年間の全ての収入から必要経費や各種控除を差し引いた「課税所得金額」に対して税率を適用して計算します。
          給与収入の場合は、収入金額から給与所得控除を差し引いて給与所得を算出し、
          さらに基礎控除・社会保険料控除・生命保険料控除などの所得控除を差し引きます。
          課税所得金額に応じた累進税率（5%〜45%）を適用し、
          算出された所得税額に対してさらに復興特別所得税（2.1%）が加算されます。
        </p>

        <h3 className="text-xl font-semibold mt-6">累進課税制度とは</h3>
        <p className="text-muted-foreground leading-relaxed">
          日本の所得税は「超過累進税率」を採用しており、所得が高くなるほど高い税率が適用されます。
          ただし、所得全体に高い税率がかかるわけではなく、各税率区分を超えた部分にのみ高い税率が適用されます。
          たとえば課税所得が500万円の場合、195万円までは5%、195万円超〜330万円の部分は10%、330万円超〜500万円の部分は20%がそれぞれ適用され、
          合計572,500円が所得税額となります。上の税率表の「控除額」は、この段階計算を簡単にするための速算控除額です。
        </p>

        <h3 className="text-xl font-semibold mt-6">主な所得控除の種類</h3>
        <p className="text-muted-foreground leading-relaxed">
          所得控除には多くの種類があります。全ての人に適用される「基礎控除」（合計所得2,400万円以下で48万円）のほか、
          会社員の「給与所得控除」、健康保険・年金の「社会保険料控除」（支払った全額）、生命保険の「生命保険料控除」（最大12万円）、
          配偶者の所得が少ない場合の「配偶者控除」（最大38万円）、16歳以上の扶養親族がいる場合の「扶養控除」（38〜63万円）、
          障害がある場合の「障害者控除」、寡婦やひとり親の方の控除などがあります。
          これらの控除を正確に適用することで、納めすぎた税金の還付を受けられます。
        </p>
      </section>

      {/* 所得税の仕組み — 詳細解説 */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">所得税の仕組みを詳しく理解する</h2>

        <h3 className="text-xl font-semibold mt-6">超過累進税率の正しい理解</h3>
        <p className="text-muted-foreground leading-relaxed">
          日本の所得税で最も誤解されやすいのが累進課税の仕組みです。「年収が上がると税率が上がって手取りが減る」と思われがちですが、
          これは正確ではありません。超過累進税率では、課税所得の全体に高い税率がかかるのではなく、
          各区分を超えた部分にのみ、その区分の税率が適用されます。
          つまり、昇給によって税率区分が上がっても、増えた分の一部に高い税率がかかるだけで、手取り額が減ることは基本的にありません。
        </p>

        <h3 className="text-xl font-semibold mt-6">所得税の計算例（年収500万円・会社員の場合）</h3>
        <div className="bg-muted/30 rounded-lg p-4 my-4 text-sm">
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>① 給与所得の計算：</strong>年収500万円 − 給与所得控除144万円 = 給与所得 356万円
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>② 課税所得の計算：</strong>給与所得356万円 − 基礎控除48万円 − 社会保険料控除約72万円 = 課税所得 約236万円
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>③ 所得税額の計算：</strong>236万円 × 10% − 97,500円（速算控除額） = 138,500円
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>④ 復興特別所得税を加算：</strong>138,500円 × 1.021 = 約141,400円（年間の所得税額）
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10">よくある計算ミスと注意点</h2>

        <h3 className="text-xl font-semibold mt-6">「年収」と「所得」を混同しない</h3>
        <p className="text-muted-foreground leading-relaxed">
          最も多い間違いは、額面の年収（総支給額）をそのまま課税所得として計算してしまうことです。
          会社員の場合、年収から給与所得控除を引いた金額が「給与所得」であり、さらに各種所得控除を差し引いたものが「課税所得」です。
          年収500万円でも、実際に税率がかかる課税所得は200万円台になることが一般的です。
        </p>

        <h3 className="text-xl font-semibold mt-6">控除の申告漏れに注意</h3>
        <p className="text-muted-foreground leading-relaxed">
          年末調整で申告し忘れた控除は、確定申告（還付申告）で取り戻せます。
          特に見落としやすいのは、年間10万円を超える医療費がある場合の「医療費控除」、
          セルフメディケーション税制（対象医薬品の購入額が年間1.2万円超）、
          災害や盗難にあった場合の「雑損控除」です。
          還付申告は過去5年分まで遡って申告できるため、心当たりがある方は過去の分もチェックしましょう。
        </p>

        <h2 className="text-2xl font-bold mt-10">節税のポイント</h2>

        <h3 className="text-xl font-semibold mt-6">iDeCo（個人型確定拠出年金）の活用</h3>
        <p className="text-muted-foreground leading-relaxed">
          iDeCoの掛金は全額が「小規模企業共済等掛金控除」として所得控除の対象になります。
          会社員の場合、月額1.2万円〜2.3万円（勤務先の企業年金制度による）を拠出でき、
          年間で最大27.6万円の所得控除を受けられます。課税所得が330万円超の方なら、
          掛金の30%以上（所得税20%＋住民税10%）が節税効果として得られる、非常に有効な制度です。
        </p>

        <h3 className="text-xl font-semibold mt-6">NISA・ふるさと納税との組み合わせ</h3>
        <p className="text-muted-foreground leading-relaxed">
          新NISAでは投資の運用益が非課税になるため、所得税の負担を間接的に軽減できます。
          また、ふるさと納税は寄附金控除として所得税・住民税の軽減に直結します。
          iDeCo・NISA・ふるさと納税を組み合わせることで、合法的に税負担を最適化できます。
          ただし、各制度の控除上限額は年収や家族構成によって異なるため、本ツールなどで事前にシミュレーションすることをおすすめします。
        </p>

        <h2 className="text-2xl font-bold mt-10">確定申告が必要なケース</h2>
        <p className="text-muted-foreground leading-relaxed">
          以下に該当する方は確定申告が必要です。会社員でも年末調整だけでは完結しないケースがあるため注意しましょう。
        </p>
        <ul className="text-muted-foreground space-y-2 mt-3">
          <li><strong>副業・兼業の所得が20万円を超える方</strong> — 給与所得以外の所得（雑所得・事業所得など）の合計が年間20万円超の場合</li>
          <li><strong>年収が2,000万円を超える方</strong> — 年末調整の対象外となるため、必ず確定申告が必要</li>
          <li><strong>2か所以上から給与を受けている方</strong> — 従たる給与の収入金額と給与所得以外の所得の合計が20万円超の場合</li>
          <li><strong>医療費控除・寄附金控除を受けたい方</strong> — 年末調整では適用できないため、確定申告で申請</li>
          <li><strong>住宅ローン控除を初めて受ける方</strong> — 初年度のみ確定申告が必要（2年目以降は年末調整で可能）</li>
          <li><strong>退職して年末調整を受けていない方</strong> — 年の途中で退職し、再就職していない場合</li>
          <li><strong>株式の譲渡損失を繰り越したい方</strong> — 損益通算・繰越控除の適用には確定申告が必要</li>
        </ul>
      </section>

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Ads */}
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        <AdPlaceholder position="content" />
        <div className="hidden md:block">
          <AdPlaceholder position="sidebar" />
        </div>
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/income-tax']} />
    </>
  );
}
