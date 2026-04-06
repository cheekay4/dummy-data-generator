import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateGuides } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: "テレワーク時代の電子印鑑 導入ガイド — 法的効力・種類・使い方",
  description:
    "電子印鑑の法的効力、印影画像と電子署名の違い、Word/Excel/PDFへの貼り付け方、セキュリティの注意点を網羅的に解説。テレワークでの押印業務を効率化。",
  alternates: { canonical: "/guide/digital-stamp-remote" },
};

const faqs = [
  {
    question: "電子印鑑は法的に認められていますか？",
    answer:
      "日本の法律上、契約書は「署名または記名・押印」で成立します（民法）。電子印鑑（印影画像）は社内文書や請求書では実務上広く使われていますが、法的に実印と同等の効力を持つには電子署名法に基づく電子署名が必要です。",
  },
  {
    question: "無料の電子印鑑と有料の電子署名サービスの違いは？",
    answer:
      "無料の電子印鑑（印影画像）は認印レベルで、社内文書・請求書に適しています。有料の電子署名サービス（DocuSign、クラウドサイン等）はPKI証明書による本人証明・改ざん検知・タイムスタンプが付き、契約書や公的文書に使用できます。",
  },
  {
    question: "電子帳簿保存法との関係は？",
    answer:
      "2024年1月から電子取引データの保存が義務化されました。電子印鑑付きの文書も電子取引に該当するため、タイムスタンプの付与またはデータの訂正・削除の防止措置が必要です。詳細は国税庁のQ&Aをご確認ください。",
  },
  {
    question: "印影画像が不正にコピーされるリスクは？",
    answer:
      "印影画像は技術的にコピーが容易です。重要な文書にはパスワード保護されたPDFと組み合わせるか、電子署名サービスの利用を推奨します。社内文書レベルであれば、日付印を使うことで不正使用のリスクを軽減できます。",
  },
];

