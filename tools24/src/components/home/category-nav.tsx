"use client";

import { useTranslations } from "next-intl";

export type CategoryFilter = "all" | "tools" | "ai" | "kakutei";

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (cat: CategoryFilter) => void;
}

export function CategoryNav({ active, onChange }: CategoryNavProps): React.ReactElement {
  const t = useTranslations("home");

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: t("categoryAll") },
    { value: "tools", label: t("categoryTools") },
    { value: "ai", label: t("categoryAI") },
    { value: "kakutei", label: t("categoryTax") },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" role="tablist">
      {categories.map((cat) => (
        <button
          key={cat.value}
          role="tab"
          aria-selected={active === cat.value}
          onClick={() => onChange(cat.value)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
            active === cat.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
