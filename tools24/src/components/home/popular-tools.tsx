import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LayoutGrid, Image, Braces, Type } from "lucide-react";

const popularToolIds = [
  { id: "dummy-data-generator", href: "/dummy-data-generator", icon: LayoutGrid },
  { id: "image-compressor", href: "/image-compressor", icon: Image },
  { id: "json-formatter", href: "/json-formatter", icon: Braces },
  { id: "character-counter", href: "/character-counter", icon: Type },
] as const;

export async function PopularTools(): Promise<React.ReactElement> {
  const t = await getTranslations("home");
  const tTools = await getTranslations("tools");

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        {t("popularLabel")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {popularToolIds.map((tool) => {
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
              {tTools(`${tool.id}.title`)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
