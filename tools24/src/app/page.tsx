import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { SearchBox } from "@/components/home/search-box";
import { PopularTools } from "@/components/home/popular-tools";
import { HomeClient } from "@/components/home/home-client";

export const metadata: Metadata = {
  title: "tools24.jp — 登録不要・無料のオンラインツール集",
  description:
    "JSON整形、画像圧縮、文字数カウント、ふりがな変換、ダミーデータ生成など、便利なオンラインツールが全て無料・ブラウザ完結で使えます。データ送信なし。",
  openGraph: {
    title: "tools24.jp — 登録不要・無料のオンラインツール集",
    description:
      "JSON整形、画像圧縮、文字数カウント、ふりがな変換、ダミーデータ生成など、便利なオンラインツールが全て無料・ブラウザ完結で使えます。",
    url: "https://tools24.jp",
  },
};

export default function HomePage(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 広告 */}
      <div className="flex justify-center mb-8">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-2xl font-medium sm:text-3xl">tools24.jp</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            登録不要・無料のオンラインツール集。
            <br className="sm:hidden" />
            入力データはすべてブラウザ内で処理。外部送信なし。
          </p>
        </header>

        {/* Search */}
        <SearchBox />

        {/* Popular Tools */}
        <PopularTools />

        {/* Category Navigation + Tool Lists */}
        <HomeClient />
      </div>

      {/* Footer SEO text */}
      <div className="mx-auto mt-16 max-w-3xl">
        <p className="text-xs leading-relaxed text-muted-foreground">
          tools24.jp
          は、開発者・ビジネスユーザー向けの無料オンラインツール集です。JSON整形、画像圧縮、文字数カウント、正規表現テスト、ダミーデータ生成など、日常業務で使えるツールを提供しています。すべてのツールはブラウザ内で完結し、データがサーバーに送信されることはありません。
        </p>
      </div>

      {/* 広告 */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="bottom-rect" width={336} height={280} />
      </div>
    </div>
  );
}
