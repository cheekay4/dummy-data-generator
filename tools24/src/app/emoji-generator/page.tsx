import type { Metadata } from "next";
import { EmojiGeneratorMain } from "@/components/emoji-generator/emoji-generator-main";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title:
    "Slack絵文字ジェネレーター - カスタム絵文字を無料作成 | tools24.jp",
  description:
    "テキストや画像からSlackカスタム絵文字をブラウザだけで作成。影・縁取り・グラデーション・アニメーションGIF対応。128×128px、128KB以下に自動調整。",
  keywords:
    "slack 絵文字 作成, slack カスタム絵文字, slack emoji generator, 絵文字 ジェネレーター, slack 絵文字 ツール",
  alternates: { canonical: "/emoji-generator" },
  openGraph: {
    title:
      "Slack絵文字ジェネレーター - カスタム絵文字を無料作成 | tools24.jp",
    description:
      "テキストや画像からSlackカスタム絵文字をブラウザだけで作成。影・縁取り・グラデーション・アニメーションGIF対応。",
    url: "https://tools24.jp/emoji-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Slack絵文字ジェネレーター",
  description:
    "テキストや画像からSlackカスタム絵文字を作成。影・縁取り・グラデーション・アニメーションGIF対応。",
  url: "https://tools24.jp/emoji-generator",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function EmojiGeneratorPage(): React.ReactElement {
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

        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: "Slack絵文字ジェネレーター" }]} />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Slack絵文字ジェネレーター
            </h1>
            <p className="text-muted-foreground">
              テキスト・画像からSlackカスタム絵文字を秒速で作成。影・縁取り・アニメーション対応。
              全ての処理はブラウザ内で完結し、画像はサーバーに送信されません。
            </p>
          </div>

          <EmojiGeneratorMain />

          <div className="flex justify-center my-8">
            <AdPlaceholder position="content" />
          </div>

          <section className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-3">
              Slackカスタム絵文字の仕様
            </h2>
            <div className="overflow-x-auto not-prose mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-3 py-2 text-left">項目</th>
                    <th className="border px-3 py-2 text-left">仕様</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-3 py-2">サイズ</td>
                    <td className="border px-3 py-2">128×128px（正方形）</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">ファイル形式</td>
                    <td className="border px-3 py-2">
                      PNG（静止画）/ GIF（アニメーション）
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">最大ファイルサイズ</td>
                    <td className="border px-3 py-2">128KB</td>
                  </tr>
                  <tr>
                    <td className="border px-3 py-2">背景</td>
                    <td className="border px-3 py-2">透過対応</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mb-3">主な機能</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mb-6">
              {[
                {
                  title: "テキストから絵文字",
                  desc: "日本語フォント5種・グラデーション・縁取り・影に対応。",
                },
                {
                  title: "画像から絵文字",
                  desc: "ドラッグ&ドロップで画像を取り込み、正方形クロップ・背景除去。",
                },
                {
                  title: "アニメーションGIF",
                  desc: "バウンス・回転・点滅など6種のアニメーションをワンクリックで生成。",
                },
                {
                  title: "128KB自動最適化",
                  desc: "Slack上限を超える場合、品質を自動調整して128KB以下に圧縮。",
                },
                {
                  title: "透過背景",
                  desc: "透過PNGで出力。Slackのライト/ダーク両モードで綺麗に表示。",
                },
                {
                  title: "ブラウザ完結",
                  desc: "画像はサーバーに送信されません。プライバシーを最大限保護。",
                },
              ].map((f) => (
                <div key={f.title} className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">よくある質問</h2>
            <div className="space-y-3 not-prose">
              {[
                {
                  q: "作成した絵文字はSlackにそのままアップロードできますか？",
                  a: "はい。128×128pxのPNG/GIFで128KB以下のため、SlackのカスタムEmoji（スタンプ）にそのまま追加できます。Slackの設定 → Customize Workspace → Add Custom Emoji からアップロードしてください。",
                },
                {
                  q: "画像はサーバーにアップロードされますか？",
                  a: "いいえ。アップロードされた画像・テキスト・生成された絵文字は全てブラウザ内で処理され、外部サーバーに送信されることはありません。",
                },
                {
                  q: "アニメーションGIFのファイルサイズが大きくなる場合は？",
                  a: "フレーム数を減らす、シンプルなアニメーション種類（点滅・シェイク）を選ぶ、文字数や画像の色数を減らすことで小さくできます。",
                },
                {
                  q: "DiscordやTeamsの絵文字にも使えますか？",
                  a: "Discordは256KBまでPNG/GIFに対応するため、生成した絵文字をそのまま使えます。Teamsも同様の仕様で利用可能です。",
                },
                {
                  q: "対応している入力画像形式は？",
                  a: "PNG / JPG / JPEG / GIF / WebP / SVG に対応しています。",
                },
              ].map((faq, i) => (
                <details key={i} className="border rounded-md">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-muted/50">
                    {faq.q}
                  </summary>
                  <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
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
