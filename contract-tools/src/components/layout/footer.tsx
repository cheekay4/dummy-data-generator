import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-16 py-8 bg-muted/40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 契約書チェッカー</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:underline">利用規約</Link>
            <Link href="/tokushoho" className="hover:underline">特商法表記</Link>
          </div>
          <p className="text-xs">AIが契約書のリスク・不利条項を自動検出</p>
        </div>
      </div>
    </footer>
  );
}
