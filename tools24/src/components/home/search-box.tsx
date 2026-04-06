"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { searchTools, type ToolDef } from "@/lib/tools-config";

export function SearchBox(): React.ReactElement {
  const t = useTranslations("common");
  const tTools = useTranslations("tools");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolDef[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchTools(value));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-16 text-sm outline-none transition-colors focus:border-primary"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border bg-card shadow-lg">
          <ul className="max-h-64 overflow-y-auto py-1">
            {results.map((tool) => {
              const Icon = tool.icon;
              return (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    target={tool.external ? "_blank" : undefined}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{tTools(`${tool.id}.title`)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tTools(`${tool.id}.description`)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border bg-card p-4 text-center text-sm text-muted-foreground shadow-lg">
          {t("noResults")}
        </div>
      )}
    </div>
  );
}
