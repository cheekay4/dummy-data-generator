import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-16 py-8 bg-muted/40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 tools24.jp</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
            <Link href="/tokushoho" className="hover:underline">特商法表記</Link>
            <Link href="/contact" className="hover:underline">お問い合わせ</Link>
          </div>
          <p className="text-xs">tools24.jp — 便利なWebツールを無料で</p>
        </div>
      </div>
    </footer>
  );
}
