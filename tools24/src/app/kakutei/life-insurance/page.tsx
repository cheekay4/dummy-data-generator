import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { LifeInsuranceCalculator } from "@/components/tools/life-insurance-calculator";

export const metadata: Metadata = {
  title: "生命保険料控除かんたん計算 | 年間保険料から控除額を自動計算",
  description:
    "年間の保険料を入力するだけで、生命保険料控除額を自動計算。一般・介護医療・個人年金の3区分に対応。新制度・旧制度の違いも解説。",
  keywords:
    "生命保険料控除 計算, 生命保険料控除 いくら, 保険料控除 シミュレーション, 年末調整 保険料控除",
  alternates: { canonical: '/kakutei/life-insurance' },
};

const faqs = [
  {
    question: "新制度と旧制度はどう判別しますか？",
    answer:
      "保険会社から届く控除証明書に「新制度」「旧制度」と記載されています。2012年1月1日以降に契約した保険は新制度、それ以前は旧制度です。途中で契約内容を変更（特約の付加・更新など）した場合、新制度に切り替わることがあります。",
  },
  {
    question: "新旧両方の保険がある場合は？",
    answer:
      "新制度のみで計算する方法と、新旧合算する方法があり、有利な方を選べます。ただし合算の場合、各区分の控除上限は4万円です。このツールでは自動的に有利な方を適用します。",
  },
  {
    question: "年末調整で申告済みですが確定申告でも使えますか？",
    answer:
      "確定申告をする場合は、年末調整で申告した内容も含めて改めて申告します。年末調整と確定申告で二重に控除を受けることはできません。源泉徴収票に記載の保険料控除額を確認して、確定申告書に転記してください。",
  },
  {
    question: "月払いと年払いで控除額は変わりますか？",
    answer:
      "控除額はその年に実際に支払った保険料の合計で計算するため、月払いでも年払いでも年間の支払額が同じなら控除額は同じです。ただし年の途中で解約した場合は、解約までに支払った保険料のみが対象となります。",
  },
  {
    question: "配偶者や家族の保険料も控除できますか？",
    answer:
      "自分が保険料を支払っていれば、契約者が配偶者や家族であっても控除対象になります。ただし、保険金の受取人が自分・配偶者・その他の親族のいずれかである必要があります。逆に、契約者が自分でも保険料を家族が支払っている場合は控除できません。",
  },
  {
    question: "控除証明書をなくしてしまいました。どうすればいいですか？",
    answer:
      "保険会社に連絡すれば再発行してもらえます。再発行には1〜2週間程度かかる場合があるため、確定申告の期限に間に合うよう早めに手続きしてください。e-Taxで電子的に提出する場合は、電子データ（XMLファイル）での提出も可能です。",
  },
  {
    question: "学資保険や養老保険も控除の対象ですか？",
    answer:
      "はい、学資保険は一般生命保険料控除、養老保険も一般生命保険料控除の対象です。ただし、保険期間が5年未満の貯蓄型保険や、財形貯蓄保険、団体信用生命保険（団信）は控除対象外です。",
  },
  {
    question: "地震保険料控除とは別の制度ですか？",
    answer:
      "はい、生命保険料控除と地震保険料控除は別の制度です。地震保険料控除は最大5万円で、火災保険は対象外です。両方の保険に加入している場合は、それぞれ別々に控除を受けられます。",
  },
];

