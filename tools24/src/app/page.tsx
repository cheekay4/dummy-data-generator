import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "tools24.jp — 便利なWebツールを無料で",
  description:
    "JSON整形、文字数カウント、正規表現テスト、ダミーデータ生成など、開発者向けの便利ツールが全て無料・ブラウザ完結で使えます。",
  openGraph: {
    title: "tools24.jp — 便利なWebツールを無料で",
    description:
      "JSON整形、文字数カウント、正規表現テスト、ダミーデータ生成など、開発者向けの便利ツールが全て無料・ブラウザ完結で使えます。",
    url: "https://tools24.jp",
  },
};

const tools: { title: string; description: string; href: string; icon: string; status: "live" | "coming-soon" }[] = [
  {
    title: "JSON整形ツール",
    description: "JSONの整形・圧縮・変換をブラウザだけで",
    href: "/json-formatter",
    icon: "{ }",
    status: "live" as const,
  },
  {
    title: "文字数カウンター",
    description: "文字数・単語数・行数をリアルタイムカウント",
    href: "/character-counter",
    icon: "📝",
    status: "coming-soon" as const,
  },
  {
    title: "正規表現テスター",
    description: "正規表現をリアルタイムでテスト・解説",
    href: "/regex-tester",
    icon: "/.*/",
    status: "live" as const,
  },
  {
    title: "ダミーデータ生成",
    description: "日本のリアルなテストデータを瞬時に生成",
    href: "/dummy-data-generator",
    icon: "🗂️",
    status: "live" as const,
  },
  {
    title: "Cron式ビルダー",
    description: "Cron式を日本語で組み立て・解説",
    href: "/cron-expression-builder",
    icon: "⏰",
    status: "live" as const,
  },
  {
    title: "和暦・西暦変換",
    description: "令和・平成・昭和↔西暦・UNIX時間を一括変換",
    href: "/wareki-converter",
    icon: "📅",
    status: "live" as const,
  },
  {
    title: "エンコード・デコード",
    description: "Base64・URL・JWT・ハッシュ・Unicode変換",
    href: "/encode-decode",
    icon: "🔐",
    status: "live" as const,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 広告 */}
      <div className="flex justify-center mb-8">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">便利なWebツール</h1>
          <p className="text-muted-foreground">
            開発者向けの無料ツール集。全てブラウザで完結、データ送信なし。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const isComingSoon = tool.status === "coming-soon";
            const card = (
              <Card
                className={`h-full transition-colors ${
                  isComingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:border-primary/50 hover:shadow-sm cursor-pointer"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="text-3xl font-mono font-bold text-muted-foreground/70"
                      aria-hidden
                    >
                      {tool.icon}
                    </span>
                    {isComingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        近日公開
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            );

            if (isComingSoon) {
              return <div key={tool.href}>{card}</div>;
            }

            return (
              <Link key={tool.href} href={tool.href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 広告 */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="bottom-rect" width={336} height={280} />
      </div>
    </div>
  );
}
