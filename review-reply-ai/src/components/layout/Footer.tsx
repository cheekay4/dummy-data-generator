import { AudioWaveform } from 'lucide-react'

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
          <div className="flex gap-12 text-sm">
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
              <p className="font-medium text-white mb-3">法的情報</p>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">プライバシーポリシー</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition-colors">利用規約</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-6 text-sm text-stone-500 text-center">
          © {new Date().getFullYear()} MyReplyTone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