export default function LifeInsurancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "生命保険料控除計算ツール",
            url: "https://tools24.jp/kakutei/life-insurance",
            description:
              "年間の保険料を入力するだけで、生命保険料控除額を自動計算。一般・介護医療・個人年金の3区分に対応。新制度・旧制度の違いも解説。",
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
          { label: "生命保険料控除かんたん計算" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          生命保険料控除かんたん計算
        </h1>
        <p className="mt-2 text-muted-foreground">
          年間の保険料から生命保険料控除額を自動計算します
        </p>
      </div>

      <LifeInsuranceCalculator />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">生命保険料控除計算ツールの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは保険会社から届く控除証明書の金額を入力するだけで、生命保険料控除額を自動計算します。新制度・旧制度が混在している場合も、最も有利な計算方法を自動で適用します。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>制度を選択</strong> — 控除証明書に記載の「新制度」「旧制度」を選びます。2012年1月1日以降の契約は新制度です。</li>
          <li><strong>区分ごとに保険料を入力</strong> — 一般生命保険料、介護医療保険料、個人年金保険料の3区分に分けて、年間の支払保険料を入力します。</li>
          <li><strong>控除額を確認</strong> — 区分ごとの控除額と、合計の控除額が表示されます。年末調整の申告書や確定申告書への転記にご利用ください。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>
      </section>

      {/* 解説セクション */}
      <div className="mt-16 space-y-10 prose dark:prose-invert max-w-none">
        <section>
          <h2 className="text-xl font-bold">生命保険料控除の仕組み</h2>
          <p className="text-muted-foreground leading-relaxed">
            生命保険料控除は、1年間に支払った生命保険料の一定額を所得から差し引くことで、
            所得税と住民税を軽減できる制度です。対象となる保険は大きく<strong>3つの区分</strong>に分かれています。
          </p>
          <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-1">
            <li><strong>一般生命保険料</strong>：死亡保険、学資保険、養老保険など、生存または死亡に起因して保険金が支払われる保険</li>
            <li><strong>介護医療保険料</strong>：医療保険、がん保険、介護保険など、入院・通院・介護を保障する保険</li>
            <li><strong>個人年金保険料</strong>：個人年金保険（税制適格特約が付加されたもの）</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            会社員の方は毎年の年末調整で申告するのが一般的です。
            控除証明書は10月〜11月頃に保険会社から届きますので、届いたら年末調整の書類と一緒に会社に提出してください。
            届かない場合や紛失した場合は、保険会社に再発行を依頼できます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">新制度と旧制度の違い</h2>
          <p className="text-muted-foreground leading-relaxed">
            生命保険料控除は、<strong>2012年（平成24年）1月1日</strong>を境に「新制度」と「旧制度」の2つの計算方法が存在します。
            保険の契約日によってどちらが適用されるかが決まります。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>新制度（2012年1月1日以降の契約）</strong>では、一般・介護医療・個人年金の3区分で、
            各区分の所得税控除上限は4万円、3区分合計で<strong>最大12万円</strong>の控除が受けられます。
            旧制度になかった「介護医療保険料」が独立した区分として新設されたのが特徴です。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>旧制度（2011年12月31日以前の契約）</strong>では、一般・個人年金の2区分で、
            各区分の所得税控除上限は5万円、合計で<strong>最大10万円</strong>です。
            介護医療保険料は一般生命保険料に含めて計算します。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            新旧両方の保険がある場合は、区分ごとに「新制度のみ」「旧制度のみ」「新旧合算」のうち、
            最も有利な計算方法を選択できます。ただし、新旧合算を選んだ場合の各区分上限は4万円となる点に注意してください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">控除額の上限</h2>
          <p className="text-muted-foreground leading-relaxed">
            控除額は支払った保険料の全額ではなく、以下の計算式で算出されます。
            保険料が多いほど控除額も増えますが、一定額を超えると上限に達します。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>新制度（所得税）の計算式：</strong>年間支払保険料が2万円以下なら全額控除。
            2万円超〜4万円以下は「保険料 × 1/2 + 1万円」、
            4万円超〜8万円以下は「保険料 × 1/4 + 2万円」、
            8万円超は一律<strong>4万円</strong>が上限です。
            たとえば年間保険料6万円の場合、6万円 × 1/4 + 2万円 = 3.5万円が控除額になります。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>旧制度（所得税）の計算式：</strong>2.5万円以下なら全額、
            2.5万円超〜5万円以下は「保険料 × 1/2 + 1.25万円」、
            5万円超〜10万円以下は「保険料 × 1/4 + 2.5万円」、
            10万円超は一律<strong>5万円</strong>が上限です。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            住民税の控除額は所得税とは別の計算式で、上限も異なります（新制度：各区分2.8万円・合計7万円、旧制度：各区分3.5万円・合計7万円）。
            住民税は自動的に計算されるため、確定申告書に所得税分の金額を記入すれば問題ありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">年末調整 vs 確定申告 ― どちらで申告する？</h2>
          <p className="text-muted-foreground leading-relaxed">
            会社員の場合、通常は<strong>年末調整</strong>で生命保険料控除を申告します。
            毎年11月頃に会社から配布される「給与所得者の保険料控除申告書」に、
            控除証明書の内容を転記して提出するだけで手続き完了です。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            一方、以下のケースでは<strong>確定申告</strong>で生命保険料控除を申告する必要があります。
          </p>
          <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-1">
            <li>年末調整で保険料控除の申告を忘れた場合（還付申告として5年間提出可能）</li>
            <li>自営業・フリーランスで年末調整がない場合</li>
            <li>医療費控除やふるさと納税など、他の理由で確定申告をする場合</li>
            <li>年の途中で退職し、年末調整を受けていない場合</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            確定申告で申告する場合は、控除証明書の原本を添付します。
            e-Taxを利用する場合は、保険会社から取得した電子データ（XMLファイル）での提出も可能です。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">控除証明書の見方</h2>
          <p className="text-muted-foreground leading-relaxed">
            保険会社から届く「生命保険料控除証明書」には、申告に必要な情報がすべて記載されています。
            以下のポイントを確認してください。
          </p>
          <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-1">
            <li><strong>適用制度</strong>：「新制度」か「旧制度」かを確認。計算方法が異なります</li>
            <li><strong>保険の種類（区分）</strong>：一般／介護医療／個人年金のどの区分に該当するか</li>
            <li><strong>証明額と申告額</strong>：証明額は証明書発行時点までの支払額、申告額は12月末までの見込額です。年末調整・確定申告では<strong>申告額</strong>を使用します</li>
            <li><strong>契約者・被保険者・受取人</strong>：控除の適用要件を満たしているか確認</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            複数の保険に加入している場合は、それぞれの控除証明書を集めて区分ごとに合計額を計算します。
            電子版の控除証明書（XMLデータ）を保険会社のマイページからダウンロードできる場合もあり、
            e-Taxでの申告時にそのまま取り込めるため、転記ミスの防止にもなります。
          </p>
        </section>
      </div>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/life-insurance']} />
    </>
  );
}
