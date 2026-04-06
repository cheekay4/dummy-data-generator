import type { Metadata } from "next";
import { FuriganaConverterMain } from "@/components/furigana-converter/furigana-converter-main";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "ふりがな変換 — 漢字にふりがなを自動付与 | tools24.jp",
  description:
    "漢字テキストにふりがなを自動付与。ひらがな・カタカナ・ローマ字変換に対応。日本語学習、テキスト校正、読み上げ原稿作成に。登録不要・無料・ブラウザ内で完結。",
  openGraph: {
    title: "ふりがな変換 — 漢字にふりがなを自動付与 | tools24.jp",
    description:
      "漢字テキストにふりがなを自動付与。ひらがな・カタカナ・ローマ字変換に対応。日本語学習、テキスト校正、読み上げ原稿作成に。登録不要・無料・ブラウザ内で完結。",
    url: "https://tools24.jp/furigana-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ふりがな変換",
  description:
    "漢字テキストにふりがなを自動付与。ひらがな・カタカナ・ローマ字変換に対応。ブラウザ内で完結。",
  url: "https://tools24.jp/furigana-converter",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function FuriganaConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <AdPlaceholder position="header" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[{ label: "ふりがな変換" }]}
          />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">ふりがな変換</h1>
            <p className="text-muted-foreground">
              漢字にふりがなを付与。ひらがな・カタカナ・ローマ字に変換
            </p>
          </div>

          <FuriganaConverterMain />

          <div className="flex justify-center my-8">
            <AdPlaceholder position="content" />
          </div>

          {/* SEO コンテンツ */}
          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">ふりがな変換とは</h2>
            <p className="text-sm text-muted-foreground mb-6">
              ふりがな変換は、漢字を含む日本語テキストに読み仮名（ふりがな）を自動的に付与するツールです。
              形態素解析エンジン（kuromoji）を使用してテキストを解析し、漢字の読みを正確に判定します。
              すべての処理はブラウザ内で完結するため、入力テキストがサーバーに送信されることはありません。
            </p>

            <h2 className="text-xl font-semibold mb-3">主な機能</h2>
            <div className="not-prose mb-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span><strong>ひらがな変換</strong> — 漢字の読みをひらがなに変換します</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span><strong>カタカナ変換</strong> — 漢字の読みをカタカナに変換します</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span><strong>ローマ字変換</strong> — 漢字の読みをローマ字（ヘボン式）に変換します</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span><strong>ふりがな付き表示</strong> — 漢字の後ろに括弧付きで読みを追加します</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">5.</span>
                  <span><strong>漢字のみ変換</strong> — ひらがな・カタカナはそのまま残し、漢字部分だけを変換します</span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mb-3">活用シーン</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-6">
              {[
                {
                  title: "日本語学習",
                  description:
                    "漢字が読めない学習者が、テキストの読み方を確認するのに便利です。教材作成にも活用できます。",
                },
                {
                  title: "読み上げ原稿の作成",
                  description:
                    "プレゼンやスピーチの原稿にふりがなを付けて、読み間違いを防止します。",
                },
                {
                  title: "データクリーニング",
                  description:
                    "氏名や住所データの読み仮名を一括生成。顧客データの整備に役立ちます。",
                },
              ].map((scene) => (
                <div key={scene.title} className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-1">{scene.title}</h3>
                  <p className="text-xs text-muted-foreground">{scene.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "読み仮名の精度はどのくらいですか？",
                  a: "形態素解析辞書（IPAdic）に基づいて解析するため、一般的な文章であれば高い精度で変換できます。ただし、固有名詞や当て字など、辞書に登録されていない読み方は正しく変換できない場合があります。",
                },
                {
                  q: "入力したテキストはサーバーに送信されますか？",
                  a: "いいえ。辞書データの読み込み後は、すべての変換処理がブラウザ内で完結します。テキストがサーバーに送信されることはありません。",
                },
                {
                  q: "長い文章も変換できますか？",
                  a: "はい。ブラウザのメモリが許す限り、長い文章でも変換可能です。ただし、非常に長い文章の場合は処理に時間がかかることがあります。",
                },
              ].map((faq, i) => (
                <details key={i} className="border rounded-md">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-muted/50">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>


        </div>

        <div className="flex justify-center mt-12">
          <AdPlaceholder position="content" />
        </div>
      </div>
    </>
  );
}
