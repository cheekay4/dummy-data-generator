import { getTranslations } from "next-intl/server";

interface AdPlaceholderProps {
  slot: string;
  width: number;
  height: number;
  isPro?: boolean;
}

export async function AdPlaceholder({ slot, width, height, isPro = false }: AdPlaceholderProps): Promise<React.ReactElement | null> {
  if (isPro) return null;

  const t = await getTranslations("common");

  return (
    <div
      className="flex items-center justify-center bg-muted/40 border border-dashed border-muted-foreground/30 rounded text-muted-foreground/50 text-sm select-none"
      style={{ width: "100%", maxWidth: width, height: height, minHeight: height }}
      data-ad-slot={slot}
    >
      {t("ad")}
    </div>
  );
}
