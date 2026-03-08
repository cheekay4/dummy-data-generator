import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-400">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row gap-8 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-slate-500 rounded-md flex items-center justify-center">
                <MessageSquare size={12} color="white" />
              </div>
              <span className="text-white font-semibold text-[14px]">引き継ぎAI</span>
            </div>
            <p className="text-[12px] leading-[1.8] max-w-[220px]">
              AIが業務ノウハウを対話で聞き出し、<br />
              後任者が読める引き継ぎ資料を自動作成。
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                機能
              </p>
              <div className="space-y-2">
                <Link href="/interview/new" className="block text-[12px] hover:text-neutral-200 transition-colors">
                  新規作成
                </Link>
                <Link href="/pricing" className="block text-[12px] hover:text-neutral-200 transition-colors">
                  料金プラン
                </Link>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                サポート
              </p>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-[12px] hover:text-neutral-200 transition-colors">
                  プライバシーポリシー
                </Link>
                <Link href="/terms" className="block text-[12px] hover:text-neutral-200 transition-colors">
                  利用規約
                </Link>
                <Link href="/tokushoho" className="block text-[12px] hover:text-neutral-200 transition-colors">
                  特定商取引法
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-6 text-[11px] text-center">
          © 2026 tools24. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
