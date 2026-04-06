import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { allTools, type ToolDef } from "@/lib/tools-config";

interface RelatedToolsProps {
  currentPath?: string;
}

export async function RelatedTools({ currentPath }: RelatedToolsProps): Promise<React.ReactElement> {
  const t = await getTranslations("relatedTools");
  const tTools = await getTranslations("tools");

  const tools = allTools
    .filter(
      (tool) =>
        tool.category === "tools" &&
        tool.status === "live" &&
        !tool.external &&
        tool.href !== currentPath
    )
    .slice(0, 8);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">{t("heading")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} title={tTools(`${tool.id}.title`)} description={tTools(`${tool.id}.description`)} />
        ))}
      </div>
    </section>
  );
}

function ToolCard({ tool, title, description }: { tool: ToolDef; title: string; description: string }): React.ReactElement {
  const Icon = tool.icon;

  return (
    <Link href={tool.href}>
      <Card className="transition-colors hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
