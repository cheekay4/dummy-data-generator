import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "【2026年版】確定申告の始め方 完全ガイド — 初心者向けにわかりやすく解説",
  description:
    "確定申告が初めての方向けに、必要な書類・手順・期限・よくある間違いをステップバイステップで解説。2026年（令和7年）の最新情報対応。",
  alternates: { canonical: "/guide/kakutei-beginners" },
};

const faqs = [
  {
    question: "確定申告をしないとどうなりますか？",
    answer:
      "申告義務があるのに確定申告をしないと「無申告加算税」（15〜20%）と「延滞税」（年2.4〜8.7%）が課されます。悪質な場合は「重加算税」（35〜40%）の対象となることもあります。",
  },
  {
    question: "確定申告はスマートフォンでもできますか？",
    answer:
      "はい、国税庁の確定申告書等作成コーナーはスマートフォンに対応しています。マイナンバーカードとNFC対応スマホがあれば、e-Taxでの電子申告も可能です。",
  },
  {
    question: "会社員でも確定申告が必要なケースは？",
    answer:
      "①年収2,000万円超 ②副業の所得が20万円超 ③医療費控除やふるさと納税（6自治体以上）を受けたい場合 ④住宅ローン控除の初年度 ⑤年の途中で退職した場合 などが該当します。",
  },
  {
    question: "税理士に頼むといくらかかりますか？",
    answer:
      "個人の確定申告は一般的に3〜10万円程度です。事業所得がある場合は記帳代行を含めて10〜30万円が相場です。簡単な給与所得＋控除であれば、無料ツールとe-Taxで十分対応できます。",
  },
  {
    question: "還付金はいつ振り込まれますか？",
    answer:
      "e-Taxで申告した場合は約2〜3週間、書面で提出した場合は約1〜2ヶ月で振り込まれます。申告内容に不備がなければ、早めに申告するほど早く還付されます。",
  },
  {
    question: "医療費控除とセルフメディケーション税制は併用できますか？",
    answer:
      "いいえ、どちらか一方を選択する必要があります。年間の医療費が10万円を超える場合は医療費控除、市販薬の購入額が1万2,000円を超える場合はセルフメディケーション税制が有利になることが多いです。",
  },
];

