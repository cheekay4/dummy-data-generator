import { getTranslations } from "next-intl/server";
import { CharacterCounter } from "@/components/character-counter/character-counter";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { RelatedTools } from "@/components/common/related-tools";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const toolUrl =
    locale === "ja" ? `${baseUrl}/character-counter` : `${baseUrl}/en/character-counter`;

  return {
    title: t("characterCounter.title"),
    description: t("characterCounter.description"),
    alternates: {
      canonical: toolUrl,
      languages: {
        ja: `${baseUrl}/character-counter`,
        en: `${baseUrl}/en/character-counter`,
        "x-default": `${baseUrl}/character-counter`,
      },
    },
    openGraph: {
      title: t("characterCounter.title"),
      description: t("characterCounter.description"),
      url: toolUrl,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function CharacterCounterPage({
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

      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: tTools("character-counter.title") }]} />

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{tTools("character-counter.title")}</h1>
          <p className="text-muted-foreground">
            {tTools("character-counter.description")}
          </p>
        </div>

        <CharacterCounter />

        <div className="flex justify-center my-8">
          <AdPlaceholder slot="middle-rect" width={336} height={280} />
        </div>

        {/* SEO content (JA) */}
        <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
          <h2 className="text-xl font-semibold mb-3">文字数カウンターとは</h2>
          <p className="text-sm text-muted-foreground mb-6">
            文字数カウンターは、入力されたテキストの文字数、単語数、行数をリアルタイムで計測するツールです。
            スペースを含む文字数・含まない文字数の両方を表示し、日本語テキストではひらがな・カタカナ・漢字・英数字・記号の内訳も確認できます。
            SNS投稿の文字数制限チェックや、レポート・論文の文字数管理に最適です。
          </p>

          <h2 className="text-xl font-semibold mb-3">主な機能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-6">
            {[
              { title: "リアルタイム計測", desc: "入力と同時に文字数・単語数・行数を即座に表示。コピペにも対応。" },
              { title: "日本語文字種別の内訳", desc: "ひらがな・カタカナ・漢字・英数字・記号の割合をグラフで可視化。" },
              { title: "Twitter文字数チェック", desc: "全角2文字・半角1文字のTwitterルールに基づく残り文字数を表示。超過時は赤く警告。" },
              { title: "原稿用紙換算", desc: "400字詰め原稿用紙で何枚分かを自動計算。レポートや作文の目安に。" },
              { title: "バイト数表示", desc: "UTF-8エンコードでのバイト数を表示。データベースやAPIの容量制限チェックに。" },
              { title: "ブラウザ完結", desc: "全ての処理はブラウザ内で完結。テキストデータがサーバーに送信されることはありません。" },
            ].map((feature) => (
              <div key={feature.title} className="border rounded-md p-3">
                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
          <div className="space-y-3 not-prose">
            {[
              {
                q: "全角と半角で文字数は変わりますか？",
                a: "文字数カウントでは全角・半角ともに1文字として数えます。ただし、Twitter文字数では全角は2文字、半角は1文字として計算されます。バイト数はUTF-8基準で、日本語1文字は通常3バイトです。",
              },
              {
                q: "スペースや改行は文字数に含まれますか？",
                a: "「スペース含む」の文字数にはスペース・改行が含まれます。「スペースなし」では全ての空白文字（半角スペース、全角スペース、タブ、改行）を除外して数えます。",
              },
              {
                q: "入力したテキストはサーバーに送信されますか？",
                a: "いいえ。全ての処理はお使いのブラウザ内で完結しています。テキストデータが外部に送信されることは一切ありません。",
              },
              {
                q: "原稿用紙の枚数はどう計算されますか？",
                a: "スペースを除いた文字数を400で割り、切り上げた値を表示しています。一般的な400字詰め原稿用紙の枚数に相当します。",
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

        <RelatedTools currentPath="/character-counter" />
      </div>

      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="bottom-rect" width={336} height={280} />
      </div>
    </div>
  );
}
