"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type ToolDef } from "@/lib/tools-config";
import { Badge } from "@/components/ui/badge";

interface CategorySectionProps {
  title: string;
  tools: ToolDef[];
  subgroups?: { label: string; filter: string }[];
  iconBg: string;
  defaultShow?: number;
}

export function CategorySection({
  title,
  tools,
  subgroups,
  iconBg,
  defaultShow = 3,
}: CategorySectionProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  const renderToolRow = (tool: ToolDef): React.ReactElement => {
    const Icon = tool.icon;
    const isComingSoon = tool.status === "coming-soon";

    const content = (
      <div
        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
          isComingSoon
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary/50 cursor-pointer"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium">{tool.title}</span>
          <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
            {tool.description}
          </span>
        </div>
        {isComingSoon ? (
          <Badge variant="secondary" className="shrink-0 text-xs">
            近日公開
          </Badge>
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>
    );

    if (isComingSoon) {
      return <div key={tool.id}>{content}</div>;
    }

    return (
      <Link
        key={tool.id}
        href={tool.href}
        target={tool.external ? "_blank" : undefined}
        rel={tool.external ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </Link>
    );
  };

  const visibleTools = expanded ? tools : tools.slice(0, defaultShow);
  const hasMore = tools.length > defaultShow;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-medium">
          {title}
          <span className="ml-1.5 text-xs text-muted-foreground">
            ({tools.length})
          </span>
        </h3>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? "折りたたむ" : "すべて見る"}
          </button>
        )}
      </div>

      {subgroups ? (
        <div className="space-y-4">
          {subgroups.map((sg) => {
            const groupTools = tools.filter((t) => t.subgroup === sg.filter);
            const visibleGroupTools = expanded
              ? groupTools
              : groupTools.slice(0, defaultShow);
            return (
              <div key={sg.filter}>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {sg.label}
                </p>
                <div className="space-y-1.5">
                  {visibleGroupTools.map(renderToolRow)}
                </div>
                {!expanded && groupTools.length > defaultShow && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    +{groupTools.length - defaultShow} 件
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">{visibleTools.map(renderToolRow)}</div>
      )}
    </section>
  );
}
