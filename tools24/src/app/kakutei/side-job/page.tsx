import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { SideJobNavigator } from "@/components/tools/side-job-navigator";

export const metadata: Metadata = {
  title: "副業の確定申告ナビ | 副業収入の申告が必要か判定",
  description:
    "副業の収入と経費を入力するだけで、確定申告が必要かどうかを自動判定。雑所得・事業所得の違いや、会社にバレない方法も解説。副業サラリーマン必見。",
  keywords:
    "副業 確定申告, 副業 20万円, 副業 税金, 副業 雑所得, 副業 バレない",
  alternates: { canonical: '/kakutei/side-job' },
};

const faqs = [
  {
    question: "副業の所得が20万円以下なら申告不要ですか？",
    answer:
      "所得税については確定申告不要です。ただし、住民税の申告は金額に関わらず必要です。お住まいの市区町村に申告してください。また、医療費控除やふるさと納税で確定申告する場合は、20万円以下の副業所得も合算して申告する必要があります。",
  },
  {
    question: "副業の経費として認められるものは？",
    answer:
      "副業に直接関係する支出が経費になります。例: 通信費、交通費、書籍代、ソフトウェア代、外注費、事務用品費など。プライベートと兼用の場合は按分が必要です。按分割合は合理的な根拠（使用時間の割合など）で算出してください。",
  },
  {
    question: "メルカリの売上は申告が必要ですか？",
    answer:
      "生活用動産（衣服、家具等）の売却益は非課税です。ただし、転売目的で仕入れて販売している場合や、1点30万円を超える貴金属・美術品の売却益は申告が必要な場合があります。継続的に販売している場合は事業所得または雑所得として申告が必要です。",
  },
  {
    question: "仮想通貨の税金はどうなりますか？",
    answer:
      "仮想通貨の売却益は雑所得に分類され、他の所得と合算して総合課税されます。株式のような分離課税や損益通算の優遇措置はありません。仮想通貨同士の交換や、仮想通貨での商品購入時も課税対象となる点に注意してください。",
  },
  {
    question: "副業していることは会社にバレますか？",
    answer:
      "最も多いバレるパターンは住民税の金額変動です。確定申告時に住民税の徴収方法を「自分で納付（普通徴収）」に設定すれば、副業分の住民税が会社経由にならず発覚リスクを下げられます。ただし、自治体によっては普通徴収に対応していない場合もあるため、事前に確認しましょう。",
  },
  {
    question: "副業の確定申告はいつまでに行う必要がありますか？",
    answer:
      "毎年2月16日〜3月15日が確定申告期間です。還付申告（税金が戻ってくる場合）は翌年1月1日から5年間提出できます。期限を過ぎると無申告加算税（最大20%）や延滞税が発生するため、期限厳守を心がけましょう。",
  },
  {
    question: "青色申告と白色申告、副業ではどちらを選ぶべき？",
    answer:
      "事業所得として申告する場合、青色申告なら最大65万円の特別控除や赤字の繰越（3年間）が可能です。ただし事前に開業届と青色申告承認申請書の提出が必要です。雑所得の場合は青色申告は選択できず、白色申告のみとなります。",
  },
  {
    question: "複数の副業がある場合はどうすればいいですか？",
    answer:
      "複数の副業所得は合算して判定します。たとえばA社で15万円、B社で10万円の所得がある場合、合計25万円で20万円を超えるため確定申告が必要です。所得区分が異なる場合（給与所得＋雑所得など）もそれぞれ記載して申告します。",
  },
];

