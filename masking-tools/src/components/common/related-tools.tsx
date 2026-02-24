import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RELATED_TOOLS = [
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

export function RelatedTools() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold mb-4">その他の便利ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RELATED_TOOLS.map((tool) => (
          <Card key={tool.href} className={tool.status === "coming-soon" ? "opacity-70" : ""}>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{tool.title}</p>
                {tool.status === "coming-soon" && (
                  <Badge variant="secondary" className="text-xs">近日公開</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{tool.description}</p>
              {tool.status === "live" ? (
                <Link href={tool.href} className="text-xs text-primary hover:underline">
                  使ってみる →
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">準備中</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
