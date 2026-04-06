"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface RelatedTool {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  external?: boolean;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
}

export function RelatedTools({
  tools,
  title = "このツールを使った方はこちらも",
}: RelatedToolsProps): React.ReactElement {
  if (tools.length === 0) return <></>;

  return (
    <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 mt-8">
      <p className="text-sm font-medium text-muted-foreground mb-4">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              target={tool.external ? "_blank" : undefined}
              className="flex items-center gap-3 rounded-xl border border-[var(--surface-border)] px-3 py-3 transition-colors hover:border-[var(--surface-border-hover)] hover:bg-[var(--surface-hover)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{tool.title}</p>
                <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
