import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQSection } from '@/components/common/faq-section';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import DigitalStampMain from '@/components/digital-stamp/digital-stamp-main';
import { affiliateWebTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: '電子印鑑作成ツール — 無料でデジタル印影画像を生成 | tools24.jp',
  description:
    '名前を入力するだけで電子印鑑（デジタル印影）を無料作成。丸印・角印・日付印に対応。透過PNG/SVGでダウンロード可能。全てブラウザ内で処理、データは送信されません。',
  alternates: { canonical: '/digital-stamp' },
};

const faqs = [
  {
    question: '法的に有効ですか？',
    answer:
      '電子印鑑（印影画像）は認印レベルの効力があり、社内文書・請求書・見積書・納品書などでの使用に適しています。契約書等の法的文書には電子署名サービス（DocuSign・クラウドサイン等）の利用を推奨します。',
  },
  {
    question: '無料で使えますか？',
    answer: 'はい、完全無料で回数制限もありません。丸印・角印・日付印の全種類を何度でも作成できます。',
  },
  {
    question: '作成した印影データは保存されますか？',
    answer: 'いいえ、全てブラウザ内で処理されます。サーバーへのデータ送信は一切なく、ブラウザを閉じるとデータは消えます。個人名や会社名が外部に漏れる心配はありません。',
  },
  {
    question: '透過PNGとは？',
    answer:
      '背景が透明な画像形式です。Word/Excel/PDFに貼り付けた際に背景が白くならず、自然に書類のテキストの上に重なります。通常のJPGやスクリーンショットでは背景が白く残ってしまうため、印鑑画像には透過PNGが最適です。',
  },
  {
    question: 'SVGとPNGのどちらをダウンロードすべきですか？',
    answer:
      'Word/Excel/PDFへの貼り付けにはPNGが最も互換性が高く安心です。SVGはWebサイトでの利用や、拡大・縮小しても劣化しないベクター形式が必要な場合に便利です。迷ったらPNGを選んでください。',
  },
  {
    question: 'どのサイズで作るのがよいですか？',
    answer:
      '丸印は直径10〜12mm、角印は18〜21mm角が一般的です。このツールではデフォルトで標準的なサイズが設定されていますが、用途に応じてカスタマイズも可能です。',
  },
  {
    question: '印影の色は変更できますか？',
    answer:
      'はい、朱色（赤）が最も一般的ですが、黒・青・カスタムカラーにも変更できます。社内規定に合わせてお選びください。',
  },
  {
    question: 'スマートフォンでも使えますか？',
    answer: 'はい、スマートフォン・タブレット・PCの全デバイスに対応しています。作成した印影はそのままダウンロードして、メールに添付したり他のアプリで使用できます。',
  },
];

export default function DigitalStampPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "電子印鑑作成ツール",
            url: "https://tools24.jp/digital-stamp",
            description:
              "名前を入力するだけで電子印鑑（デジタル印影）を無料作成。丸印・角印・日付印に対応。透過PNG/SVGでダウンロード可能。全てブラウザ内で処理、データは送信されません。",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: 'ホーム', href: '/' },
          { label: '電子印鑑作成ツール' },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">電子印鑑作成ツール</h1>
      <p className="text-muted-foreground mb-6">
        名前を入力するだけで印影画像を無料作成。透過PNG・SVGでダウンロード。
      </p>
      <AdPlaceholder position="header" className="mb-6" />

      <DigitalStampMain />

      {/* 教育コンテンツ */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">電子印鑑（デジタル印影）とは</h2>
        <p className="text-muted-foreground leading-relaxed">
          電子印鑑とは、紙の書類に押す印鑑の代わりに、デジタル文書上で使用する印影画像のことです。
          テレワークの普及に伴い、PDFやWord文書に直接貼り付けられる電子印鑑のニーズが急増しています。
          物理的な印鑑と異なり、場所を選ばず押印できるため、書類の回覧・承認フローを大幅に効率化できます。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">電子印鑑の種類と使い分け</h2>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">種類</th>
                <th className="text-left py-2 pr-4">特徴</th>
                <th className="text-left py-2 pr-4">用途</th>
                <th className="text-left py-2">法的効力</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">印影画像（このツール）</td>
                <td className="py-2 pr-4">PNG/SVG画像として作成</td>
                <td className="py-2 pr-4">社内文書・請求書・見積書</td>
                <td className="py-2">認印レベル</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">電子署名付き</td>
                <td className="py-2 pr-4">PKI証明書で本人証明</td>
                <td className="py-2 pr-4">契約書・公的手続き</td>
                <td className="py-2">実印レベル</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">タイムスタンプ付き</td>
                <td className="py-2 pr-4">時刻証明を付加</td>
                <td className="py-2 pr-4">電子帳簿保存法対応</td>
                <td className="py-2">確定日付</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">印影の形式と選び方</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">丸印（認印・個人名）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              最も一般的な形式。個人名を縦書きで配置します。日常的な書類の確認・承認に使用されます。
              直径は9〜12mm程度が標準的です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">角印（会社名・部署名）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              会社名や部署名を入れる場合に使用します。請求書・見積書・納品書など、
              会社として発行する書類に押印するのが一般的です。正方形で21mm角程度が標準です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">日付印（データ印）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              日付・部署名・個人名を組み合わせた印鑑です。書類の受領日や確認日を記録する用途で使われ、
              社内の回覧・承認フローで特に重宝します。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">電子印鑑の貼り付け方</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Word / Excel の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              「挿入」→「画像」からダウンロードした透過PNG画像を選択。
              画像を右クリック →「文字列の折り返し」→「前面」に設定すると、
              テキストの上に自然に配置できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">PDF の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Adobe Acrobat の場合：「ツール」→「スタンプ」→「カスタムスタンプ」で印影画像を登録。
              無料ツールでは、PDFを画像化してから印影を合成する方法もあります。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">Google ドキュメント の場合</h3>
            <p className="text-muted-foreground text-sm mt-1">
              「挿入」→「画像」→「パソコンからアップロード」で透過PNGを配置。
              画像オプションで「テキストの前面」を選択すれば、文書上の好きな位置に配置できます。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">よくある注意点</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">印影画像は認印レベル</strong> — 契約書など法的に重要な文書には、
            電子署名サービス（DocuSign・クラウドサイン等）の利用を推奨します
          </li>
          <li>
            <strong className="text-foreground">透過PNGを使う</strong> — 背景が白い画像だと書類のテキストが隠れてしまいます。
            このツールは透過PNG・SVGで出力するため、書類に自然に重なります
          </li>
          <li>
            <strong className="text-foreground">セキュリティ</strong> — 印影画像はコピーが容易なため、
            重要な文書には使い回しを避け、パスワード保護されたPDFと組み合わせることを推奨します
          </li>
        </ul>
      </section>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
      <AffiliateTextLink {...affiliateWebTools['/digital-stamp']} />
    </>
  );
}
