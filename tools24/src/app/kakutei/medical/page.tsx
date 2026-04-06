import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { MedicalCalculator } from "@/components/tools/medical-calculator";

export const metadata: Metadata = {
  title: "医療費控除かんたん計算 | 医療費の控除額を自動計算",
  description:
    "年間の医療費合計を入力するだけで医療費控除額を自動計算。保険金補填額や総所得金額を考慮した正確な控除額がわかります。確定申告の事前確認に。",
  keywords:
    "医療費控除 計算, 医療費控除 いくら戻る, 医療費控除 シミュレーション, 確定申告 医療費",
  alternates: { canonical: '/kakutei/medical' },
};

const faqs = [
  {
    question: "医療費控除はいくらから受けられますか？",
    answer:
      "総所得200万円以上の方は年間医療費が10万円を超えた場合、200万円未満の方は総所得の5%を超えた場合に受けられます。",
  },
  {
    question: "家族の医療費も合算できますか？",
    answer:
      "はい、生計を一にする配偶者や親族の医療費も合算して申告できます。共働きの場合、所得税率が高い方がまとめて申告するとより多くの還付を受けられます。",
  },
  {
    question: "ドラッグストアで買った薬は対象ですか？",
    answer:
      "治療目的で購入した医薬品（風邪薬、胃腸薬など）は対象です。ただし、ビタミン剤やサプリメントなど予防・健康増進目的のものは対象外です。なお、セルフメディケーション税制を利用する方法もあります。",
  },
  {
    question: "セルフメディケーション税制とは何ですか？",
    answer:
      "特定の市販薬（スイッチOTC医薬品）の購入額が年間12,000円を超えた場合に受けられる控除制度です。健康診断や予防接種を受けていることが条件で、通常の医療費控除との併用はできません。上限は88,000円です。",
  },
  {
    question: "通院の交通費は医療費控除の対象になりますか？",
    answer:
      "電車やバスなどの公共交通機関を利用した通院交通費は対象です。自家用車のガソリン代や駐車場代は対象外です。やむを得ずタクシーを利用した場合（夜間の急病、公共交通機関が利用できない場合など）はタクシー代も認められます。",
  },
  {
    question: "医療費控除でいくら戻ってきますか？",
    answer:
      "還付額は「医療費控除額 × 所得税率」で決まります。たとえば控除額が15万円で所得税率20%の場合、所得税の還付は約3万円です。さらに翌年の住民税が約1.5万円（控除額×10%）軽減されるため、合計約4.5万円の節税効果があります。",
  },
  {
    question: "歯科矯正やインプラントは対象ですか？",
    answer:
      "噛み合わせの改善など治療目的の歯科矯正は対象です。見た目を良くするだけの美容目的の矯正は対象外となります。インプラント治療は一般的に医療費控除の対象です。高額になることが多いため、忘れずに申告しましょう。",
  },
  {
    question: "医療費の領収書は提出が必要ですか？",
    answer:
      "2017年分の確定申告から領収書の提出は不要になりました。代わりに「医療費控除の明細書」を作成して提出します。ただし、領収書は5年間の自宅保管義務があり、税務署から提示を求められる場合があります。",
  },
];