export default function SideJobPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "副業の確定申告ナビ",
            url: "https://tools24.jp/kakutei/side-job",
            description:
              "副業の収入と経費を入力するだけで、確定申告が必要かどうかを自動判定。雑所得・事業所得の違いや、会社にバレない方法も解説。副業サラリーマン必見。",
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
          { label: "副業の確定申告ナビ" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          副業の確定申告ナビ
        </h1>
        <p className="mt-2 text-muted-foreground">
          副業収入と経費を入力して、確定申告が必要かどうかを判定します
        </p>
      </div>

      <SideJobNavigator />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">副業の確定申告ナビの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは副業の収入と経費を入力するだけで、確定申告が必要かどうかを自動判定します。副業を始めたばかりの方や、申告が必要か迷っている方に最適です。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>副業の種類を選択</strong> — フリーランス・業務委託、アルバイト・パート、物販・転売など、該当する副業の種類を選びます。</li>
          <li><strong>収入と経費を入力</strong> — 1年間の副業収入（売上）と、業務に使った経費を入力します。所得は「収入 − 経費」で自動計算されます。</li>
          <li><strong>判定結果を確認</strong> — 確定申告が必要かどうかの判定結果と、必要な場合の具体的な手続き方法が表示されます。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。20万円以下でも住民税の申告は必要です。
        </p>
      </section>

      {/* 解説セクション */}
      <div className="mt-16 space-y-10 prose dark:prose-invert max-w-none">
        <section>
          <h2 className="text-xl font-bold">副業の確定申告ルール</h2>
          <p className="text-muted-foreground leading-relaxed">
            会社員（給与所得者）が副業をしている場合、副業の<strong>所得が年間20万円を超える</strong>と確定申告が必要です。
            ここでいう「所得」とは収入（売上）ではなく、<strong>収入から経費を引いた金額</strong>です。
            たとえば、副業の売上が30万円でも、経費が15万円あれば所得は15万円となり、所得税の確定申告は不要です。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            ただし、この20万円ルールには重要な例外があります。まず、<strong>住民税は金額に関わらず申告が必要</strong>です。
            お住まいの市区町村役所で住民税の申告手続きを忘れずに行ってください。
            また、医療費控除やふるさと納税のワンストップ特例が使えない場合など、
            他の理由で確定申告をする際は、20万円以下の副業所得も合算して申告する必要があります。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            さらに、副業先から給与を受け取っている場合（アルバイト・パート）は、
            副業の<strong>給与収入が20万円を超える</strong>と確定申告が必要です。
            2か所以上から給与を受けている場合は、本業の年末調整だけでは税額が正しく計算されないため、
            自分で確定申告を行い精算します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">事業所得 vs 雑所得 ― 何が違う？</h2>
          <p className="text-muted-foreground leading-relaxed">
            副業の所得は、その性質や規模によって<strong>「事業所得」</strong>か<strong>「雑所得」</strong>に分類されます。
            どちらに分類されるかで、税制上の優遇措置が大きく変わります。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>事業所得</strong>に該当する場合、青色申告を選択することで最大65万円の青色申告特別控除が受けられます。
            さらに、事業で赤字が出た場合は給与所得と損益通算でき、所得税の還付が受けられる可能性があります。
            赤字を翌年以降3年間繰り越せるのも大きなメリットです。
            事業所得として認められるには、開業届を税務署に提出し、継続的・反復的に収入を得ていることが求められます。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            一方、<strong>雑所得</strong>は単発・小規模な副業に該当します。
            青色申告の特別控除は使えず、赤字が出ても給与所得との損益通算はできません。
            国税庁は2022年以降、年間収入300万円以下で帳簿保存がない場合は原則として雑所得とする通達を出しています。
            判断に迷う場合は、税務署や税理士に相談するのが確実です。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">経費として認められるもの</h2>
          <p className="text-muted-foreground leading-relaxed">
            副業にかかった支出は「必要経費」として収入から差し引くことができます。
            経費を正しく計上することで、課税される所得を減らし、節税につながります。
            副業で認められる代表的な経費は以下の通りです。
          </p>
          <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-1">
            <li><strong>通信費</strong>：インターネット回線料金、スマートフォン通信費（副業使用分を按分）</li>
            <li><strong>消耗品費</strong>：パソコン周辺機器、事務用品、10万円未満の備品</li>
            <li><strong>交通費</strong>：打ち合わせや納品のための電車代・タクシー代</li>
            <li><strong>書籍・研修費</strong>：業務に関連する書籍、オンライン講座の受講料</li>
            <li><strong>外注費</strong>：業務の一部を他者に委託した場合の報酬</li>
            <li><strong>ソフトウェア・サブスク費</strong>：Adobe、会計ソフト、クラウドサービスの月額料金</li>
            <li><strong>家賃・光熱費</strong>：自宅で副業する場合、使用面積や時間で按分した金額</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            プライベートと兼用の支出は、業務使用割合に応じた<strong>按分計算</strong>が必要です。
            たとえば自宅の1部屋（全体の25%）を副業専用に使っている場合、家賃の25%が経費になります。
            按分の根拠は合理的に説明できるよう、記録を残しておきましょう。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">副業がバレない方法は？</h2>
          <p className="text-muted-foreground leading-relaxed">
            副業が会社にバレる最大の原因は<strong>住民税の金額の変動</strong>です。
            通常、住民税は会社の給与から天引き（特別徴収）されます。
            副業で所得が増えると住民税も増額され、会社の経理担当者が「給与に対して住民税が高い」と気づく可能性があります。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            これを防ぐには、確定申告書の第二表にある「住民税・事業税に関する事項」で、
            給与・公的年金以外の所得に係る住民税の徴収方法を<strong>「自分で納付（普通徴収）」</strong>に設定してください。
            これにより、副業分の住民税は自宅に届く納付書で自分で支払う形になり、会社には通知されません。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            ただし、以下の注意点があります。
            自治体によっては給与所得以外の普通徴収に対応していない場合があるため、事前にお住まいの市区町村に確認してください。
            また、副業がアルバイト（給与所得）の場合は、原則として特別徴収に合算されるため、
            普通徴収を選択しても完全に分離できないケースがあります。
            フリーランス型（業務委託）の副業であれば、普通徴収による分離がスムーズです。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">副業の確定申告の流れ</h2>
          <p className="text-muted-foreground leading-relaxed">
            副業の確定申告は、以下のステップで進めます。初めてでも順番に準備すれば難しくありません。
          </p>
          <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
            <li>
              <strong>収入と経費の記録を整理する</strong>：1年間の副業収入（振込明細・請求書）と
              経費（レシート・領収書）を月ごとにまとめます。会計ソフトやExcelで管理すると効率的です。
            </li>
            <li>
              <strong>必要書類を準備する</strong>：源泉徴収票（本業分）、支払調書（副業先から届く場合）、
              経費の領収書、マイナンバーカードまたは通知カードを用意します。
            </li>
            <li>
              <strong>確定申告書を作成する</strong>：国税庁の「確定申告書等作成コーナー」を使えば、
              画面の指示に従って入力するだけで申告書が作成できます。e-Taxならオンラインで提出可能です。
            </li>
            <li>
              <strong>所得区分を正しく選ぶ</strong>：事業所得なら申告書B＋青色申告決算書（または収支内訳書）、
              雑所得なら申告書の「雑所得」欄に金額を記入します。
            </li>
            <li>
              <strong>住民税の徴収方法を選択する</strong>：会社にバレたくない場合は「自分で納付（普通徴収）」にチェック。
            </li>
            <li>
              <strong>期限内に提出・納付する</strong>：毎年2月16日〜3月15日が申告期限です。
              納税額がある場合は同日までに納付します。振替納税やクレジットカード払いも利用できます。
            </li>
          </ol>
        </section>
      </div>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/side-job']} />
    </>
  );
}
