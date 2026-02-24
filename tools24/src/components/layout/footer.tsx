import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 tools24.jp</p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/tokushoho" className="hover:text-foreground transition-colors">
              特商法表記
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              お問い合わせ
            </Link>
          </nav>
          <p className="text-xs">tools24.jp — 便利なWebツールを無料で</p>
        </div>
      </div>
    </footer>
  );
}
