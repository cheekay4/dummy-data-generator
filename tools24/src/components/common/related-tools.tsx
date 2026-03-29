import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { allTools, type ToolDef } from "@/lib/tools-config";

interface RelatedToolsProps {
  currentPath?: string;
}

export function RelatedTools({ currentPath }: RelatedToolsProps): React.ReactElement {
  const tools = allTools
    .filter(
      (t) =>
        t.category === "tools" &&
        t.status === "live" &&
        !t.external &&
        t.href !== currentPath
    )
    .slice(0, 8);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">その他の便利ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: ToolDef }): React.ReactElement {
  const Icon = tool.icon;

  return (
    <Link href={tool.href}>
      <Card className="transition-colors hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{tool.title}</CardTitle>
          <CardDescription className="text-sm">{tool.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
