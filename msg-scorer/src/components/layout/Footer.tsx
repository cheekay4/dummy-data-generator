import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* ロゴ */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-indigo-400 text-lg font-bold font-outfit">◆</span>
              <span className="font-outfit font-bold text-white text-base">MsgScore</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
              メール・LINE配信文をセグメント×目的別にAIが評価。<br />
              配信前チェックで開封率・CV数を改善。
            </p>
          </div>

          {/* リンク */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <p className="text-xs font-medium text-stone-300 mb-3 uppercase tracking-wider">プロダクト</p>
              <nav className="flex flex-col gap-2">
                <Link href="/score" className="text-sm hover:text-stone-200 transition-colors">スコアリング</Link>
                <Link href="/pricing" className="text-sm hover:text-stone-200 transition-colors">料金プラン</Link>
              </nav>
            </div>
            <div>
              <p className="text-xs font-medium text-stone-300 mb-3 uppercase tracking-wider">法的情報</p>
              <nav className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm hover:text-stone-200 transition-colors">プライバシーポリシー</Link>
                <Link href="/terms" className="text-sm hover:text-stone-200 transition-colors">利用規約</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 text-xs text-stone-600">
          © 2026 MsgScore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
