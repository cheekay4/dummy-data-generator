import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "フリーランス1年目の確定申告でやりがちな5つのミスと対策",
  description:
    "フリーランス1年目が確定申告でよくやる5つのミス（領収書・源泉徴収・青色申告・社会保険料控除・消費税）と、それぞれの具体的な対策を解説します。",
  alternates: { canonical: "/blog/freelance-kakutei-tips" },
};

const faqs = [
  {
    question: "フリーランス1年目でも確定申告は必要ですか？",
    answer:
      "年間の所得（収入から経費を引いた金額）が48万円を超える場合は、確定申告が必要です。副業フリーランスの場合は、副業所得が20万円を超えると申告義務が発生します。",
  },
  {
    question: "青色申告と白色申告のどちらを選ぶべきですか？",
    answer:
      "青色申告がおすすめです。最大65万円の控除が受けられるため、税負担を大幅に軽減できます。開業届と同時に「青色申告承認申請書」を提出しましょう。",
  },
  {
    question: "確定申告の期限はいつですか？",
    answer:
      "毎年2月16日〜3月15日が申告期間です。期限を過ぎると延滞税や無申告加算税が課される場合があります。早めの準備が重要です。",
  },
  {
    question: "経費として認められるものの基準は？",
    answer:
      "事業に直接関連する支出が経費になります。自宅兼事務所の場合は、家賃や光熱費の一部を「家事按分」として経費計上できます。プライベートと事業の使用割合を合理的に按分しましょう。",
  },
];

export default function FreelanceKakuteiTipsPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "フリーランス1年目の確定申告でやりがちな5つのミスと対策",
            description:
              "フリーランス1年目が確定申告でよくやる5つのミスと具体的な対策を解説。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/blog/freelance-kakutei-tips" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ノート", href: "/blog" },
          { label: "フリーランス確定申告のミス" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          フリーランス1年目の確定申告でやりがちな5つのミスと対策
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          公開日: 2026年3月29日 ・ 読了時間: 約7分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          会社員からフリーランスに転身すると、年末調整の代わりに自分で確定申告をしなければなりません。
          しかし初めての確定申告では、知らなかったために損をしてしまうケースが非常に多いのが実情です。
          この記事では、フリーランス1年目の方がやりがちな5つのミスと、それぞれの具体的な対策を解説します。
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 not-prose mt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>ご注意:</strong> この記事は一般的な情報提供を目的としており、税務アドバイスではありません。
            正確な判断は税理士にご相談ください。
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          フリーランスの確定申告は会社員とは全く別物
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          会社員の場合、所得税の計算・納付は会社が代行してくれます（年末調整）。
          しかしフリーランスになると、収入の把握、経費の計算、各種控除の適用、税額の算出、申告書の提出まで、
          すべてを自分で行わなければなりません。
          この「全部自分でやる」という前提を理解していないと、以下のようなミスが発生しやすくなります。
          tools24.jpの
          <Link href="/kakutei/income-tax" className="text-primary hover:underline">所得税シミュレーター</Link>
          を使えば、税額の目安をすぐに確認できます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ミス①: 経費の領収書を保管していない
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          フリーランスにとって経費は税負担を軽減する重要な要素ですが、領収書を捨ててしまったり、
          整理せずに放置してしまうケースが非常に多いです。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h3 className="font-semibold text-foreground text-sm">対策</h3>
          <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
            <li>領収書は法律上、青色申告の場合は7年間、白色申告の場合は5年間の保管義務があります</li>
            <li>紙の領収書はスマホで撮影してクラウドストレージに保存するのがおすすめ</li>
            <li>電子帳簿保存法の改正により、電子データで受領した領収書は電子保存が原則必須</li>
            <li>月ごとにフォルダを分けて整理すると、確定申告時に楽になります</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ミス②: 源泉徴収と確定申告の二重課税に気づかない
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          取引先から報酬を受け取る際、源泉徴収として10.21%が差し引かれている場合があります。
          この源泉徴収税は「仮の納税」であり、確定申告で精算する必要があります。
          しかしこの仕組みを知らず、源泉徴収済みの報酬に対してさらに全額の所得税を申告してしまうと、
          二重に税金を払うことになります。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h3 className="font-semibold text-foreground text-sm">対策</h3>
          <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
            <li>支払調書や請求書で源泉徴収額を確認し、確定申告書の「源泉徴収税額」欄に正しく記入</li>
            <li>源泉徴収された金額が確定税額を上回っていれば、差額が還付されます</li>
            <li>
              <Link href="/kakutei/side-job" className="text-primary hover:underline">副業確定申告ガイド</Link>
              で源泉徴収の仕組みを確認できます
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ミス③: 青色申告の届出を出し忘れる
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          青色申告を利用すると最大65万円の特別控除を受けられますが、
          事前に「青色申告承認申請書」を税務署に提出する必要があります。
          開業後2ヶ月以内（1月15日以前に開業した場合はその年の3月15日まで）に提出しなければ、
          その年は白色申告しか選べません。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h3 className="font-semibold text-foreground text-sm">対策</h3>
          <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
            <li>開業届と青色申告承認申請書は同時に提出するのがベストプラクティス</li>
            <li>e-Taxからオンラインで提出可能。国税庁のサイトからPDFもダウンロードできます</li>
            <li>65万円控除には複式簿記での帳簿付けとe-Tax提出が必要（簡易簿記は10万円控除）</li>
            <li>
              <Link href="/kakutei/checklist" className="text-primary hover:underline">確定申告チェックリスト</Link>
              で提出書類の漏れを防ぎましょう
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ミス④: 社会保険料控除を忘れる
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          フリーランスは国民健康保険と国民年金に加入しますが、
          これらの保険料は「社会保険料控除」として全額が所得から控除できます。
          会社員時代は給与から天引きされていたため、自分で申告する必要があることを忘れがちです。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h3 className="font-semibold text-foreground text-sm">対策</h3>
          <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
            <li>国民年金の控除証明書は毎年10〜11月頃に届くので大切に保管</li>
            <li>国民健康保険料は市区町村から届く納付額通知書で金額を確認</li>
            <li>iDeCoや国民年金基金に加入している場合も、掛金が全額控除の対象</li>
            <li>付加年金（月額400円）も控除対象。少額でも積み重ねると差が出ます</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">
          ミス⑤: 消費税の免税事業者制度を理解していない
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          開業から2年間は原則として消費税の免税事業者ですが、2023年10月からのインボイス制度の導入により状況が変わりました。
          適格請求書発行事業者として登録すると、免税事業者であっても消費税の申告・納付が必要になります。
          登録するかどうかは取引先との関係や売上規模によって判断が分かれます。
        </p>
        <div className="bg-muted/50 rounded-lg p-4 not-prose mt-4">
          <h3 className="font-semibold text-foreground text-sm">対策</h3>
          <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
            <li>売上1,000万円以下でもインボイス登録すると課税事業者になる点に注意</li>
            <li>2割特例（2026年9月30日まで）を活用すれば、納税額を売上税額の2割に軽減可能</li>
            <li>BtoC取引がメインの場合は登録不要なケースが多い</li>
            <li>判断に迷ったら税理士に相談するのが確実です</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">まとめ</h2>
        <p className="text-muted-foreground leading-relaxed">
          フリーランス1年目の確定申告では、「知らなかった」ことで税金を多く払いすぎたり、
          控除の恩恵を受け損ねたりするケースが非常に多いです。
          この記事で紹介した5つのミスを事前に把握しておくだけで、数万円〜数十万円の差が生まれることもあります。
          tools24.jpの
          <Link href="/kakutei/income-tax" className="text-primary hover:underline">所得税シミュレーター</Link>
          や
          <Link href="/kakutei/checklist" className="text-primary hover:underline">確定申告チェックリスト</Link>
          を活用して、漏れのない申告を目指しましょう。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連記事</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/kakutei-beginners" className="text-primary hover:underline">はじめての確定申告ガイド — 基礎知識と準備の流れ</Link></li>
          <li><Link href="/blog/tools24-dev-story" className="text-primary hover:underline">tools24.jp開発ストーリー——24本のツールを個人で作って学んだこと</Link></li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
