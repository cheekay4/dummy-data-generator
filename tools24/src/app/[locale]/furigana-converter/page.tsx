import { getTranslations } from "next-intl/server";
import { FuriganaConverterMain } from "@/components/furigana-converter/furigana-converter-main";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { RelatedTools } from "@/components/common/related-tools";
import { CulturalContext } from "@/components/CulturalContext";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const toolUrl =
    locale === "ja" ? `${baseUrl}/furigana-converter` : `${baseUrl}/en/furigana-converter`;

  return {
    title: t("furiganaConverter.title"),
    description: t("furiganaConverter.description"),
    alternates: {
      canonical: toolUrl,
      languages: {
        ja: `${baseUrl}/furigana-converter`,
        en: `${baseUrl}/en/furigana-converter`,
        "x-default": `${baseUrl}/furigana-converter`,
      },
    },
    openGraph: {
      title: t("furiganaConverter.title"),
      description: t("furiganaConverter.description"),
      url: toolUrl,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function FuriganaConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "tools" });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: tTools("furigana-converter.title") }]} />

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{tTools("furigana-converter.title")}</h1>
          <p className="text-muted-foreground">
            {tTools("furigana-converter.description")}
          </p>
        </div>

        {locale === "en" && (
          <CulturalContext text="Furigana (振り仮名) are small phonetic characters printed above kanji to show the correct reading. This tool automatically adds furigana to Japanese text — essential for Japanese language learners, document editing, and creating accessible reading materials." />
        )}

        <FuriganaConverterMain />

        <div className="flex justify-center my-8">
          <AdPlaceholder slot="middle-rect" width={336} height={280} />
        </div>

        {/* SEO content (JA) */}
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

        <RelatedTools currentPath="/furigana-converter" />
      </div>

      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="bottom-rect" width={336} height={280} />
      </div>
    </div>
  );
}