export default function MedicalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "医療費控除計算ツール",
            url: "https://tools24.jp/kakutei/medical",
            description:
              "年間の医療費合計を入力するだけで医療費控除額を自動計算。保険金補填額や総所得金額を考慮した正確な控除額がわかります。確定申告の事前確認に。",
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
          { label: "医療費控除かんたん計算" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          医療費控除かんたん計算
        </h1>
        <p className="mt-2 text-muted-foreground">
          年間の医療費合計から控除額を自動計算します
        </p>
      </div>

      <MedicalCalculator />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">医療費控除計算ツールの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは3ステップで医療費控除額と還付見込額を計算できます。確定申告前に「医療費控除でいくら戻るか」を把握するのに最適です。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>年間の医療費合計を入力</strong> — 1月1日〜12月31日に支払った医療費の合計額を入力します。家族全員分を合算してください。</li>
          <li><strong>保険金等で補填された金額を入力</strong> — 高額療養費、入院給付金、出産育児一時金など、保険金で補填された金額があれば入力します。</li>
          <li><strong>総所得金額を入力</strong> — 源泉徴収票の「給与所得控除後の金額」を入力します。総所得が200万円未満の場合は控除のハードルが下がります。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>
      </section>

      {/* 解説セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">医療費控除とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          医療費控除とは、1年間（1月1日〜12月31日）に支払った医療費が一定額を超えた場合に、その超過分を所得から差し引ける制度です。
          控除を受けるには確定申告が必要で、年末調整では適用できません。
          生計を一にする家族全員の医療費を合算できるため、家族が多いほど控除の恩恵を受けやすくなります。
          対象となる医療費には、病院での診察代だけでなく、歯科治療費、処方薬代、入院費、通院のための交通費（電車・バス）なども含まれます。
          控除額に所得税率を掛けた金額が還付され、翌年の住民税も軽減されるため、二重の節税効果があります。
        </p>

        <h2 className="text-2xl font-bold mt-10">対象になるもの・ならないもの</h2>
        <div className="text-muted-foreground leading-relaxed">
          <p>医療費控除の対象になるかどうかは「治療目的かどうか」が判断基準です。以下に具体例をまとめます。</p>

          <h3 className="text-xl font-semibold mt-6">控除対象になるもの</h3>
          <ul className="mt-2 space-y-1">
            <li>医師・歯科医師による診療費・治療費</li>
            <li>処方箋に基づく医薬品の購入費</li>
            <li>入院時の部屋代・食事代（差額ベッド代は自己都合の場合は対象外）</li>
            <li>通院のための電車・バス代（公共交通機関）</li>
            <li>歯科インプラント、噛み合わせ改善の矯正治療</li>
            <li>レーシック手術・不妊治療・人工授精</li>
            <li>治療目的のあん摩・マッサージ・はり・灸の施術費</li>
            <li>介護保険サービスの自己負担分（医療系サービス）</li>
            <li>治療目的で購入した市販の風邪薬・胃腸薬</li>
            <li>松葉杖・義歯・補聴器などの医療器具購入費</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">控除対象にならないもの</h3>
          <ul className="mt-2 space-y-1">
            <li>美容整形・ホワイトニング・美容目的の歯列矯正</li>
            <li>健康診断・人間ドック（異常が見つからなかった場合）</li>
            <li>予防接種（インフルエンザ等）</li>
            <li>ビタミン剤・サプリメント・健康食品</li>
            <li>視力矯正のメガネ・コンタクトレンズ</li>
            <li>自家用車での通院時のガソリン代・駐車場代</li>
            <li>医師の指示なく購入したマスク・消毒液</li>
            <li>疲労回復・リラクゼーション目的のマッサージ</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-10">セルフメディケーション税制との違い</h2>
        <p className="text-muted-foreground leading-relaxed">
          セルフメディケーション税制は、特定のスイッチOTC医薬品（医療用から転用された市販薬）の購入額が年間12,000円を超えた場合に利用できる控除制度です。
          控除上限は88,000円で、通常の医療費控除（上限200万円）とは併用できません。どちらか有利な方を選択します。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">比較項目</th>
                <th className="text-left py-2 pr-4 font-semibold">医療費控除</th>
                <th className="text-left py-2 font-semibold">セルフメディケーション税制</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">適用条件</td>
                <td className="py-2 pr-4">医療費が10万円超（または所得の5%超）</td>
                <td className="py-2">OTC医薬品購入額が12,000円超</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">控除上限</td>
                <td className="py-2 pr-4">200万円</td>
                <td className="py-2">88,000円</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">対象範囲</td>
                <td className="py-2 pr-4">診療費・入院費・薬代・交通費など幅広い</td>
                <td className="py-2">スイッチOTC医薬品のみ</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">前提条件</td>
                <td className="py-2 pr-4">特になし</td>
                <td className="py-2">健康診断・予防接種等を受けていること</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">おすすめの人</td>
                <td className="py-2 pr-4">通院や入院で医療費が多い方</td>
                <td className="py-2">病院にはあまり行かず市販薬で対処する方</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10">医療費控除の計算例</h2>
        <p className="text-muted-foreground leading-relaxed">
          具体的な数字で計算の流れを確認しましょう。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 mt-4 text-muted-foreground leading-relaxed">
          <p className="font-semibold">例：年収500万円（総所得356万円）の会社員Aさん</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>年間医療費合計：35万円（通院15万円 + 歯科治療12万円 + 薬代5万円 + 交通費3万円）</li>
            <li>保険金で補填された額：5万円（入院給付金）</li>
          </ul>
          <div className="mt-3 p-3 bg-background rounded border text-sm">
            <p>控除額 = 35万円 − 5万円 − 10万円 = <span className="font-bold text-foreground">20万円</span></p>
            <p className="mt-1">所得税の還付 = 20万円 × 20%（税率） = <span className="font-bold text-foreground">約4万円</span></p>
            <p className="mt-1">住民税の軽減 = 20万円 × 10% = <span className="font-bold text-foreground">約2万円</span></p>
            <p className="mt-2 font-semibold text-foreground">合計の節税効果：約6万円</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-10">申告に必要な書類</h2>
        <p className="text-muted-foreground leading-relaxed">
          確定申告で医療費控除を受けるために必要な書類は以下のとおりです。事前に準備しておくとスムーズに手続きできます。
        </p>
        <div className="mt-4 text-muted-foreground leading-relaxed">
          <ol className="space-y-2">
            <li><span className="font-semibold">確定申告書（第一表・第二表）</span> — 国税庁の確定申告書等作成コーナーまたは手書きで作成</li>
            <li><span className="font-semibold">医療費控除の明細書</span> — 医療を受けた人・病院名・金額を記入。2017年分以降は領収書の提出不要（5年間保管義務あり）</li>
            <li><span className="font-semibold">医療費通知（医療費のお知らせ）</span> — 健康保険組合から届くもの。あれば明細書の記入を省略可能</li>
            <li><span className="font-semibold">源泉徴収票</span> — 会社員の場合、勤務先から交付されるもの</li>
            <li><span className="font-semibold">本人確認書類</span> — マイナンバーカードまたは通知カード＋運転免許証等</li>
            <li><span className="font-semibold">還付金の振込先情報</span> — 本人名義の銀行口座</li>
          </ol>
          <p className="mt-4">
            通院交通費はメモ書き（日付・経路・金額）を作成して保管しておきましょう。
            医療費が高額な月は「高額療養費制度」の対象になっている場合があるため、保険金の補填額を正確に把握することも重要です。
          </p>
        </div>
      </section>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/medical']} />
    </>
  );
}
