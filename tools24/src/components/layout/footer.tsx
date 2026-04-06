import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";

export async function Footer(): Promise<React.ReactElement> {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto">
      <Separator />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t("copyright")}</p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/tokushoho" className="hover:text-foreground transition-colors">
              {t("tokushoho")}
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              {t("contact")}
            </Link>
          </nav>
          <p className="text-xs">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
