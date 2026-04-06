import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { WarekiConverter } from "@/components/wareki-converter/wareki-converter";
import { RelatedTools } from "@/components/common/related-tools";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
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
    locale === "ja" ? `${baseUrl}/wareki-converter` : `${baseUrl}/en/wareki-converter`;

  return {
    title: t("warekiConverter.title"),
    description: t("warekiConverter.description"),
    alternates: {
      canonical: toolUrl,
      languages: {
        ja: `${baseUrl}/wareki-converter`,
        en: `${baseUrl}/en/wareki-converter`,
        "x-default": `${baseUrl}/wareki-converter`,
      },
    },
    openGraph: {
      title: t("warekiConverter.title"),
      description: t("warekiConverter.description"),
      url: toolUrl,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function WarekiConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "tools" });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <Breadcrumb items={[{ label: tTools("wareki-converter.title") }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{tTools("wareki-converter.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {tTools("wareki-converter.description")}
        </p>
      </div>

      {locale === "en" && (
        <CulturalContext text="Japan uses a unique calendar system based on imperial eras (元号, gengō). The current era is Reiwa (令和), which began on May 1, 2019. Previous eras include Heisei (平成), Showa (昭和), Taisho (大正), and Meiji (明治). Era-based dates appear on government forms, contracts, ID cards, and official documents throughout Japan." />
      )}

      <WarekiConverter />

      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      <RelatedTools currentPath="/wareki-converter" />

      {/* SEO content (JA) */}
      <section className="mt-12 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">和暦とは</h2>
          <p>
            和暦とは、日本固有の紀年法で、天皇の即位に伴って改元される元号（年号）を用いた年の数え方です。
            現行の元号は「令和」で、2019年（令和元年）5月1日に始まりました。
            和暦は公文書・銀行書類・運転免許証・保険証など、日本の公式書類で現在も広く使用されています。
            一方、インターネットやプログラミングでは西暦（グレゴリオ暦）やUNIXタイムスタンプ、ISO 8601が標準です。
            当ツールはこれらを瞬時に相互変換できます。
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">使い方</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>変換したい日付の形式をタブで選択（和暦 / 西暦 / UNIX / ISO 8601）</li>
            <li>日付を入力して「変換」をクリック</li>
            <li>和暦・西暦・UNIX時間・ISO 8601が一括表示される</li>
            <li>必要な形式の「コピー」ボタンでクリップボードに取得</li>
          </ol>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">元号の境界について</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground">境界</th>
                  <th className="px-3 py-2 border font-medium text-foreground">詳細</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["平成 → 令和", "2019年（平成31年）4月30日まで平成。5月1日から令和元年。"],
                  ["昭和 → 平成", "1989年（昭和64年）1月7日まで昭和。1月8日から平成元年。"],
                  ["大正 → 昭和", "1926年（大正15年）12月24日まで大正。12月25日から昭和元年。"],
                  ["明治 → 大正", "1912年（明治45年）7月29日まで明治。7月30日から大正元年。"],
                  ["昭和64年", "1989年1月1日〜7日の7日間のみ存在。「昭和64年1月8日」は存在しない。"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b">
                    <td className="px-3 py-2 border font-medium text-foreground whitespace-nowrap">{k}</td>
                    <td className="px-3 py-2 border">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">よくある質問（FAQ）</h2>
          <div className="space-y-3">
            {[
              {
                q: "令和は何年から？",
                a: "令和は2019年（令和元年）5月1日から始まりました。「元年」は1年目を意味し、令和元年 = 2019年です。",
              },
              {
                q: "平成は何年まで？",
                a: "平成は2019年（平成31年）4月30日までです。翌5月1日から令和に改元されました。",
              },
              {
                q: "昭和64年は存在する？",
                a: "はい。昭和64年は1989年1月1日〜1月7日の7日間だけ存在します。1月8日からは平成元年です。",
              },
              {
                q: "大正と昭和の境目は？",
                a: "大正15年12月25日 = 昭和元年12月25日（同じ日です）。大正天皇が崩御した日に昭和に改元されました。",
              },
              {
                q: "UNIXタイムスタンプとは？",
                a: "1970年1月1日00:00:00 UTC（Unix epoch）からの経過秒数です。10桁が秒、13桁がミリ秒です。プログラムでの日時処理に広く使われます。",
              },
              {
                q: "データはサーバーに送信されますか？",
                a: "いいえ、全てブラウザ内で処理されます。入力した日付は外部に一切送信されません。",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="border rounded-lg group" open={i === 0}>
                <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none text-foreground">
                  <span>Q. {q}</span>
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-3 border-t pt-3">A. {a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
