import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "tools24.jp — 便利なWebツールを無料で",
  description:
    "個人情報マスキング、JSON整形、文字数カウント、敬語メール変換など、開発者・ビジネスパーソン向けの便利ツールが全て無料・ブラウザ完結で使えます。",
};

const tools = [
  {
    title: "個人情報マスキング",
    description: "テキストの個人情報を自動検出・マスク。ChatGPTに送る前に。",
    href: "/personal-data-masking",
    icon: "🔒",
    status: "live" as const,
  },
  {
    title: "文字数カウンター",
    description: "文字数・単語数・行数をリアルタイムカウント",
    href: "/character-counter",
    icon: "📝",
    status: "live" as const,
  },
  {
    title: "JSON整形ツール",
    description: "JSONの整形・圧縮・変換をブラウザだけで",
    href: "/json-formatter",
    icon: "{ }",
    status: "coming-soon" as const,
  },
  {
    title: "敬語メールアシスタント",
    description: "カジュアルな文をビジネス敬語メールに変換",
    href: "/keigo-email-writer",
    icon: "✉️",
    status: "coming-soon" as const,
  },
  {
    title: "ダミーデータ生成",
    description: "日本のリアルなテストデータを瞬時に生成",
    href: "/dummy-data-generator",
    icon: "🗂️",
    status: "coming-soon" as const,
  },
];

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">tools24.jp</h1>
        <p className="text-muted-foreground text-lg">便利なWebツールを無料で — 全てブラウザ完結</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card key={tool.href} className={`transition-shadow ${tool.status === "live" ? "hover:shadow-md cursor-pointer" : "opacity-70"}`}>
            <CardContent className="pt-6 pb-5">
              <div className="text-3xl mb-3">{tool.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold">{tool.title}</h2>
                {tool.status === "coming-soon" && (
                  <Badge variant="secondary" className="text-xs">近日公開</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              {tool.status === "live" ? (
                <Link href={tool.href} className="text-sm text-primary hover:underline font-medium">
                  使ってみる →
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">準備中</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
