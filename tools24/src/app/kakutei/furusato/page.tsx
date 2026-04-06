import type { Metadata } from "next";
import { DisclaimerBanner } from "@/components/common/disclaimer-banner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateKakuteiTools } from "@/lib/affiliate-data";
import { FurusatoCalculator } from "@/components/tools/furusato-calculator";

export const metadata: Metadata = {
  title: "ふるさと納税 控除上限シミュレーター | 年収から上限額を計算",
  description:
    "年収と家族構成を入力するだけで、ふるさと納税の控除上限額（自己負担2,000円になる寄附上限）を自動計算。独身・共働き・扶養家族ありなど様々なケースに対応。",
  keywords:
    "ふるさと納税 上限, ふるさと納税 控除額 計算, ふるさと納税 シミュレーション, ふるさと納税 限度額",
  alternates: { canonical: '/kakutei/furusato' },
};

const faqs = [
  {
    question: "ふるさと納税の控除上限額とは？",
    answer:
      "自己負担が2,000円になる寄附金額の上限です。この金額を超えて寄附することもできますが、超えた分は自己負担となります。上限額は年収・家族構成・各種控除によって変わるため、事前にシミュレーションしておくことが大切です。",
  },
  {
    question: "ワンストップ特例と確定申告、どちらがお得ですか？",
    answer:
      "控除の合計額は同じです。ただし、寄附先が5自治体以内で他に確定申告の必要がない場合はワンストップ特例が手軽です。6自治体以上に寄附する場合や、医療費控除など他の控除で確定申告する場合は確定申告が必要です。",
  },
  {
    question: "住宅ローン控除とふるさと納税は併用できますか？",
    answer:
      "はい、併用できます。ただし、住宅ローン控除で所得税が大幅に減額されている場合、ふるさと納税の控除上限額が下がる場合があります。ワンストップ特例を使えば住民税からの控除になるため影響を受けにくくなります。",
  },
  {
    question: "共働きの場合、夫婦それぞれ計算が必要ですか？",
    answer:
      "はい、ふるさと納税の控除上限額は個人ごとに計算されます。それぞれの年収・控除額で計算してください。共働きの場合は二人分の上限額を合計でき、より多くの返礼品を受け取れます。",
  },
  {
    question: "ふるさと納税はいつまでに申し込めばいいですか？",
    answer:
      "対象期間は1月1日〜12月31日です。クレジットカード決済の場合は12月31日中の決済完了が必要です。銀行振込や払込取扱票の場合は年内の着金が条件です。ワンストップ特例の申請書は翌年1月10日必着で届出が必要です。",
  },
  {
    question: "返礼品はどれくらいの価値がありますか？",
    answer:
      "総務省の規定により、返礼品の調達費は寄附額の3割以内とされています。たとえば1万円の寄附なら3,000円相当の返礼品が目安です。自己負担2,000円で受け取れるため、上限額内であればかなりお得な制度です。",
  },
  {
    question: "年末に転職した場合、控除上限額はどうなりますか？",
    answer:
      "控除上限額はその年の1月〜12月の総収入で計算します。転職した場合は前職と現職の年収を合算して計算してください。年末調整は転職先で行いますが、前職の源泉徴収票が必要です。",
  },
  {
    question: "ふるさと納税の寄附金控除が反映されているか確認する方法は？",
    answer:
      "確定申告の場合は還付金の振込で確認できます。ワンストップ特例の場合は、翌年6月頃に届く「住民税決定通知書」の摘要欄や税額控除欄で確認します。寄附金税額控除の記載があれば正しく反映されています。",
  },
];

