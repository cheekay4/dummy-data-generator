"use client";

export type CategoryFilter = "all" | "tools" | "ai" | "kakutei";

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (cat: CategoryFilter) => void;
}

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "tools", label: "ツール" },
  { value: "ai", label: "AIツール" },
  { value: "kakutei", label: "確定申告ツール" },
];

export function CategoryNav({ active, onChange }: CategoryNavProps): React.ReactElement {
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
