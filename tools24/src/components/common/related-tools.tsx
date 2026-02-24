import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  status: "live" | "coming-soon";
}

interface RelatedToolsProps {
  currentPath?: string;
  tools?: Tool[];
}

const defaultTools: Tool[] = [
  {
    title: "文字数カウンター",
    description: "文字数・単語数・行数をリアルタイムカウント",
    href: "/character-counter",
    icon: "📝",
    status: "live",
  },
  {
    title: "正規表現テスター",
    description: "正規表現をリアルタイムでテスト・解説",
    href: "/regex-tester",
    icon: "/.*/",
    status: "live",
  },
  {
    title: "ダミーデータ生成",
    description: "日本のリアルなテストデータを瞬時に生成",
    href: "/dummy-data-generator",
    icon: "🗂️",
    status: "live",
  },
  {
    title: "Cron式ビルダー",
    description: "Cron式を日本語で組み立て・解説",
    href: "/cron-expression-builder",
    icon: "⏰",
    status: "live",
  },
  {
    title: "和暦・西暦変換",
    description: "令和・平成・昭和↔西暦・UNIX時間を一括変換",
    href: "/wareki-converter",
    icon: "📅",
    status: "live",
  },
  {
    title: "エンコード・デコード",
    description: "Base64・URL・JWT・ハッシュ・Unicode変換",
    href: "/encode-decode",
    icon: "🔐",
    status: "live",
  },
];

export function RelatedTools({ currentPath, tools = defaultTools }: RelatedToolsProps) {
  const filtered = tools.filter((t) => t.href !== currentPath);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">その他の便利ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const isComingSoon = tool.status === "coming-soon";

  const card = (
    <Card
      className={`transition-colors ${
        isComingSoon
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-primary/50 hover:shadow-sm cursor-pointer"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl" role="img" aria-hidden>
            {tool.icon}
          </span>
          {isComingSoon && (
            <Badge variant="secondary" className="text-xs shrink-0">
              近日公開
            </Badge>
          )}
        </div>
        <CardTitle className="text-base">{tool.title}</CardTitle>
        <CardDescription className="text-sm">{tool.description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (isComingSoon) {
    return <div>{card}</div>;
  }

  return <Link href={tool.href}>{card}</Link>;
}