export default function FurusatoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ふるさと納税 控除上限シミュレーター",
            url: "https://tools24.jp/kakutei/furusato",
            description:
              "年収と家族構成を入力するだけで、ふるさと納税の控除上限額（自己負担2,000円になる寄附上限）を自動計算。独身・共働き・扶養家族ありなど様々なケースに対応。",
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
          { label: "ふるさと納税 控除上限シミュレーター" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          ふるさと納税 控除上限シミュレーター
        </h1>
        <p className="mt-2 text-muted-foreground">
          年収と家族構成から、自己負担2,000円になる寄附上限を計算します
        </p>
      </div>

      <FurusatoCalculator />

      {/* 使い方セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">ふるさと納税 控除上限シミュレーターの使い方</h2>
        <p className="text-muted-foreground leading-relaxed">
          このツールは年収と家族構成を入力するだけで、ふるさと納税の控除上限額（自己負担2,000円になる寄附上限）を計算します。上限を超えた分は自己負担になるため、事前のシミュレーションが重要です。
        </p>
        <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mt-3">
          <li><strong>年収を入力</strong> — 源泉徴収票の「支払金額」欄の数字を入力します。ボーナスを含む年間の総支給額です。</li>
          <li><strong>家族構成を選択</strong> — 独身・共働き・配偶者控除あり・扶養家族の人数など、ご自身の家族構成を選択します。</li>
          <li><strong>その他の控除を入力</strong> — iDeCo・住宅ローン控除・生命保険料控除などがある場合は入力します。これらの控除によって上限額が下がります。</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          ※ 正確な税額は国税庁サイトまたは税理士にご確認ください。
        </p>
      </section>

      {/* 解説セクション */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold">ふるさと納税の仕組み</h2>
        <p className="text-muted-foreground leading-relaxed">
          ふるさと納税は、自分が応援したい自治体に寄附をすると、自己負担2,000円を除いた全額が所得税と住民税から控除される制度です。
          さらに多くの自治体が寄附額の3割以内の返礼品を用意しており、実質2,000円で各地の特産品を受け取れます。
          控除を受けるには「確定申告」または「ワンストップ特例制度」のいずれかの手続きが必要です。
        </p>
        <div className="text-muted-foreground leading-relaxed mt-4">
          <p className="font-semibold">ふるさと納税の流れ：</p>
          <ol className="mt-2 space-y-1">
            <li>ふるさと納税サイト（さとふる・ふるなび・楽天等）で自治体と返礼品を選ぶ</li>
            <li>寄附を申し込み、クレジットカード等で決済する</li>
            <li>自治体から返礼品と寄附金受領証明書が届く</li>
            <li>ワンストップ特例の申請書を提出するか、確定申告で寄附金控除を申告する</li>
            <li>翌年の所得税（還付）と住民税（減額）で寄附額 − 2,000円が戻る</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-10">控除上限額の目安</h2>
        <p className="text-muted-foreground leading-relaxed">
          控除上限額は年収・家族構成・各種控除によって変わります。
          上限を超えて寄附することも可能ですが、超過分は純粋な寄附（自己負担）となります。
          以下の表は給与所得者の目安です。iDeCo・住宅ローン控除がある場合は上限が下がります。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">年収</th>
                <th className="text-left py-2 pr-4 font-semibold">独身 / 共働き（扶養なし）</th>
                <th className="text-left py-2 pr-4 font-semibold">夫婦（配偶者控除あり）</th>
                <th className="text-left py-2 font-semibold">夫婦 + 子1人（16歳以上）</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">300万円</td>
                <td className="py-2 pr-4">約28,000円</td>
                <td className="py-2 pr-4">約19,000円</td>
                <td className="py-2">約11,000円</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">400万円</td>
                <td className="py-2 pr-4">約42,000円</td>
                <td className="py-2 pr-4">約33,000円</td>
                <td className="py-2">約25,000円</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">500万円</td>
                <td className="py-2 pr-4">約61,000円</td>
                <td className="py-2 pr-4">約49,000円</td>
                <td className="py-2">約40,000円</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">600万円</td>
                <td className="py-2 pr-4">約77,000円</td>
                <td className="py-2 pr-4">約69,000円</td>
                <td className="py-2">約57,000円</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">700万円</td>
                <td className="py-2 pr-4">約108,000円</td>
                <td className="py-2 pr-4">約86,000円</td>
                <td className="py-2">約78,000円</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">800万円</td>
                <td className="py-2 pr-4">約129,000円</td>
                <td className="py-2 pr-4">約120,000円</td>
                <td className="py-2">約110,000円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ※上記は目安です。社会保険料・生命保険料控除・住宅ローン控除等により実際の上限額は変動します。正確な金額は上のシミュレーターで計算してください。
        </p>

        <h2 className="text-2xl font-bold mt-10">ワンストップ特例 vs 確定申告</h2>
        <p className="text-muted-foreground leading-relaxed">
          ふるさと納税の税控除を受ける方法は2つあります。状況に応じてどちらを利用するか判断しましょう。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">比較項目</th>
                <th className="text-left py-2 pr-4 font-semibold">ワンストップ特例</th>
                <th className="text-left py-2 font-semibold">確定申告</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">対象者</td>
                <td className="py-2 pr-4">確定申告不要の給与所得者</td>
                <td className="py-2">誰でも利用可能</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">寄附先の上限</td>
                <td className="py-2 pr-4">5自治体以内</td>
                <td className="py-2">制限なし</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">申請方法</td>
                <td className="py-2 pr-4">各自治体に申請書を郵送</td>
                <td className="py-2">税務署に確定申告書を提出</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">控除の内訳</td>
                <td className="py-2 pr-4">全額が住民税から控除</td>
                <td className="py-2">所得税の還付 + 住民税の減額</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">申請期限</td>
                <td className="py-2 pr-4">翌年1月10日必着</td>
                <td className="py-2">翌年3月15日まで</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">注意点</td>
                <td className="py-2 pr-4">確定申告すると無効になる</td>
                <td className="py-2">全ての寄附先分を申告する</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          医療費控除・住宅ローン控除（初年度）・副業の申告など、他の理由で確定申告をする場合は、ワンストップ特例が無効になります。
          その場合はワンストップ特例で申請済みの分も含め、全てのふるさと納税を確定申告で申告し直す必要があります。
        </p>

        <h2 className="text-2xl font-bold mt-10">お得に活用するコツ</h2>
        <div className="text-muted-foreground leading-relaxed">
          <ul className="space-y-3 mt-2">
            <li>
              <span className="font-semibold">上限額ギリギリまで寄附する</span> — 上限額内であれば自己負担は一律2,000円。上限に余裕がある場合は追加で寄附した方がお得です。ただし超過すると自己負担が増えるため、正確な上限額の把握が重要です。
            </li>
            <li>
              <span className="font-semibold">ポイント還元を活用する</span> — 楽天ふるさと納税なら楽天ポイント、ふるなびならふるなびコインが貯まります。キャンペーン時期（お買い物マラソン等）を狙えば、さらにポイント還元率がアップします。
            </li>
            <li>
              <span className="font-semibold">日用品・食料品の返礼品を選ぶ</span> — お米やトイレットペーパーなど日常的に使うものを返礼品で受け取れば、生活費の節約にもつながります。定期便で年間を通じて届く返礼品もあります。
            </li>
            <li>
              <span className="font-semibold">年末に慌てない</span> — 人気の返礼品は12月に品切れになりがちです。年収の見通しがついた時点で早めに寄附を始め、12月は微調整に充てると良いでしょう。
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-10">よくある失敗</h2>
        <div className="text-muted-foreground leading-relaxed">
          <ul className="space-y-3 mt-2">
            <li>
              <span className="font-semibold text-destructive">控除上限額を超えてしまう</span> — 上限額を正確に計算せずに寄附し、超過分が自己負担になるケース。年収の変動（転職・賞与減額）にも注意してください。
            </li>
            <li>
              <span className="font-semibold text-destructive">ワンストップ特例の申請を忘れる</span> — 申請書の提出期限は翌年1月10日必着です。届いた申請書を放置すると控除が受けられません。オンライン申請に対応している自治体もあります。
            </li>
            <li>
              <span className="font-semibold text-destructive">確定申告でワンストップ特例が無効に</span> — 医療費控除などで確定申告を行うと、ワンストップ特例の申請は全て無効になります。確定申告書にふるさと納税分を記入し忘れると控除がゼロになります。
            </li>
            <li>
              <span className="font-semibold text-destructive">寄附金受領証明書を紛失する</span> — 確定申告には寄附金受領証明書が必要です。届いたら確定申告まで大切に保管しましょう。紛失した場合は自治体に再発行を依頼できますが、時間がかかります。
            </li>
            <li>
              <span className="font-semibold text-destructive">名義の不一致</span> — ふるさと納税は「寄附者本人」の名義で行う必要があります。家族のクレジットカードで決済すると控除が受けられない場合があります。
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-12">
        <AdPlaceholder position="content" />
      </div>

      <div className="mt-12">
        <FAQSection faqs={faqs} />
      </div>
      <AffiliateTextLink {...affiliateKakuteiTools['/kakutei/furusato']} />
    </>
  );
}