export default function DigitalStampRemotePage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "テレワーク時代の電子印鑑 導入ガイド — 法的効力・種類・使い方",
            description:
              "電子印鑑の法的効力、印影画像と電子署名の違い、Word/Excel/PDFへの貼り付け方、セキュリティの注意点を網羅的に解説。",
            datePublished: "2026-03-20",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/digital-stamp-remote" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "電子印鑑 導入ガイド" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          テレワーク時代の電子印鑑 導入ガイド
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月20日 ・ 読了時間: 約7分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          「出社しないと印鑑が押せない」——テレワークの普及に伴い、
          押印のためだけに出社する「ハンコ出社」が大きな課題となりました。
          電子印鑑を導入すれば、場所を選ばず書類の承認・回覧が可能になり、
          業務効率が大幅に向上します。このガイドでは、電子印鑑の種類、法的効力、
          具体的な導入方法を網羅的に解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">電子印鑑の3つの種類</h2>
        <div className="overflow-x-auto not-prose">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">種類</th>
                <th className="text-left py-2 pr-4">仕組み</th>
                <th className="text-left py-2 pr-4">法的効力</th>
                <th className="text-left py-2 pr-4">コスト</th>
                <th className="text-left py-2">適した書類</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">印影画像</td>
                <td className="py-2 pr-4">PNG/SVG画像を貼り付け</td>
                <td className="py-2 pr-4">認印レベル</td>
                <td className="py-2 pr-4">無料</td>
                <td className="py-2">社内文書・請求書・見積書</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">電子署名（立会人型）</td>
                <td className="py-2 pr-4">サービス事業者が本人確認</td>
                <td className="py-2 pr-4">実印に近い</td>
                <td className="py-2 pr-4">月額¥1,000〜</td>
                <td className="py-2">契約書・NDA</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">電子署名（当事者型）</td>
                <td className="py-2 pr-4">マイナンバーカード等のPKI証明書</td>
                <td className="py-2 pr-4">実印と同等</td>
                <td className="py-2 pr-4">カード発行費</td>
                <td className="py-2">公的手続き・不動産契約</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">印影画像の作成方法</h2>
        <p className="text-muted-foreground leading-relaxed">
          社内文書や請求書レベルであれば、印影画像（PNG/SVG）で十分です。
          <Link href="/digital-stamp" className="text-primary hover:underline">
            tools24.jpの電子印鑑作成ツール
          </Link>
          を使えば、名前を入力するだけで丸印・角印・日付印を無料で作成できます。
        </p>
        <div className="space-y-4 not-prose mt-4">
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="font-semibold text-foreground">印鑑の種類を選択</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              個人名なら「丸印」、会社名なら「角印」、承認フローなら「日付印」を選びます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="font-semibold text-foreground">名前を入力してカスタマイズ</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              フォント・サイズ・色（朱色がデフォルト）を調整。プレビューで確認しながら微調整できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="font-semibold text-foreground">透過PNGまたはSVGでダウンロード</h3>
            </div>
            <p className="text-muted-foreground text-sm ml-11">
              Word/Excel/PDFへの貼り付けにはPNG、Webサイト用にはSVGがおすすめです。
              透過画像なので書類のテキストの上に自然に重なります。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">各ソフトへの貼り付け方法</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Microsoft Word</h3>
            <ol className="text-muted-foreground text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>「挿入」→「画像」→「このデバイス」からPNGファイルを選択</li>
              <li>画像を右クリック →「文字列の折り返し」→「前面」を選択</li>
              <li>画像をドラッグして押印位置に移動</li>
              <li>角のハンドルで適切なサイズに調整</li>
            </ol>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Microsoft Excel</h3>
            <ol className="text-muted-foreground text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>「挿入」→「画像」→「このデバイス」からPNGファイルを選択</li>
              <li>画像を右クリック →「サイズとプロパティ」で位置を固定</li>
              <li>「セルに合わせて移動やサイズ変更をしない」を選択すると安定します</li>
            </ol>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Adobe Acrobat（PDF）</h3>
            <ol className="text-muted-foreground text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>「ツール」→「スタンプ」→「カスタムスタンプの作成」</li>
              <li>ダウンロードしたPNG画像を選択してスタンプとして登録</li>
              <li>PDFの任意の場所にクリックして配置</li>
            </ol>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Google ドキュメント / スプレッドシート</h3>
            <ol className="text-muted-foreground text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>「挿入」→「画像」→「パソコンからアップロード」</li>
              <li>画像オプションで「テキストの前面」を選択</li>
              <li>画像をドラッグして適切な位置に配置</li>
            </ol>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">電子印鑑導入のメリット</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">ハンコ出社の廃止</strong> — 場所を選ばず押印できるため、
            テレワーク環境でも書類の承認フローが滞りません
          </li>
          <li>
            <strong className="text-foreground">承認時間の短縮</strong> — 紙の回覧では数日かかる承認フローが、
            メールやチャットツールで即座に完了します
          </li>
          <li>
            <strong className="text-foreground">印刷・郵送コストの削減</strong> — 書類を印刷して押印して
            スキャンして送る…というアナログな工程が不要になります
          </li>
          <li>
            <strong className="text-foreground">ペーパーレス化の推進</strong> — 電子帳簿保存法への対応と合わせて、
            社内のペーパーレス化を進める第一歩になります
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">セキュリティ上の注意点</h2>
        <div className="space-y-4 not-prose">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">注意事項</p>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
              <li>印影画像はコピーが容易 — 重要な文書にはパスワード保護PDFと併用</li>
              <li>印影画像はローカルに保管 — 共有フォルダに置くと不正使用のリスクあり</li>
              <li>契約書レベルには電子署名サービスを — DocuSign、クラウドサイン、GMOサイン等</li>
              <li>日付印を使う — 日付入りの印影は不正使用を抑止する効果があります</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">まとめ</h2>
        <p className="text-muted-foreground leading-relaxed">
          電子印鑑は、テレワーク環境での業務効率化に欠かせないツールです。
          社内文書・請求書レベルの押印であれば、
          <Link href="/digital-stamp" className="text-primary hover:underline">
            tools24.jpの電子印鑑作成ツール
          </Link>
          で無料作成した印影画像で十分に対応できます。
          契約書などの重要文書には電子署名サービスを、
          電子帳簿保存法への対応が必要な場合はタイムスタンプ付きのソリューションを検討してください。
        </p>
        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li><Link href="/guide/kakutei-beginners" className="text-primary hover:underline">確定申告の始め方 完全ガイド</Link> — 電子申告で使う書類の押印について</li>
          <li><Link href="/guide/zenkaku-hankaku-guide" className="text-primary hover:underline">全角・半角変換の基礎知識</Link> — 業務書類のデータ標準化のノウハウ</li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateGuides['/guide/digital-stamp-remote']} />
    </>
  );
}
