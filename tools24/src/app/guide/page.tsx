import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "ガイド記事 — 確定申告・Web開発・業務効率化のノウハウ | tools24.jp",
  description:
    "確定申告の始め方、CSV文字化けの直し方、WebP画像でSEO改善、JSON整形でAPIデバッグ、電子印鑑でテレワーク効率化など、実務に役立つガイド記事を無料公開。",
  alternates: { canonical: "/guide" },
};

const articles = [
  {
    title: "【2026年版】確定申告の始め方 完全ガイド",
    href: "/guide/kakutei-beginners",
    description:
      "確定申告が初めての方向けに、必要な書類・手順・期限・よくある間違いをわかりやすく解説します。",
    badge: "確定申告",
    date: "2026-03-20",
  },
  {
    title: "ExcelのCSV文字化けを3秒で直す方法",
    href: "/guide/csv-mojibake",
    description:
      "UTF-8のCSVをExcelで開くと文字化けする原因と、BOM付きUTF-8による確実な解決策を図解付きで紹介。",
    badge: "文字化け",
    date: "2026-03-20",
  },
  {
    title: "WebP画像でサイト速度とSEOを改善する方法",
    href: "/guide/webp-seo",
    description:
      "WebPフォーマットの仕組み、導入手順、フォールバック設定、Core Web Vitalsへの効果を実データで解説。",
    badge: "SEO",
    date: "2026-03-20",
  },
  {
    title: "JSON整形ツールでAPIデバッグを効率化する方法",
    href: "/guide/json-api-debug",
    description:
      "APIレスポンスの読み方、よくあるJSONエラーの原因と対処法、TypeScript型生成の活用テクニック。",
    badge: "開発",
    date: "2026-03-20",
  },
  {
    title: "テレワーク時代の電子印鑑 導入ガイド",
    href: "/guide/digital-stamp-remote",
    description:
      "電子印鑑の法的効力、種類の選び方、Word/Excel/PDFへの貼り付け方、セキュリティの注意点を網羅。",
    badge: "業務効率化",
    date: "2026-03-20",
  },
  {
    title: "【初心者向け】正規表現の基本と実践テクニック",
    href: "/guide/regex-beginners",
    description:
      "メタ文字・量指定子・アンカーの基礎からコピペで使えるパターン10選まで、正規表現を実践的に解説。",
    badge: "開発",
    date: "2026-03-29",
  },
  {
    title: "Cron式の書き方完全ガイド",
    href: "/guide/cron-guide",
    description:
      "Cron式の5フィールド・特殊文字・実用パターン15選を図解。クラウド環境やJST/UTCの注意点も。",
    badge: "開発",
    date: "2026-03-29",
  },
  {
    title: "Base64エンコードとは？仕組み・用途・変換方法",
    href: "/guide/base64-guide",
    description:
      "Base64の仕組み、JWT・Data URI・API認証での使われ方、URLセーフBase64との違いをわかりやすく解説。",
    badge: "開発",
    date: "2026-03-29",
  },
  {
    title: "テスト用ダミーデータの作り方",
    href: "/guide/dummy-data-testing",
    description:
      "個人情報保護の観点から本番データは使えない。日本語対応のテストデータを効率よく生成する方法を紹介。",
    badge: "開発",
    date: "2026-03-29",
  },
  {
    title: "全角・半角変換の基礎知識",
    href: "/guide/zenkaku-hankaku-guide",
    description:
      "全角半角の混在で起きる問題、Unicode正規化、Excel関数、プログラミングでの変換方法を網羅的に解説。",
    badge: "業務効率化",
    date: "2026-03-29",
  },
];

export default function GuidePage(): React.JSX.Element {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事" },
        ]}
      />

      <section className="text-center py-12 md:py-20">
        <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          ガイド記事
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          確定申告・Web開発・業務効率化に役立つ実践的なノウハウをお届けします
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.href} href={article.href}>
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{article.badge}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>
                  <p className="mt-3 text-sm text-primary flex items-center gap-1">
                    記事を読む <ChevronRight className="h-4 w-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AdPlaceholder position="content" className="mt-12" />
    </>
  );
}
