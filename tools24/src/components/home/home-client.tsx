"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CategoryNav, type CategoryFilter } from "@/components/home/category-nav";
import { CategorySection } from "@/components/home/category-section";
import { getToolsByCategory } from "@/lib/tools-config";

export function HomeClient(): React.ReactElement {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const t = useTranslations("home");

  const toolsCategory = getToolsByCategory("tools");
  const aiCategory = getToolsByCategory("ai");
  const kakuteiCategory = getToolsByCategory("kakutei");

  const showTools = category === "all" || category === "tools";
  const showAI = category === "all" || category === "ai";
  const showKakutei = category === "all" || category === "kakutei";

  return (
    <div className="space-y-8">
      <CategoryNav active={category} onChange={setCategory} />

      {showTools && (
        <CategorySection
          title={t("categoryTools")}
          tools={toolsCategory}
          subgroups={[
            { label: t("subgroupWeb"), filter: "web" },
            { label: t("subgroupDev"), filter: "dev" },
          ]}
          iconBg="bg-blue-500"
        />
      )}

      {showAI && (
        <CategorySection
          title={t("categoryAI")}
          tools={aiCategory}
          iconBg="bg-purple-500"
          defaultShow={10}
        />
      )}

      {showKakutei && (
        <CategorySection
          title={t("categoryTax")}
          tools={kakuteiCategory}
          iconBg="bg-green-600"
          defaultShow={3}
        />
      )}
    </div>
  );
}