export default function KakuteiBeginnerPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "【2026年版】確定申告の始め方 完全ガイド — 初心者向けにわかりやすく解説",
            description:
              "確定申告が初めての方向けに、必要な書類・手順・期限・よくある間違いをステップバイステップで解説。2026年（令和7年）の最新情報対応。",
            datePublished: "2026-03-20",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/kakutei-beginners" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "確定申告の始め方" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          【2026年版】確定申告の始め方 完全ガイド
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月20日 ・ 読了時間: 約8分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          「確定申告って何から始めればいいの？」——毎年2月になると多くの方が感じる疑問です。
          このガイドでは、確定申告が初めての方でも迷わないよう、
          必要な書類・手順・期限・よくある間違いをステップバイステップで解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">そもそも確定申告とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          確定申告とは、1月1日から12月31日までの1年間の所得（収入−経費）と税額を計算し、
          税務署に申告・納税する手続きです。会社員の方は年末調整で済む場合が多いですが、
          副業収入がある方、医療費が多かった方、ふるさと納税をした方などは確定申告が必要です。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          確定申告には「申告義務がある場合」と「任意で申告すると得になる場合（還付申告）」の2種類があります。
          還付申告は5年間いつでも提出できますが、通常の確定申告は毎年2月16日〜3月15日が期限です。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">確定申告が必要な人・不要な人</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">ケース</th>
                <th className="text-left py-2 pr-4">申告義務</th>
                <th className="text-left py-2">補足</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">会社員（年末調整のみ）</td>
                <td className="py-2 pr-4 font-medium text-foreground">不要</td>
                <td className="py-2">ただし還付申告は可能</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">副業の所得が20万円超</td>
                <td className="py-2 pr-4 font-medium text-foreground">必要</td>
                <td className="py-2">雑所得 or 事業所得として申告</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">フリーランス・個人事業主</td>
                <td className="py-2 pr-4 font-medium text-foreground">必要</td>
                <td className="py-2">青色申告で65万円控除が有利</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">医療費が年間10万円超</td>
                <td className="py-2 pr-4 font-medium text-foreground">任意（得）</td>
                <td className="py-2">医療費控除で税金が還付される</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ふるさと納税（6自治体以上）</td>
                <td className="py-2 pr-4 font-medium text-foreground">必要</td>
                <td className="py-2">5自治体以下はワンストップ特例で不要</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">住宅ローン控除（初年度）</td>
                <td className="py-2 pr-4 font-medium text-foreground">必要</td>
                <td className="py-2">2年目以降は年末調整で対応可</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">確定申告の流れ（5ステップ）</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="font-semibold text-foreground">必要書類を準備する</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              源泉徴収票、医療費の領収書、ふるさと納税の寄付金受領証明書、生命保険料控除証明書、
              マイナンバーカード（または通知カード＋本人確認書類）を集めます。
              <Link href="/kakutei/checklist" className="text-primary hover:underline ml-1">
                → 必要書類チェックリスト
              </Link>
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-semibold text-foreground">所得と控除を計算する</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              給与所得、副業所得、各種控除額を計算します。
              tools24.jp のシミュレーターを使えば、数値を入力するだけで自動計算できます。
              <Link href="/kakutei/income-tax" className="text-primary hover:underline ml-1">
                → 所得税シミュレーター
              </Link>
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="font-semibold text-foreground">申告書を作成する</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              国税庁の「確定申告書等作成コーナー」にアクセスし、画面の案内に沿って入力します。
              スマートフォンでも作成可能です。
              <Link href="/kakutei/etax-guide" className="text-primary hover:underline ml-1">
                → e-Tax入力ガイド
              </Link>
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</span>
              <h3 className="font-semibold text-foreground">申告書を提出する</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              提出方法は3つ：①e-Tax（マイナンバーカード方式）②e-Tax（ID・パスワード方式）③書面提出（郵送 or 税務署窓口）。
              e-Taxなら24時間いつでも提出でき、還付も早いのでおすすめです。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</span>
              <h3 className="font-semibold text-foreground">納税 or 還付を受け取る</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              追加で税金を納める場合は3月15日までに納付。口座振替・クレジットカード・コンビニ払いが利用可能です。
              還付の場合は指定口座に振り込まれます（e-Tax：約2〜3週間、書面：約1〜2ヶ月）。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">初心者がやりがちな5つの間違い</h2>
        <ol className="text-muted-foreground leading-relaxed space-y-3 list-decimal list-inside">
          <li>
            <strong className="text-foreground">期限を過ぎてしまう</strong> —
            確定申告の期限は3月15日です。遅れると無申告加算税（15〜20%）がかかります。
            e-Taxなら最終日の23:59まで提出可能です。
          </li>
          <li>
            <strong className="text-foreground">控除の申請漏れ</strong> —
            医療費控除・生命保険料控除・ふるさと納税の寄附金控除は、申告しないと適用されません。
            「控除=自動」ではないので注意しましょう。
          </li>
          <li>
            <strong className="text-foreground">副業の「20万円ルール」の誤解</strong> —
            副業所得が20万円以下で所得税の申告が不要でも、住民税の申告は必要です。
            市区町村の窓口で住民税申告を行ってください。
          </li>
          <li>
            <strong className="text-foreground">経費にできるものを見落とす</strong> —
            副業やフリーランスの方は、通信費・交通費・消耗品費・書籍代なども経費に計上できます。
            領収書やレシートは必ず保管しておきましょう。
          </li>
          <li>
            <strong className="text-foreground">マイナンバーカードの準備不足</strong> —
            e-Taxにはマイナンバーカードが必要ですが、カードの発行には数週間かかります。
            確定申告シーズン前に余裕を持って申請しましょう。
          </li>
        </ol>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">2026年（令和7年）の主な変更点</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">定額減税の精算</strong> —
            2024年に実施された定額減税（1人4万円）の精算が必要なケースがあります。
            年末調整で精算済みの方は追加の対応は不要です。
          </li>
          <li>
            <strong className="text-foreground">住宅ローン控除の借入限度額</strong> —
            2024年以降の入居者は、省エネ基準を満たす住宅のみが対象。
            一般の新築住宅は借入限度額が3,000万円（子育て世帯は4,000万円）に変更されています。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jp の確定申告ツールを活用しよう</h2>
        <p className="text-muted-foreground leading-relaxed">
          tools24.jp では確定申告に必要な計算を全て無料でシミュレーションできます。
          登録不要・データ送信なし・ブラウザだけで完結するので、個人情報の漏洩を心配する必要もありません。
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside mt-3">
          <li><Link href="/kakutei/income-tax" className="text-primary hover:underline">所得税シミュレーター</Link> — 年収と控除から所得税・住民税を概算</li>
          <li><Link href="/kakutei/medical" className="text-primary hover:underline">医療費控除計算</Link> — 医療費の合計から控除額と還付額を計算</li>
          <li><Link href="/kakutei/furusato" className="text-primary hover:underline">ふるさと納税 控除上限</Link> — 年収と家族構成から上限額を自動計算</li>
          <li><Link href="/kakutei/side-job" className="text-primary hover:underline">副業の確定申告ナビ</Link> — 副業所得の申告要否と税額を判定</li>
          <li><Link href="/kakutei/checklist" className="text-primary hover:underline">必要書類チェックリスト</Link> — 状況に応じた必要書類を一覧表示</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/csv-mojibake" className="text-primary hover:underline">ExcelのCSV文字化けを3秒で直す方法</Link> — 確定申告データのCSV出力で文字化けした場合の対処法</li>
          <li><Link href="/guide/digital-stamp-remote" className="text-primary hover:underline">テレワーク時代の電子印鑑 導入ガイド</Link> — 確定申告関連書類への電子押印の方法</li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateGuides['/guide/kakutei-beginners']} />
    </>
  );
}
