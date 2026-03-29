import Link from "next/link";
import { LayoutGrid, Image, Braces, Type } from "lucide-react";

const popularTools = [
  { title: "ダミーデータ生成", href: "/dummy-data-generator", icon: LayoutGrid },
  { title: "画像圧縮・リサイズ", href: "/image-compressor", icon: Image },
  { title: "JSON整形ツール", href: "/json-formatter", icon: Braces },
  { title: "文字数カウンター", href: "/character-counter", icon: Type },
] as const;

export function PopularTools(): React.ReactElement {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        よく使われているツール
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {popularTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3 text-sm font-medium transition-colors hover:border-primary/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {tool.title}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
