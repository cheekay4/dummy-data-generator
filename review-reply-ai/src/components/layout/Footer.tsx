import { Star } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">AI口コミ返信ジェネレーター</span>
            </div>
            <p className="text-sm text-stone-400 max-w-xs">
              Google口コミ・食べログ・ホットペッパーの口コミに<br />
              プロフェッショナルな返信文をAIが即座に生成。
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-medium text-white mb-3">ツール</p>
              <ul className="space-y-2">
                <li><a href="#generator" className="hover:text-amber-400 transition-colors">口コミ返信生成</a></li>
                <li><a href="#pricing" className="hover:text-amber-400 transition-colors">料金プラン</a></li>
                <li><a href="#faq" className="hover:text-amber-400 transition-colors">よくある質問</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white mb-3">法的情報</p>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">プライバシーポリシー</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition-colors">利用規約</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-6 text-sm text-stone-500 text-center">
          © {new Date().getFullYear()} AI口コミ返信ジェネレーター. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
