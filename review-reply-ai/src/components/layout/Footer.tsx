import Image from 'next/image'
import { AudioWaveform, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AudioWaveform className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">
                MyReply<span className="text-amber-400">Tone</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-xs">
              Google口コミ・食べログ・ホットペッパーの口コミに<br />
              あなたらしい返信文をAIが即座に生成。
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-12 text-sm">
            <div>
              <p className="font-medium text-white mb-3">機能</p>
              <ul className="space-y-2">
                <li><a href="/diagnosis" className="hover:text-amber-400 transition-colors">性格診断</a></li>
                <li><a href="/generator" className="hover:text-amber-400 transition-colors">口コミ返信生成</a></li>
                <li><a href="/#pricing" className="hover:text-amber-400 transition-colors">料金プラン</a></li>
                <li><a href="/#faq" className="hover:text-amber-400 transition-colors">よくある質問</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white mb-3">ガイド</p>
              <ul className="space-y-2">
                <li><a href="/guide/google-review-reply" className="hover:text-amber-400 transition-colors">Google口コミ返信の書き方</a></li>
                <li><a href="/guide/negative-review" className="hover:text-amber-400 transition-colors">悪い口コミへの対応方法</a></li>
                <li><a href="/guide/meo" className="hover:text-amber-400 transition-colors">MEO対策の基本</a></li>
                <li><a href="/guide/industry-tips" className="hover:text-amber-400 transition-colors">業種別・返信のコツ</a></li>
                <li><a href="/guide" className="hover:text-amber-400 transition-colors">全ガイドを見る →</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white mb-3">コラム</p>
              <ul className="space-y-2">
                <li><a href="/blog/why-review-reply-matters-2026" className="hover:text-amber-400 transition-colors">口コミ返信の重要性</a></li>
                <li><a href="/blog/ai-review-reply-comparison" className="hover:text-amber-400 transition-colors">AI返信ツール比較</a></li>
                <li><a href="/blog/google-review-increase-tips" className="hover:text-amber-400 transition-colors">口コミを増やすコツ</a></li>
                <li><a href="/blog" className="hover:text-amber-400 transition-colors">全記事を見る →</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white mb-3">サポート</p>
              <ul className="space-y-2">
                <li><a href="/contact" className="hover:text-amber-400 transition-colors">お問い合わせ</a></li>
                <li><a href="/about" className="hover:text-amber-400 transition-colors">運営者情報</a></li>
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">プライバシーポリシー</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition-colors">利用規約</a></li>
                <li><a href="/tokushoho" className="hover:text-amber-400 transition-colors">特定商取引法に基づく表記</a></li>
                <li><a href="/security-policy" className="hover:text-amber-400 transition-colors">情報セキュリティ基本方針</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* セキュリティ・信頼性バッジ */}
        <div className="border-t border-stone-700 mt-8 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <a
              href="/security-policy"
              className="flex items-center gap-2 hover:text-stone-300 transition-colors"
            >
              <Image src="/images/security-action-2star.png" alt="SECURITY ACTION 二つ星" width={20} height={20} className="flex-shrink-0" />
              <span>SECURITY ACTION ★★ 二つ星宣言</span>
            </a>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>セキュリティヘッダー A+ 対応</span>
            </span>
            <a
              href="/privacy#data-detail"
              className="flex items-center gap-2 hover:text-stone-300 transition-colors"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>データ透明性ポリシー公開</span>
            </a>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-6 pt-6 text-sm text-stone-500 text-center">
          © {new Date().getFullYear()} MyReplyTone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
